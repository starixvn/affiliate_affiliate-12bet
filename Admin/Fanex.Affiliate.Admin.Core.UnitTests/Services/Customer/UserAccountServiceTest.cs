using Fanex.Affiliate.Admin.Core.Commands.UserPanel.UserAccount;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Criterias.UserPanel.UserAccount;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.DTO.Customer;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Affiliate.Admin.Core.Services;
using Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee;
using Fanex.Affiliate.Admin.Core.Services.UserPanel;
using Fanex.Data.Repository;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services.Customer
{
    public class UserAccountServiceTest
    {
        //[Fact]
        //public void GetUserAccountInfo_WhenCall_ReturnCorrectData()
        //{
        //    // Arrange
        //    var repository = new Mock<IDynamicRepository>();
        //    repository.Setup(comm => comm.Get<UserAccount>(It.IsAny<UserAccountCriteria>(), It.IsAny<string>())).Returns(new UserAccount());
        //    var service = CreateUserAccountService(repository.Object);

        //    // Action
        //    var result = service.GetUserAccountInfo(1271808);

        //    // Assert
        //    repository.Verify(d => d.Get<UserAccount>(It.Is<UserAccountCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
        //    Assert.NotNull(result);
        //}

        //[Fact]
        //public async Task UpdateUserAccount_WhenCallWithValid_ExcuteSuccessfully()
        //{
        //    // Arrange
        //    var param = GetUserAccountParam();
        //    var repository = new Mock<IDynamicRepository>();
        //    repository.Setup(comm => comm.Execute(It.IsAny<UpdateUserAccountCommand>(), It.IsAny<string>()));
        //    repository.Setup(comm => comm.Get<UserAccount>(It.IsAny<UserAccountCriteria>(), It.IsAny<string>())).Returns(new UserAccount());
        //    var service = CreateUserAccountService(repository.Object);

        //    // Action
        //    var result = await service.UpdateUserAccountAsync(param);

        //    // Assert
        //    Assert.True(result.IsSuccessful);
        //}

        //[Fact]
        //public async Task UpdateUserAccount_WhenCallWithValidPlayerAccount_ExcuteSuccessfully()
        //{
        //    // Arrange
        //    var repository = new Mock<IDynamicRepository>();
        //    repository.Setup(r => r.Get<UserAccount>(It.IsAny<UserAccountCriteria>(), It.IsAny<string>())).Returns(new UserAccount { PlayerUsername = "Abc" });
        //    var licenseeService = new Mock<ILicenseeService>();
        //    licenseeService.Setup(s => s.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>()))
        //        .Returns(new ResultInfo { Code = 0 });
        //    licenseeService.Setup(s => s.GetMemberSiteCustomerInfo(It.IsAny<string>(), It.IsAny<int>()))
        //        .ReturnsAsync(new MemberSiteCustomerInfo());
        //    repository.Setup(comm => comm.Execute(It.IsAny<UpdateUserAccountCommand>(), It.IsAny<string>()));
        //    var service = CreateUserAccountService(repository.Object, licenseeService.Object);

        //    // Action
        //    var result = await service.UpdateUserAccountAsync(new UserAccountParam { PreferredPayment = "Player", PlayerUsername = "123", NoSiteDesc = "abc" });

        //    // Assert
        //    Assert.True(result.IsSuccessful);
        //}

        //[Fact]
        //public async Task UpdateUserAccount_WhenCallWithInvalidPlayerAccount_ReturnError()
        //{
        //    // Arrange
        //    var appSetting = new Mock<IAppSetting>();
        //    appSetting.Setup(ap => ap.SiteFriendlyName).Returns("12BET");
        //    var repository = new Mock<IDynamicRepository>();
        //    repository.Setup(r => r.Get<UserAccount>(It.IsAny<UserAccountCriteria>(), It.IsAny<string>())).Returns(new UserAccount { PlayerUsername = "Abc" });
        //    var licenseeService = new Mock<ILicenseeService>();
        //    licenseeService.Setup(s => s.CheckCustomerIsValid(It.IsAny<MemberSiteCustomerInfo>())).Returns(new ResultInfo { Code = 100 });

        //    var service = CreateUserAccountService(repository.Object, licenseeService.Object, appSetting.Object);

        //    // Action
        //    var result = await service.UpdateUserAccountAsync(new UserAccountParam { PreferredPayment = "Player", PlayerUsername = "123", NoSiteDesc = "abc" });

        //    // Assert
        //    repository.Verify(d => d.Execute(It.Is<UpdateUserAccountCommand>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()), Times.Never);
        //    Assert.False(result.IsSuccessful);
        //    Assert.Equal(100, result.Code);
        //}

        //[Fact]
        //public async Task UpdateUserAccount_WhenCallWithInvalidNoSiteDesc_ReturnError()
        //{
        //    // Arrange
        //    var service = CreateUserAccountService();

        //    // Action
        //    var result = await service.UpdateUserAccountAsync(new UserAccountParam());

        //    // Assert
        //    Assert.False(result.IsSuccessful);
        //    Assert.Equal("Please describe how you would like to promote  if you don't have the URL is required", result.Message);
        //}

        //[Fact]
        //public async Task UpdateUserAccount_WhenCallWithInvalidSiteUrl_ReturnError()
        //{
        //    // Arrange
        //    var service = CreateUserAccountService();

        //    // Action
        //    var result = await service.UpdateUserAccountAsync(new UserAccountParam { HasWebSite = true });

        //    // Assert
        //    Assert.False(result.IsSuccessful);
        //    Assert.Equal("Website URL is required", result.Message);
        //}

        //[Fact]
        //public async Task UpdateUserAccount_WhenCallWithInvalidPaymentMethod_ReturnError()
        //{
        //    // Arrange
        //    var service = CreateUserAccountService();

        //    // Action
        //    var result = await service.UpdateUserAccountAsync(new UserAccountParam { PreferredPayment = "Wire", NoSiteDesc = "abc" });

        //    // Assert
        //    Assert.False(result.IsSuccessful);
        //    Assert.Equal("Update is failed!", result.Message);
        //}


        //[Fact]
        //public void GetPaymentMethod_WhenCall_ReturnCorrectData()
        //{
        //    // Arrange
        //    var repository = new Mock<IDynamicRepository>();
        //    repository.Setup(t => t.Fetch<PaymentMethodInfo>(It.IsAny<PaymentMethodCriteria>(), It.IsAny<string>())).Returns(new List<PaymentMethodInfo> { new PaymentMethodInfo { PaymentId = "123", PaymentName = "abc" } }).Callback<ICriteria, string>((p, _) => (p as PaymentMethodCriteria).MinAmount = 100m);
        //    var service = CreateUserAccountService(repository: repository.Object);

        //    // Action
        //    var (paymentMethods, minAmount) = service.GetPaymentMethod();

        //    // Assert
        //    repository.Verify(d => d.Fetch<PaymentMethodInfo>(It.Is<PaymentMethodCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && c.IsValid()), It.IsAny<string>()));
        //    Assert.Single(paymentMethods);
        //    Assert.Equal(100m, minAmount);
        //}

        //private static UserAccountService CreateUserAccountService(
        //    IDynamicRepository repository = null,
        //    ILicenseeService licenseeService = null,
        //    IAppSetting appSeting = null,
        //    IThirdPartyLicenseeService thirdPartyLicenseeService = null)
        //{
        //    var fakerepository = repository ?? Mock.Of<IDynamicRepository>();
        //    var fakeLicenseeService = licenseeService ?? Mock.Of<ILicenseeService>();
        //    var fakeAppSetting = appSeting ?? Mock.Of<IAppSetting>();
        //    var fakeIThirdPartyLicenseeService = thirdPartyLicenseeService ?? Mock.Of<IThirdPartyLicenseeService>();

        //    return new UserAccountService(fakerepository, fakeLicenseeService, fakeAppSetting, fakeIThirdPartyLicenseeService);
        //}

        //private static UserAccountParam GetUserAccountParam()
        //{
        //    return new UserAccountParam
        //    {
        //        AffId = 1271808,
        //        FirstName = "Hinh",
        //        LastName = "Lê Văn",
        //        Gender = false,
        //        Email = "abc@gmail.com",
        //        Phone = "01234567899",
        //        ContactApps = "[{'Name':'MSN / YM / QQ','Value':'@123 Lê Văn','Order':0}]",
        //        Address = "Test",
        //        City = "test",
        //        State = "700000",
        //        Postcode = "700000",
        //        Country = "Viet Nam",
        //        MoreSiteUrls = "www.sportsbookie.com",
        //        SiteUrl = "https://aff-12b.nexdev.net/UserAsian/UserPanel/Main/#MyAccount",
        //        PreferredPayment = "Wire",
        //        PlayerUsername = "bettingexp",
        //        NoSiteDesc = "test",
        //        NetellerAccountId = "1",
        //        MoneybookersEmail = "abc@gmail.com",
        //        BankName = "Test",
        //        BankAddress = "test",
        //        BankCode = "test",
        //        BankAccountName = "test",
        //        BankAccountNumber = "test",
        //        MailOption = false,
        //        ContactAppList = new List<ContactApp> { new ContactApp { Name = "MSN/YM/QQ", Value = "@123 Lê Văn", Order = 0 } }
        //    };
        //}
    }
}
