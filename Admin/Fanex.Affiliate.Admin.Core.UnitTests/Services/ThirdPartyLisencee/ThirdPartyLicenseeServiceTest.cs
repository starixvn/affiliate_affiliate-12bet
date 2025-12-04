using Fanex.Affiliate.Admin.Core.Apis;
using Fanex.Affiliate.Admin.Core.Commands.Apis;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Fanex.Affiliate.Admin.Core.UnitTests.TestHelper;
using NSubstitute;
using System.Threading.Tasks;
using Xunit;
using System.Collections;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services.ThirdPartyLisencee
{
    public class ThirdPartyLicenseeServiceTest
    {
        private readonly IApiAffService _jobTrackerService;
        private readonly ILicenseeApi _licenseeApi;
        private readonly IAppSetting _appSetting;

        public ThirdPartyLicenseeServiceTest()
        {
            _jobTrackerService = Substitute.For<IApiAffService>();
            _licenseeApi = Substitute.For<ILicenseeApi>();
            _appSetting = Substitute.For<IAppSetting>();
        }

        [Fact]
        public async Task SendAffiliateInfoAsync_WhenCallWithInvalidPlayerCustId_ShouldNotCallInsertDataTracker()
        {
            //Arrange
            MockingHelper.SetUpHttpContextSession();
            MockingHelper.SetUpLogEngineEnviroment();

            _jobTrackerService.InsertDataTracker(Arg.Any<InsertJobTrackerCommand>()).Returns((123, ResultInfo.Success));
            _licenseeApi.InsertAffInfosAsync(Arg.Compat.Any<IEnumerable<ApiAffInfo>>()).Returns(Task.FromResult(new ApiResultInfo()));

            //Action
            var service = CreateThirdPartyLicenseeService();
            await service.SendAffiliateInfoAsync(new AffiliateBasicInfo());

            //Assert
            _jobTrackerService.DidNotReceive().InsertDataTracker(Arg.Compat.Any<InsertJobTrackerCommand>());
        }

        [Fact]
        public async Task SendAffiliateInfoAsync_WhenCallWithThrowException_ShouldCallUpdateDataTracker()
        {
            //Arrange
            MockingHelper.SetUpHttpContextSession();
            MockingHelper.SetUpLogEngineEnviroment();

            _jobTrackerService.InsertDataTracker(Arg.Any<InsertJobTrackerCommand>()).Returns((123, ResultInfo.Success));
            _licenseeApi.InsertAffInfosAsync(Arg.Compat.Any<IEnumerable<ApiAffInfo>>()).Returns(Task.FromResult(new ApiResultInfo()));

            //Action
            var service = CreateThirdPartyLicenseeService();
            await service.SendAffiliateInfoAsync(new AffiliateBasicInfo { PlayerCustId = 123, AffCode = "123456" });

            //Assert
            _jobTrackerService.Received().UpdateDataTracker(Arg.Compat.Any<UpdateJobTrackerCommand>());
        }

        [Fact]
        public async Task SendAffiliateInfoAsync_WhenCallWithInsertDataTrackerFailed_ShouldNotCallUpdateDataTracker()
        {
            //Arrange
            _jobTrackerService.InsertDataTracker(Arg.Any<InsertJobTrackerCommand>()).Returns((123, ResultInfo.GenerateErr("Error")));

            //Action
            var service = CreateThirdPartyLicenseeService();
            await service.SendAffiliateInfoAsync(new AffiliateBasicInfo { PlayerCustId = 123, AffCode = "123456" });

            //Assert
            _jobTrackerService.DidNotReceive().UpdateDataTracker(Arg.Compat.Any<UpdateJobTrackerCommand>());
        }

        [Fact]
        public async Task SendAffiliateInfoAsync_WhenCallWithSuccessful_ShouldCallUpdateDataTracker()
        {
            //Arrange
            MockingHelper.SetUpHttpContextSession();
            MockingHelper.SetUpLogEngineEnviroment();

            _jobTrackerService.InsertDataTracker(Arg.Any<InsertJobTrackerCommand>()).Returns((123, ResultInfo.Success));
            _licenseeApi.InsertAffInfosAsync(Arg.Compat.Any<IEnumerable<ApiAffInfo>>()).Returns(Task.FromResult(new ApiResultInfo { IsSuccess = true }));

            //Action
            var service = CreateThirdPartyLicenseeService();
            await service.SendAffiliateInfoAsync(new AffiliateBasicInfo { PlayerCustId = 123, AffCode = "123456" });

            //Assert
            _jobTrackerService.Received().UpdateDataTracker(Arg.Compat.Any<UpdateJobTrackerCommand>());
        }

        private ThirdPartyLicenseeService CreateThirdPartyLicenseeService()
            => new ThirdPartyLicenseeService(_jobTrackerService, _licenseeApi, _appSetting);
    }
}
