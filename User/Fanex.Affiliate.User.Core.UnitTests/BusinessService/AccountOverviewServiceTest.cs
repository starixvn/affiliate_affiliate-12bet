namespace Fanex.Affiliate.User.Core.UnitTests.BusinessService
{
    using Core.BusinessService;
    using Core.Utilities;
    using Criterias;
    using Data.Repository;
    using DTO.UserPanel;
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using Newtonsoft.Json;
    using NSubstitute;
    using System.Collections.Generic;
    using Xunit;

    public class AccountOverviewServiceTest
    {
        private readonly IDynamicRepository _repository = Substitute.For<IDynamicRepository>();

        [Fact]
        public void GetLastLoginInfo_WhenCalled_ReturnCorrectData()
        {
            // Arrange
            const int AffId = 1;
            var expected = new LastLoginInfo
            {
                AffCode = "123",
                LastLoginDate = DateTimeHelper.Gmt8Now,
                LastLoginIP = "127.0.0.1"
            };

            _repository.Get<LastLoginInfo>(Arg.Any<GetLastLoginInfoCriteria>()).Returns(expected);
            var service = CreateService(_repository);

            // Action
            var result = service.GetLastLoginInfo(AffId);

            // Assert
            Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(result));
        }

        [Fact]
        public void GetPlayerDetailList_WhenCalled_ReturnCorrectData()
        {
            // Arrange
            var param = new PlayerDetailParam { AffId = 1 };
            var expected = new List<PlayerDetail> { new PlayerDetail { Username = "test" } };

            _repository.Fetch<PlayerDetail>(Arg.Any<GetPlayerDetailListCriteria>()).Returns(expected);
            var service = CreateService(_repository);

            // Action
            var result = service.GetPlayerDetailList(param);

            // Assert
            Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(result));
        }

        [Theory]
        [InlineData(10)]
        [InlineData(20)]
        public void GetPlayerDetailList_WhenCalled_ReturnCorrectNRows(int nRows)
        {
            // Arrange
            var param = new PlayerDetailParam { AffId = 1 };
            var expected = new List<PlayerDetail> { new PlayerDetail { Username = "test" } };

            _repository.Fetch<PlayerDetail>(Arg.Any<GetPlayerDetailListCriteria>())
                .Returns(expected)
                .AndDoes(c =>
                {
                    var criteria = c.Arg<GetPlayerDetailListCriteria>();
                    criteria.NRows = nRows;
                });

            var service = CreateService(_repository);

            // Action
            var result = service.GetPlayerDetailList(param);

            // Assert
            Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(result));
            Assert.Equal(nRows, param.NRows);
        }

        [Fact]
        public void GetUserOverviewDetailList_WhenCalled_ReturnCorrectData()
        {
            // Arrange
            var expected = new List<OverviewDetail> { new OverviewDetail { ActiveMembers = 1 } };

            _repository.Fetch<OverviewDetail>(Arg.Any<GetUserOverviewDetailListCriteria>()).Returns(expected);
            var service = CreateService(_repository);

            // Action
            var result = service.GetUserOverviewDetailList(new AccountOverviewParam());

            // Assert
            Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(result));
        }

        [Fact]
        public void GetUserOverviewSummary_WhenCalled_ReturnCorrectData()
        {
            // Arrange
            var expected = new OverviewSummary { ActivePlayers = 1 };

            _repository.Get<OverviewSummary>(Arg.Any<GetUserOverviewSummaryCriteria>()).Returns(expected);
            var service = CreateService(_repository);

            // Action
            var result = service.GetUserOverviewSummary(new AccountOverviewParam());

            // Assert
            Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(result));
        }

        [Fact]
        public void GetSubAffDetails_WhenCalled_ReturnCorrectData()
        {
            // Arrange
            const int AffId = 1;
            var expected = new List<SubAffDetail> { new SubAffDetail { AffId = AffId } };
            var param = new AccountOverviewParam { AffId = AffId };

            _repository.Fetch<SubAffDetail>(Arg.Any<GetSubAffDetailsCriteria>()).Returns(expected);
            var service = CreateService(_repository);

            // Action
            var result = service.GetSubAffDetails(param);

            // Assert
            Assert.Equal(JsonConvert.SerializeObject(expected), JsonConvert.SerializeObject(result));
        }

        private static AccountOverviewService CreateService(IDynamicRepository repository = null)
        {
            return new AccountOverviewService(repository ?? new DynamicRepository());
        }
    }
}
