using Autofac;
using Autofac.Integration.Mvc;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Controllers;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Customer;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.Customer;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.Customer;
using Fanex.Affiliate.Admin.Core.UnitTests.TestHelper;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Controllers.Customer
{
    public class CustomerLeftPanelControllerTest
    {
        private ILifetimeScopeProvider scopeProvider;

        [Fact]
        public void GetAffiliateInfo_WhenCallWithValidParam_ExcuteWithCorrectData()
        {
            // Arrange
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.GetAffiliateInfoOnLeftPanel(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Returns(new AffiliateInfoOnLeftPanel { AffName = "12BETAFF226" });
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            // Action
            var result = controller.GetAffiliateInfo("12BETAFF226") as JsonNetResult;
            var item = result.Data as AffiliateInfoOnLeftPanel;

            // Assert
            Assert.Equal("12BETAFF226", item.AffName);
        }

        [Fact]
        public void GetAffiliateInfo_WhenCallWithInvalidParam_ReturnNull()
        {
            // Arrange
            var controller = CreateCustomerLeftPanelController();

            // Action
            var result = controller.GetAffiliateInfo(string.Empty) as JsonNetResult;

            // Assert
            Assert.Null(result.Data);
        }

        [Fact]
        public void GetOnlineList_WhenCallWithValidParam_ExcuteWithCorrectData()
        {
            // Arrange
            var param = "12BETAFF226";
            var passedParam = string.Empty;
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.GetOnlineList(param)).Returns(new List<OnlineList> { new OnlineList() }).Callback<string>(p => passedParam = p);
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            // Action
            var result = controller.GetOnlineList(param) as JsonNetResult;
            var data = result.Data as List<OnlineList>;

            // Assert
            Assert.Single(data);
            Assert.Equal(param, passedParam);
        }

        [Fact]
        public void GetOnlineList_WhenCallWithInvalidParam_ReturnNull()
        {
            // Arrange
            var controller = CreateCustomerLeftPanelController();

            // Action
            var result = controller.GetOnlineList(string.Empty) as JsonNetResult;

            // Assert
            Assert.Null(result.Data);
        }

        [Fact]
        public void GetTransferLimitSetting_WhenCallWithValidParam_ExcuteWithCorrectData()
        {
            // Arrange
            var param = "123";
            var passedParam = 0;
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.GetTransferLimitSetting(It.IsAny<int>())).Returns(new TransferLimitSettingInfo()).Callback<int>(p => passedParam = p);
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            // Action
            var result = controller.GetTransferLimitSetting(param) as JsonNetResult;
            var data = result.Data as TransferLimitSettingInfo;

            // Assert
            Assert.NotNull(data);
            Assert.Equal(123, passedParam);
        }

        [Fact]
        public void GetTransferLimitSetting_WhenCallWithInvalidParam_ReturnNull()
        {
            // Arrange
            var controller = CreateCustomerLeftPanelController();

            // Action
            var result = controller.GetTransferLimitSetting(string.Empty) as JsonNetResult;

            // Assert
            Assert.Null(result.Data);
        }

        [Fact]
        public void UpdateTransferLimitSetting_WhenCallWithValidParam_ExcuteSuccessfully()
        {
            // Arrange
            var param = new TransferLimitSettingParam { AffId = 1271808 };
            TransferLimitSettingParam passedParam = null;
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.UpdateTransferLimitSetting(It.IsAny<TransferLimitSettingParam>())).Returns(new ResultInfo()).Callback<TransferLimitSettingParam>(p => passedParam = p);
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            // Action
            var result = controller.UpdateTransferLimitSetting(param) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.True(data.IsSuccessful);
            Assert.Equal(param.AffId, passedParam.AffId);
        }

        [Fact]
        public void UpdateTransferLimitSetting_WhenCallWithInvalidParam_ReturnError()
        {
            // Arrange
            var controller = CreateCustomerLeftPanelController();
            controller.ModelState.AddModelError("Error01", "Amount is invalid!");

            // Action
            var result = controller.UpdateTransferLimitSetting(new TransferLimitSettingParam()) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.False(data.IsSuccessful);
            Assert.Equal("Amount is invalid!", data.Message);
        }

        [Fact]
        public void UpdateLanguage_WhenCallWithValidParam_ExcuteSuccessfully()
        {
            // Arrange
            var param = new UpdateLanguageParam { AffId = 1271808, PreferredLanguage = "en-US" };
            UpdateLanguageParam passedParam = null;
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.UpdateLanguage(It.IsAny<UpdateLanguageParam>())).Returns(new ResultInfo()).Callback<UpdateLanguageParam>(p => passedParam = p);
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            // Action
            var result = controller.UpdateLanguage(param) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.True(data.IsSuccessful);
            Assert.Equal(param.AffId, passedParam.AffId);
        }

        [Fact]
        public void UpdateLanguage_WhenCallWithInvalidParam_ReturnError()
        {
            // Arrange
            var controller = CreateCustomerLeftPanelController();
            controller.ModelState.AddModelError("Error01", string.Empty);

            // Action
            var result = controller.UpdateLanguage(new UpdateLanguageParam()) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.False(data.IsSuccessful);
            Assert.Equal("Update Language is failed!", data.Message);
        }

        [Fact]
        public void UpdateAffType_WhenCallWithValidParam_ExcuteSuccessfully()
        {
            // Arrange
            var param = new UpdateAffTypeParam { AffId = 1271808, AffType = 2 };
            UpdateAffTypeParam passedParam = null;
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.UpdateAffType(param)).Returns(new ResultInfo()).Callback<UpdateAffTypeParam>(p => passedParam = p);
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            // Action
            var result = controller.UpdateAffType(param) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.True(data.IsSuccessful);
            Assert.Equal(param.AffId, passedParam.AffId);
        }

        [Fact]
        public void UpdateAffType_WhenCallWithInvalidParam_ReturnError()
        {
            // Arrange
            var controller = CreateCustomerLeftPanelController();
            controller.ModelState.AddModelError("Error01", string.Empty);

            // Action
            var result = controller.UpdateAffType(new UpdateAffTypeParam()) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.False(data.IsSuccessful);
            Assert.Equal("Update Affiliate Type is failed!", data.Message);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithValidParam_ExcuteSuccessfully()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.Environment).Returns("LOCAL");
            appSetting.Setup(a => a.IsProduction).Returns(false);

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var param = new UpdateStatusParam { AffId = 1271808, Status = "Approved" };
            var customerLeftPanelService = new Mock<ICustomerLeftPanelService>();
            customerLeftPanelService.Setup(s => s.UpdateStatusAsync(It.IsAny<UpdateStatusParam>(), It.IsAny<AffInformationEmail>())).Returns(Task.FromResult(new ResultInfo()));
            var controller = CreateCustomerLeftPanelController(customerLeftPanelService: customerLeftPanelService.Object);

            var expectedPath = "~/";
            var expectedContent = "/";
            var urlHelperMock = new Mock<UrlHelper>();
            urlHelperMock
                .Setup(m => m.Content(expectedPath))
                .Returns(expectedContent);

            controller.Url = urlHelperMock.Object;
            // Action
            var result = await controller.UpdateStatus(param) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.True(data.IsSuccessful);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithInvalidParam_ReturnError()
        {
            // Arrange
            var errorMsg = "Update Status is failed!";
            var controller = CreateCustomerLeftPanelController();
            controller.ModelState.AddModelError("Error01", errorMsg);

            // Action
            var result = await controller.UpdateStatus(new UpdateStatusParam()) as JsonNetResult;
            var data = result.Data as ResultInfo;

            // Assert
            Assert.False(data.IsSuccessful);
            Assert.Equal(errorMsg, data.Message);
        }

        private CustomerLeftPanelController CreateCustomerLeftPanelController(
            ISessionService sessionService = null,
            ICustomerLeftPanelService customerLeftPanelService = null
            )
        {
            var fakeSessionService = sessionService ?? MockingHelper.GetSessionService();
            var fakeCustomerLeftPanelService = customerLeftPanelService ?? Mock.Of<ICustomerLeftPanelService>();

            var controller = new CustomerLeftPanelController(fakeSessionService, fakeCustomerLeftPanelService);

            var request = MockingHelper.GetHttpRequest();
            var server = new Mock<HttpServerUtilityBase>();
            server.Setup(s => s.HtmlEncode(It.IsAny<string>())).Returns<string>(s => $"Encoded{s}");

            controller.ControllerContext = Mock.Of<ControllerContext>(ctx =>
                ctx.HttpContext.Request == request &&
                ctx.HttpContext.Server == server.Object &&
                ctx.HttpContext.Session.SessionID == "SessionId"
            );

            return controller;
        }
    }
}
