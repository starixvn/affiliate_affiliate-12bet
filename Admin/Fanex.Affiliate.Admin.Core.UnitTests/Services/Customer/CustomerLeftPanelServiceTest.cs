using Autofac;
using Autofac.Integration.Mvc;
using Fanex.Affiliate.Admin.Core.Commands.Customer;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Criterias.Customer;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Customer;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.MetaModels.Customer;
using Fanex.Affiliate.Admin.Core.Services.Affiliate;
using Fanex.Affiliate.Admin.Core.Services.Customer;
using Fanex.Affiliate.Admin.Core.Services.Email;
using Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee;
using Fanex.Affiliate.Admin.Core.UnitTests.TestHelper;
using Fanex.Data.Repository;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services.Customer
{
    public class CustomerLeftPanelServiceTest
    {
        private ILifetimeScopeProvider scopeProvider;

        [Fact]
        public void GetAffiliateInfoOnLeftPanel_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Get<AffiliateInfoOnLeftPanel>(It.IsAny<AffiliateInfoOnLeftPanelCriteria>(), It.IsAny<string>())).Returns(null as AffiliateInfoOnLeftPanel);
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.GetAffiliateInfoOnLeftPanel("12BETAFF226", "", "", "");

            // Assert
            repository.Verify(d => d.Get<AffiliateInfoOnLeftPanel>(It.Is<AffiliateInfoOnLeftPanelCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.Null(result);
        }

        [Fact]
        public void GetAffiliateInfoOnLeftPanel_WhenCall_ReturnCorrectDataWithAsian()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.InternalAsianAffiliateUrl).Returns("http://localhost:55690/Auth/AdminLogin");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Get<AffiliateInfoOnLeftPanel>(It.IsAny<AffiliateInfoOnLeftPanelCriteria>(), It.IsAny<string>())).Returns(new AffiliateInfoOnLeftPanel { AffName = "12BETAFF226", AffType = AffType.Asian });
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.GetAffiliateInfoOnLeftPanel("12BETAFF226", "123", "234", "345");

            // Assert
            repository.Verify(d => d.Get<AffiliateInfoOnLeftPanel>(It.Is<AffiliateInfoOnLeftPanelCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.Equal("12BETAFF226", result.AffName);
            Assert.Equal(AffType.Asian, result.AffType);
        }

        [Fact]
        public void GetAffiliateInfoOnLeftPanel_WhenCall_ReturnCorrectDataWithEuropean()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.InternalEuropeanAffiliateUrl).Returns("http://localhost:55690/Auth/AdminLogin");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Get<AffiliateInfoOnLeftPanel>(It.IsAny<AffiliateInfoOnLeftPanelCriteria>(), It.IsAny<string>())).Returns(new AffiliateInfoOnLeftPanel { AffName = "12BETAFF226", AffType = AffType.European });
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.GetAffiliateInfoOnLeftPanel("12BETAFF226", "123", "234", "345");

            // Assert
            repository.Verify(d => d.Get<AffiliateInfoOnLeftPanel>(It.Is<AffiliateInfoOnLeftPanelCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.Equal("12BETAFF226", result.AffName);
            Assert.Equal(AffType.European, result.AffType);
        }

        [Fact]
        public void GetOnlineList_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var param = "12BETAFF226";
            var passedParam = string.Empty;
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Fetch<OnlineList>(It.IsAny<AffiliateOnlineCriteria>(), It.IsAny<string>())).Returns(new List<OnlineList> { new OnlineList() }).Callback<ICriteria, string>((p, _) => passedParam = (p as AffiliateOnlineCriteria).Username);
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.GetOnlineList(param);

            // Assert
            repository.Verify(d => d.Fetch<OnlineList>(It.Is<AffiliateOnlineCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.Single(result);
            Assert.Equal(param, passedParam);
        }

        [Fact]
        public void GetTransferLimitSetting_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var param = 123;
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Get<TransferLimitSettingInfo>(It.IsAny<TransferLimitCriteria>(), It.IsAny<string>())).Returns(new TransferLimitSettingInfo());
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.GetTransferLimitSetting(param);

            // Assert
            repository.Verify(d => d.Get<TransferLimitSettingInfo>(It.Is<TransferLimitCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.NotNull(result);
        }

        [Fact]
        public void UpdateTransferLimitSetting_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var param = new TransferLimitSettingParam { TransferLimit = 100 };
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Execute(It.IsAny<UpdateTransferLimitCommand>(), It.IsAny<string>()));
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.UpdateTransferLimitSetting(param);

            // Assert
            repository.Verify(d => d.Execute(It.Is<UpdateTransferLimitCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && !c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public void UpdateTransferLimitSetting_WhenCallInvalidParam_ReturnError()
        {
            // Arrange
            var param = new TransferLimitSettingParam { DisabledTransfer = false };
            var service = CreateCustomerLeftPanelService();

            // Action
            var result = service.UpdateTransferLimitSetting(param);

            // Assert
            Assert.False(result.IsSuccessful);
            Assert.Equal("Limit must be a whole positive number.", result.Message);
        }

        [Fact]
        public void UpdateAffType_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var param = new UpdateAffTypeParam();
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Execute(It.IsAny<UpdateAffTypeCommand>(), It.IsAny<string>()));
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.UpdateAffType(param);

            // Assert
            repository.Verify(d => d.Execute(It.Is<UpdateAffTypeCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && !c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public void UpdateLanguage_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var param = new UpdateLanguageParam();
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.Execute(It.IsAny<UpdateLanguageCommand>(), It.IsAny<string>()));
            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = service.UpdateLanguage(param);

            // Assert
            repository.Verify(d => d.Execute(It.Is<UpdateLanguageCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && !c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithDisapprovedEmail_ReturnCorrectDataWithDefaultLanguage()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.AsianAffSiteUrl).Returns("https://aff-12b.nexdev.net/UserAsian");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var param = new UpdateStatusParam { AffId = 1271808, Status = "disapproved" };
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.ExecuteAsync(It.IsAny<UpdateStatusCommand>(), It.IsAny<string>()));
            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(aff => aff.GetAffiliateBasicInfo(It.IsAny<int>(), null)).Returns(new AffiliateBasicInfo { AffId = 1271808, AffType = 2 });

            var service = CreateCustomerLeftPanelService(affiliateService: affiliateService.Object, customerLeftPanelRepository: repository.Object);

            // Action
            var result = await service.UpdateStatusAsync(param, new AffInformationEmail());

            // Assert
            repository.Verify(d => d.ExecuteAsync(It.Is<UpdateStatusCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithDisapprovedEmail_ReturnCorrectData()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.AsianAffSiteUrl).Returns("https://aff-12b.nexdev.net/UserAsian");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var param = new UpdateStatusParam { AffId = 1271808, Status = "disapproved" };
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.ExecuteAsync(It.IsAny<UpdateStatusCommand>(), It.IsAny<string>()));
            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(aff => aff.GetAffiliateBasicInfo(It.IsAny<int>(), null)).Returns(new AffiliateBasicInfo { AffId = 1271808, AffType = 2, PreferredLanguage = "vi-VN" });

            var service = CreateCustomerLeftPanelService(affiliateService: affiliateService.Object, customerLeftPanelRepository: repository.Object);

            // Action
            var result = await service.UpdateStatusAsync(param, new AffInformationEmail());

            // Assert
            repository.Verify(d => d.ExecuteAsync(It.Is<UpdateStatusCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithApproved_ReturnCorrectData()
        {
            // Arrange
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.AsianAffSiteUrl).Returns("https://aff-12b.nexdev.net/UserAsian");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var param = new UpdateStatusParam { AffId = 1271808, Status = "approved" };
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.ExecuteAsync(It.IsAny<UpdateStatusCommand>(), It.IsAny<string>()));
            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(aff => aff.GetAffiliateBasicInfo(It.IsAny<int>(), null)).Returns(new AffiliateBasicInfo { AffId = 1271808, AffType = 2, PreferredLanguage = "vi-VN" });
            var thirdPartyLicenseeService = new Mock<IThirdPartyLicenseeService>();
            thirdPartyLicenseeService.Setup(comm => comm.SendAffiliateInfoAsync(It.IsAny<AffiliateBasicInfo>())).Returns(Task.CompletedTask);

            var service = CreateCustomerLeftPanelService(null, affiliateService.Object, repository.Object, thirdPartyLicenseeService.Object);

            // Action
            var result = await service.UpdateStatusAsync(param, new AffInformationEmail());

            // Assert
            repository.Verify(d => d.ExecuteAsync(It.Is<UpdateStatusCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithApprovedAndException_ReturnCorrectData()
        {
            // Arrange
            MockingHelper.SetUpHttpContextSession();
            MockingHelper.SetUpLogEngineEnviroment();
            var appSetting = new Mock<IAppSetting>();
            appSetting.Setup(a => a.AsianAffSiteUrl).Returns("https://aff-12b.nexdev.net/UserAsian");

            var builder = new ContainerBuilder();
            builder.RegisterInstance(appSetting.Object).As<IAppSetting>();
            var container = builder.Build();

            this.scopeProvider = new SimpleLifetimeScopeProvider(container);
            var resolver = new AutofacDependencyResolver(container, scopeProvider);
            DependencyResolver.SetResolver(resolver);

            var param = new UpdateStatusParam { AffId = 1271808, Status = "approved" };
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.ExecuteAsync(It.IsAny<UpdateStatusCommand>(), It.IsAny<string>()));
            var affiliateService = new Mock<IAffiliateService>();
            affiliateService.Setup(aff => aff.GetAffiliateBasicInfo(It.IsAny<int>(), null)).Returns(new AffiliateBasicInfo { AffId = 1271808, AffType = 2, PreferredLanguage = "vi-VN" });
            var thirdPartyLicenseeService = new Mock<IThirdPartyLicenseeService>();
            thirdPartyLicenseeService.Setup(comm => comm.SendAffiliateInfoAsync(It.IsAny<AffiliateBasicInfo>())).Throws(new System.Exception());

            var service = CreateCustomerLeftPanelService(null, affiliateService.Object, repository.Object, thirdPartyLicenseeService.Object);

            // Action
            var result = await service.UpdateStatusAsync(param, new AffInformationEmail());

            // Assert
            repository.Verify(d => d.ExecuteAsync(It.Is<UpdateStatusCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdateStatus_WhenCallWithDisapprovedEmail_ReturnError()
        {
            // Arrange
            var param = new UpdateStatusParam { AffId = 1271808, Status = "disapproved" };
            var repository = new Mock<IDynamicRepository>();
            repository.Setup(comm => comm.ExecuteAsync(It.IsAny<UpdateStatusCommand>(), It.IsAny<string>())).Callback<INonQueryCommand, string>((c, _) => (c as UpdateStatusCommand).ErrCode = -999);

            var service = CreateCustomerLeftPanelService(customerLeftPanelRepository: repository.Object);

            // Action
            var result = await service.UpdateStatusAsync(param, new AffInformationEmail());

            // Assert
            repository.Verify(d => d.ExecuteAsync(It.Is<UpdateStatusCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
            Assert.False(result.IsSuccessful);
        }

        private static CustomerLeftPanelService CreateCustomerLeftPanelService(
            IEmailService emailService = null,
            IAffiliateService affiliateService = null,
            IDynamicRepository customerLeftPanelRepository = null,
            IThirdPartyLicenseeService thirdPartyLicenseeService = null)
        {
            var fakeEmailService = emailService ?? Mock.Of<IEmailService>();
            var fakeAffiliateService = affiliateService ?? Mock.Of<IAffiliateService>();
            var fakeCustomerLeftPanelRepository = customerLeftPanelRepository ?? Mock.Of<IDynamicRepository>();
            var fakeThirdPartyLicenseeService = thirdPartyLicenseeService ?? Mock.Of<IThirdPartyLicenseeService>();

            return new CustomerLeftPanelService(fakeEmailService, fakeAffiliateService, fakeCustomerLeftPanelRepository, fakeThirdPartyLicenseeService);
        }
    }
}
