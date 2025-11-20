using Autofac;
using Autofac.Integration.Mvc;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Controllers.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.DTO.Payment;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels;
using Fanex.Affiliate.Admin.Core.MetaModels.Payment;
using Fanex.Affiliate.Admin.Core.Services.Auth;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.Payment;
using Fanex.Affiliate.Admin.Core.UnitTests.TestHelper;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Controllers.Affiliate
{
    public class PaymentRequestControllerTest
    {
        private ILifetimeScopeProvider scopeProvider;

        [Fact]
        public void Index_WhenCall_ReturnView()
        {
            // Arrange
            var controller = CreatePaymentRequestController();

            var urlHelperMock = new Mock<UrlHelper>();
            urlHelperMock.Setup(m => m.Content(It.IsAny<string>())).Returns("/Portal/PaymentRequest");

            controller.Url = urlHelperMock.Object;
            // Action
            var viewResult = controller.Index(new PaymentRequestParamFromHome { SearchBy = 1, FromDate = "21/04/2020", Status = "Approved", IsFromHome = true }) as ViewResult;
            var viewName = viewResult.ViewName;

            // Assert
            Assert.Equal("~/Areas/Portal/Views/Affiliate/PaymentRequest.cshtml", viewName);
        }

        [Fact]
        public void GetPaymentRequestList_WhenCallWithValidParam_ExcuteWithCorrectData()
        {
            // Arrange
            var param = new PaymentRequestParam();
            PaymentRequestParam passedParam = null;
            var paymentRequestService = new Mock<IPaymentService>();
            paymentRequestService.Setup(t => t.GetPaymentRequestList(param)).Returns(new EntityResult<PaymentRequest> { MainData = new List<PaymentRequest> { new PaymentRequest() }, TotalItem = 1 }).Callback<PaymentRequestParam>(p => passedParam = p);
            var controller = CreatePaymentRequestController(paymentRequestService: paymentRequestService.Object);

            // Action
            var result = controller.GetPaymentRequestList(param) as JsonNetResult;
            var entityResult = result.Data as EntityResult<PaymentRequest>;

            // Assert
            Assert.Single(entityResult.MainData);
            Assert.Equal(1, entityResult.TotalItem);
            Assert.Equal(param, passedParam);
        }

        [Fact]
        public void GetPaymentRequestList_WhenCallWithInvalidParam_ReturnEmptyData()
        {
            // Arrange
            var controller = CreatePaymentRequestController();
            controller.ModelState.AddModelError("Error01", string.Empty);

            // Action
            var result = controller.GetPaymentRequestList(new PaymentRequestParam()) as JsonNetResult;

            // Assert
            Assert.Null(result.Data);
        }

        [Fact]
        public void GetPaymentRequestDetail_WhenCallWithValidParam_ExcuteWithCorrectData()
        {
            // Arrange
            var param = 123L;
            var passedParam = 0L;
            var paymentRequestService = new Mock<IPaymentService>();
            paymentRequestService.Setup(t => t.GetPaymentRequestDetail(param)).Returns(new PaymentRequestDetail { TransId = 123 }).Callback<long>(p => passedParam = p);
            var controller = CreatePaymentRequestController(paymentRequestService: paymentRequestService.Object);

            // Action
            var result = controller.GetPaymentRequestDetail(param) as JsonNetResult;
            var entityResult = result.Data as PaymentRequestDetail;

            // Assert
            Assert.Equal(param, entityResult.TransId);
            Assert.Equal(param, passedParam);
        }

        [Fact]
        public void GetPaymentRequestDetail_WhenCallWithInvalidParam_ReturnEmptyData()
        {
            // Arrange
            var controller = CreatePaymentRequestController();

            // Action
            var result = controller.GetPaymentRequestDetail(0) as JsonNetResult;

            // Assert
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task UpdatePaymentRequest_WhenCallWithValidParam_UpdateSuccessful()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.Environment).Returns("UAT");
            appSetting.Setup(a => a.IsProduction).Returns(true);

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var param = new PaymentRequestUpdateParam { TransId = 123 };
            PaymentRequestUpdateParam passedParam = null;
            var paymentRequestService = new Mock<IPaymentService>();
            paymentRequestService.Setup(s => s.HandlePaymentRequestAsync(It.IsAny<PaymentRequestUpdateParam>(), It.IsAny<PaymentRequestUpdateEmail>()))
                .Returns(Task.FromResult(new ResultInfo()))
                .Callback<PaymentRequestUpdateParam, PaymentRequestUpdateEmail>((a, b) => passedParam = a);

            var authService = new Mock<IAuthService>();
            authService.Setup(a => a.CheckPermission(It.IsAny<CheckPermissionParam>())).Returns(new ResultInfo());
            var controller = CreatePaymentRequestController(null, paymentRequestService.Object, authService.Object);

            // Action
            var result = await controller.UpdatePaymentRequest(param) as JsonNetResult;
            var resultInfo = result.Data as ResultInfo;

            // Assert
            Assert.True(resultInfo.IsSuccessful);
            Assert.Equal(param.TransId, passedParam.TransId);
        }

        [Fact]
        public async Task UpdatePaymentRequest_WhenCallWithNotHavePermission_ReturnError()
        {
            // Arrange
            var param = new PaymentRequestUpdateParam { TransId = 123 };

            var authService = new Mock<IAuthService>();
            authService.Setup(a => a.CheckPermission(It.IsAny<CheckPermissionParam>())).Returns(new ResultInfo { Code = ErrCode.GeneralErrorCode });
            var controller = CreatePaymentRequestController(null, null, authService.Object);

            // Action
            var result = await controller.UpdatePaymentRequest(param) as JsonNetResult;
            var resultInfo = result.Data as ResultInfo;

            // Assert
            Assert.False(resultInfo.IsSuccessful);
        }

        [Fact]
        public async Task UpdatePaymentRequest_WhenCallWithInvalidParam_ReturnError()
        {
            // Arrange
            var controller = CreatePaymentRequestController();
            controller.ModelState.AddModelError("Error01", "Failed!");

            // Action
            var result = await controller.UpdatePaymentRequest(new PaymentRequestUpdateParam()) as JsonNetResult;
            var resultInfo = result.Data as ResultInfo;

            // Assert
            Assert.False(resultInfo.IsSuccessful);
            Assert.Equal("Transaction not exists!", resultInfo.Message);
        }

        private PaymentRequestController CreatePaymentRequestController(
            ISessionService sessionService = null,
            IPaymentService paymentRequestService = null,
            IAuthService authService = null
            )
        {
            var fakeSessionService = sessionService ?? MockingHelper.GetSessionService();
            var fakePaymentRequestService = paymentRequestService ?? Mock.Of<IPaymentService>();
            var fakeauthService = authService ?? Mock.Of<IAuthService>();

            var controller = new PaymentRequestController(fakeSessionService, fakePaymentRequestService, fakeauthService);

            var request = MockingHelper.GetHttpRequest();
            var server = new Mock<HttpServerUtilityBase>();
            server.Setup(s => s.HtmlEncode(It.IsAny<string>())).Returns<string>(s => $"Encoded{s}");

            controller.ControllerContext = Mock.Of<ControllerContext>(ctx =>
                ctx.HttpContext.Request == request &&
                ctx.HttpContext.Server == server.Object &&
                ctx.HttpContext.Session.SessionID == "SessionId"
            );

            var expectedPath = "~/";
            var expectedContent = "/";
            var urlHelperMock = new Mock<UrlHelper>();
            urlHelperMock
                .Setup(m => m.Content(expectedPath))
                .Returns(expectedContent);

            controller.Url = urlHelperMock.Object;

            return controller;
        }
    }
}