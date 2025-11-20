using Autofac;
using Autofac.Integration.Mvc;
using Fanex.Affiliate.Admin.Core.Commands.Affiliate;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Criterias.PaymentRequest;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.DTO.Payment;
using Fanex.Affiliate.Admin.Core.MetaModels.Payment;
using Fanex.Affiliate.Admin.Core.Services.Affiliate;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Fanex.Affiliate.Admin.Core.Services.Email;
using Fanex.Affiliate.Admin.Core.Services.Payment;
using Fanex.Affiliate.Admin.Core.UnitTests.TestHelper;
using Fanex.Data.Repository;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services.Payment
{
    public class PaymentRequestServiceTest
    {
        private ILifetimeScopeProvider scopeProvider;

        [Fact]
        public void GetPaymentRequestList_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var param = new PaymentRequestParam();
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Fetch<PaymentRequest>(It.IsAny<PaymentRequestCriteria>(), It.IsAny<string>())).Returns(new List<PaymentRequest> { new PaymentRequest() });

            var service = CreatePaymentRequestService(dynamicRepository: dynamicRepository.Object);

            // Action
            var result = service.GetPaymentRequestList(param);

            // Assert
            dynamicRepository.Verify(d => d.Fetch<PaymentRequest>(It.Is<PaymentRequestCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.Single(result.MainData);
        }

        [Fact]
        public void GetPaymentRequestDetail_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var transId = 123;
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { TransId = transId });

            var service = CreatePaymentRequestService(dynamicRepository: dynamicRepository.Object);

            // Action
            var result = service.GetPaymentRequestDetail(transId);

            // Assert
            dynamicRepository.Verify(d => d.Get<PaymentRequestDetail>(It.Is<PaymentRequestDetailCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.Equal(transId, result.TransId);
        }

        [Fact]
        public void UpdatePaymentRequest_WhenCall_UpdateFailed()
        {
            // Arrange
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "abc" });

            var service = CreatePaymentRequestService(dynamicRepository: dynamicRepository.Object);

            // Action
            var result = service.UpdatePaymentRequest(new PaymentRequestUpdateParam { IsApproved = true }, new PaymentRequestUpdateEmail());

            // Assert
            Assert.False(result.IsSuccessful);
            Assert.Equal("Payment request is not valid", result.Message);
        }

        [Fact]
        public void UpdatePaymentRequest_WhenCall_UpdateFailedWithNull()
        {
            // Arrange
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(null as PaymentRequestDetail);

            var service = CreatePaymentRequestService(dynamicRepository: dynamicRepository.Object);

            // Action
            var result = service.UpdatePaymentRequest(new PaymentRequestUpdateParam { IsApproved = true }, new PaymentRequestUpdateEmail());

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public void UpdatePaymentRequest_WhenCall_UpdateSuccessful()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.AsianAffSiteUrl).Returns("Asian");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>()));
            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { AffType = 2 });

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object);

            // Action
            var result = service.UpdatePaymentRequest(new PaymentRequestUpdateParam(), new PaymentRequestUpdateEmail());

            // Assert
            dynamicRepository.Verify(d => d.Execute(It.Is<UpdatePaymentRequestCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && !c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public void UpdatePaymentRequest_WhenCall_UpdateSuccessfulHasPreferredLanguage()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.EuropeanAffSiteUrl).Returns("Euro");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>()));
            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object);

            // Action
            var result = service.UpdatePaymentRequest(new PaymentRequestUpdateParam(), new PaymentRequestUpdateEmail());

            // Assert
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task HandlePaymentRequestAsync_WhenCallWithInvalidCustomer_ReturnError()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.MemberSiteId).Returns(1);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });

            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var licenseeService = new Mock<ILicenseeService>();
            licenseeService.Setup(a => a.GetMemberSiteCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo { Status = 4 }));
            licenseeService.Setup(a => a.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo { Code = 4 });
            licenseeService.Setup(a => a.UnlockUserAsync(It.IsAny<int>())).Returns(Task.FromResult(new ResultInfo { Code = ErrCode.GeneralErrorCode }));

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object, licenseeService.Object, appSetting.Object);

            // Action
            var result = await service.HandlePaymentRequestAsync(new PaymentRequestUpdateParam(), new PaymentRequestUpdateEmail());

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task HandlePaymentRequestAsync_WhenCall_UpdateFailed()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.MemberSiteId).Returns(1);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>())).Callback<INonQueryCommand, string>((c, _) => (c as UpdatePaymentRequestCommand).ErrCode = ErrCode.GeneralErrorCode);

            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var licenseeService = new Mock<ILicenseeService>();
            licenseeService.Setup(a => a.GetMemberSiteCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo()));
            licenseeService.Setup(a => a.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo { Code = ErrCode.GeneralErrorCode });

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object, licenseeService.Object, appSetting.Object);

            // Action
            var result = await service.HandlePaymentRequestAsync(new PaymentRequestUpdateParam(), new PaymentRequestUpdateEmail());

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task HandlePaymentRequestAsync_WhenCallWithReject_UpdateSuccessfully()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.MemberSiteId).Returns(1);
            appSetting.Setup(a => a.EuropeanAffSiteUrl).Returns("Euro");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>()));

            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var licenseeService = new Mock<ILicenseeService>();
            licenseeService.Setup(a => a.GetMemberSiteCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo()));
            licenseeService.Setup(a => a.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo());

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object, licenseeService.Object, appSetting.Object);

            // Action
            var result = await service.HandlePaymentRequestAsync(new PaymentRequestUpdateParam(), new PaymentRequestUpdateEmail());

            // Assert
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task HandlePaymentRequestAsync_WhenCallWithApproved_UpdateSuccessfully()
        {
            // Arrange
            MockingHelper.SetUpLogEngineEnviroment();
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.MemberSiteId).Returns(1);
            appSetting.Setup(a => a.EuropeanAffSiteUrl).Returns("Euro");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>()));

            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var licenseeService = new Mock<ILicenseeService>();
            licenseeService.Setup(a => a.GetMemberSiteCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo()));
            licenseeService.Setup(a => a.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo());
            licenseeService.Setup(l => l.UpdatePaymentRequestAsync(It.IsAny<PaymentRequestInfo>())).Returns(Task.FromResult(new ResultInfo()));

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object, licenseeService.Object, appSetting.Object);

            // Action
            var result = await service.HandlePaymentRequestAsync(new PaymentRequestUpdateParam { IsApproved = true }, new PaymentRequestUpdateEmail());

            // Assert
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task HandlePaymentRequestAsync_WhenCallWithApproved_UpdateFailed()
        {
            // Arrange
            MockingHelper.SetUpLogEngineEnviroment();
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.MemberSiteId).Returns(1);
            appSetting.Setup(a => a.EuropeanAffSiteUrl).Returns("Euro");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>()));

            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var licenseeService = new Mock<ILicenseeService>();
            licenseeService.Setup(a => a.GetMemberSiteCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo()));
            licenseeService.Setup(a => a.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo());
            licenseeService.Setup(l => l.UpdatePaymentRequestAsync(It.IsAny<PaymentRequestInfo>())).Returns(Task.FromResult(new ResultInfo { Code = ErrCode.GeneralErrorCode }));

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object, licenseeService.Object, appSetting.Object);

            // Action
            var result = await service.HandlePaymentRequestAsync(new PaymentRequestUpdateParam { IsApproved = true }, new PaymentRequestUpdateEmail());

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public void HandlePaymentRequestAsync_WhenCallWithApproved_HaveException()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.MemberSiteId).Returns(1);
            appSetting.Setup(a => a.EuropeanAffSiteUrl).Returns("Euro");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(l => l.Get<PaymentRequestDetail>(It.IsAny<PaymentRequestDetailCriteria>(), It.IsAny<string>())).Returns(new PaymentRequestDetail { Status = "processing" });
            dynamicRepository.Setup(l => l.Execute(It.IsAny<UpdatePaymentRequestCommand>(), It.IsAny<string>()));

            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(a => a.GetAffiliateBasicInfo(It.IsAny<int?>(), null)).Returns(new AffiliateBasicInfo { PreferredLanguage = "vi-VN", AffType = 4 });

            var licenseeService = new Mock<ILicenseeService>();
            licenseeService.Setup(a => a.GetMemberSiteCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo()));
            licenseeService.Setup(a => a.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo());
            licenseeService.Setup(l => l.UpdatePaymentRequestAsync(It.IsAny<PaymentRequestInfo>())).Returns(Task.FromResult(new ResultInfo { Code = ErrCode.GeneralErrorCode })).Callback<PaymentRequestInfo>(p => throw new System.Exception());

            var service = CreatePaymentRequestService(null, affiliateService.Object, dynamicRepository.Object, licenseeService.Object, appSetting.Object);

            // Action
            var result = service.HandlePaymentRequestAsync(new PaymentRequestUpdateParam { IsApproved = true }, new PaymentRequestUpdateEmail());

            // Assert
            Assert.Single(result.Exception.InnerExceptions);
        }

        private static PaymentService CreatePaymentRequestService(
            IEmailService emailService = null,
            IAffiliateService affiliateService = null,
            IDynamicRepository dynamicRepository = null,
            ILicenseeService licenseeService = null,
            IAppSetting appSetting = null)
        {
            var fakeEmailService = emailService ?? Mock.Of<IEmailService>();
            var fakeAffiliateService = affiliateService ?? Mock.Of<IAffiliateService>();
            var fakedynamicRepository = dynamicRepository ?? Mock.Of<IDynamicRepository>();
            var fakeLicenseeService = licenseeService ?? Mock.Of<ILicenseeService>();
            var fakeAppSetting = appSetting ?? Mock.Of<IAppSetting>();

            return new PaymentService(fakedynamicRepository, fakeAffiliateService, fakeLicenseeService, fakeEmailService, fakeAppSetting);
        }
    }
}