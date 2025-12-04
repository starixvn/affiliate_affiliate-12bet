using Fanex.Affiliate.Admin.Core.Apis;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services
{
    public class LicenseeServiceTest
    {
        [Fact]
        public async Task CheckCustomerIsValid_WhenCall_ReturnTrue()
        {
            // Arrange
            var lisenseeApi = new Mock<ILicenseeApi>();
            lisenseeApi.Setup(l => l.GetCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(
                new MemberSiteCustomerInfo
                {
                    Status = 1,
                    ActStatus = 1,
                    AgentId = 1,
                    AllAgentId = "123",
                    CurrencyId = 123,
                    CustId = 1,
                    IsTest = true,
                    SiteId = 1,
                    UserLang = "en",
                    UserLevel = 1,
                    UserName = "Test"
                }));

            var service = CreateLicenseeService(lisenseeApi.Object);

            // Action
            var result = await service.CheckCustomerIsValidAsync("abc", 123);

            // Assert
            Assert.True(result.IsSuccessful);
        }

        [Fact]
        public void CheckCustomerIsValid_WhenCallWithNull_ReturnError()
        {
            // Arrange
            var service = CreateLicenseeService();

            // Action
            var result = service.CheckCustomerIsValid(null);

            // Assert
            Assert.False(result.IsSuccessful);
            Assert.Equal("The payment account you entered does not exist. Please check again.", result.Message);
        }

        [Theory]
        [InlineData(2, "The payment account you entered is Suspended. Please check again.")]
        [InlineData(3, "The payment account you entered is Closed. Please check again.")]
        [InlineData(4, "The payment account you entered is Locked. Please check again.")]
        [InlineData(123, "Have err when call API")]
        public void CheckCustomerIsValid_WhenCall_ReturnError(int status, string message)
        {
            // Arrange
            var service = CreateLicenseeService();

            // Action
            var result = service.CheckCustomerIsValid(new MemberSiteCustomerInfo { Status = status });

            // Assert
            Assert.False(result.IsSuccessful);
            Assert.Equal(message, result.Message);
        }

        [Fact]
        public void CheckCustomerIsValid_WhenCallWithStatusNull_ReturnError()
        {
            // Arrange
            var service = CreateLicenseeService();

            // Action
            var result = service.CheckCustomerIsValid(new MemberSiteCustomerInfo { Status = null });

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public void GetMemberSiteCustomerInfoAsync_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var lisenseeApi = new Mock<ILicenseeApi>();
            lisenseeApi.Setup(l => l.GetCustomerInfoAsync(It.IsAny<string>(), It.IsAny<int>())).Returns(Task.FromResult(new MemberSiteCustomerInfo()));
            var service = CreateLicenseeService();

            // Action
            var result = service.GetMemberSiteCustomerInfoAsync(string.Empty, 123);

            // Assert
            Assert.NotNull(result);
        }

        [Theory]
        [InlineData(0, true)]
        [InlineData(500, false)]
        public async Task UnlockUserAsync_WhenCall_ReturnCorrectResult(int expectedCode, bool isSuccess)
        {
            // Arrange
            var lisenseeApi = new Mock<ILicenseeApi>();
            lisenseeApi.Setup(l => l.UnlockUserAsync(It.IsAny<int[]>())).Returns(Task.FromResult(new ApiResultInfo { IsSuccess = isSuccess }));

            var service = CreateLicenseeService(lisenseeApi.Object);

            // Action
            var result = await service.UnlockUserAsync(123);

            // Assert
            Assert.Equal(expectedCode, result.Code);
        }

        [Fact]
        public async Task UpdatePaymentRequestAsync_WhenCallWithMountZero_ReturnError()
        {
            // Arrange
            var service = CreateLicenseeService();

            // Action
            var result = await service.UpdatePaymentRequestAsync(new PaymentRequestInfo());

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdatePaymentRequestAsync_WhenCall_UpdateFailed()
        {
            // Arrange
            var param = new PaymentRequestInfo { Amount = 100m };
            var lisenseeApi = new Mock<ILicenseeApi>();
            lisenseeApi.Setup(l => l.UpdatePaymentRequestAsync(param)).Returns(Task.FromResult(-10m));

            var service = CreateLicenseeService(lisenseeApi.Object);

            // Action
            var result = await service.UpdatePaymentRequestAsync(param);

            // Assert
            Assert.False(result.IsSuccessful);
        }

        [Fact]
        public async Task UpdatePaymentRequestAsync_WhenCall_UpdateSuccessfully()
        {
            // Arrange
            var param = new PaymentRequestInfo { Amount = 100m };
            var lisenseeApi = new Mock<ILicenseeApi>();
            lisenseeApi.Setup(l => l.UpdatePaymentRequestAsync(param)).Returns(Task.FromResult(100m));

            var service = CreateLicenseeService(lisenseeApi.Object);

            // Action
            var result = await service.UpdatePaymentRequestAsync(param);

            // Assert
            Assert.True(result.IsSuccessful);
        }

        private static LicenseeService CreateLicenseeService(ILicenseeApi licenseeApi = null)
        {
            var fakeLicenseeApi = licenseeApi ?? Mock.Of<ILicenseeApi>();

            return new LicenseeService(fakeLicenseeApi);
        }
    }
}
