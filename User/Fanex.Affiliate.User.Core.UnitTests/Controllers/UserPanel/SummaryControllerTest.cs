using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Controllers.UserPanel;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO.UserPanel;
using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel;
using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.UnitTests.TestHelper;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview;
using Moq;
using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.User.Core.UnitTests.Controllers.UserPanel
{

    public class SummaryControllerTest
    {
        private readonly DateTime monthDate = DateTimeHelper.CreateDateTime(2019, 12, 20);

        [Fact]
        public void Index_WhenCall_ReturnCorrectPartialView()
        {
            // Arrange
            var controller = CreateController();

            // Action
            var partialViewResult = controller.Index() as PartialViewResult;

            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Summary/Index.cshtml", partialViewResult.ViewName);
        }

        [Fact]
        public void Dashboard_WhenCall_ReturnCorrectPartialView()
        {
            // Arrange
            var expectedResult = new OverviewSummary { ActivePlayers = 123 };
            var accountOverviewService = new Mock<IAccountOverviewService>();
            accountOverviewService.Setup(a => a.GetUserOverviewSummary(It.IsAny<AccountOverviewParam>())).Returns((0, expectedResult));
            var controller = CreateController(accountOverviewService: accountOverviewService.Object);

            // Action
            var partialViewResult = controller.Dashboard(new AccountOverviewParam()) as PartialViewResult;
            var result = partialViewResult.Model as DashboardViewModel;
            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Summary/Dashboard.cshtml", partialViewResult.ViewName);
            Assert.Equal(expectedResult, result.OverviewSummary);
        }

        [Fact]
        public void Overview_WhenCall_ReturnCorrectPartialView()
        {
            // Arrange
            var accountOverviewService = new Mock<IAccountOverviewService>();
            accountOverviewService.Setup(a => a.GetUserOverviewDetailList(It.IsAny<AccountOverviewParam>())).Returns((0, new List<OverviewDetail>()));
            var controller = CreateController(accountOverviewService: accountOverviewService.Object);

            // Action
            var partialViewResult = controller.Overview(new AccountOverviewParam()) as PartialViewResult;
            var result = partialViewResult.Model as IEnumerable<OverviewDetail>;
            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Summary/Overview.cshtml", partialViewResult.ViewName);
            Assert.Single(result);
        }

        [Fact]
        public void PlayersDetails_WhenCall_ReturnCorrectPartialView()
        {
            // Arrange
            var param = new PlayerDetailParam { FromDate = monthDate, IsSortAsc = true };
            PlayerDetailParam passedParam = null;
            var accountOverviewService = new Mock<IAccountOverviewService>();
            accountOverviewService.Setup(a => a.GetPlayerDetailList(param)).Returns((0, new List<PlayerDetail> { new PlayerDetail() })).Callback<PlayerDetailParam>(p => passedParam = p);
            var controller = CreateController(accountOverviewService: accountOverviewService.Object);

            // Action
            var partialViewResult = controller.PlayersDetails(param) as PartialViewResult;
            var result = partialViewResult.Model as PlayerDetailViewModel;

            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Summary/PlayersDetails.cshtml", partialViewResult.ViewName);
            Assert.Equal(param.FromDate, passedParam.FromDate);
            Assert.Single(result.PlayerDetailList);
        }

        [Fact]
        public void PlayersDetailsContent_WhenCall_ReturnCorrectPartialView()
        {
            // Arrange
            var param = new PlayerDetailParam { ToDate = monthDate };
            PlayerDetailParam passedParam = null;
            var accountOverviewService = new Mock<IAccountOverviewService>();
            accountOverviewService.Setup(a => a.GetPlayerDetailList(param)).Returns((0, new List<PlayerDetail> { new PlayerDetail() })).Callback<PlayerDetailParam>(p => passedParam = p);
            var controller = CreateController(accountOverviewService: accountOverviewService.Object);

            // Action
            var partialViewResult = controller.PlayersDetailsContent(param) as PartialViewResult;
            var result = partialViewResult.Model as PlayerDetailViewModel;

            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Summary/PlayersDetailsContent.cshtml", partialViewResult.ViewName);
            Assert.Equal(param.ToDate, passedParam.ToDate);
            Assert.Single(result.PlayerDetailList);
        }

        [Fact]
        public void SubAffDetails_WhenCall_ReturnCorrectPartialView()
        {
            // Arrange
            var accountOverviewService = new Mock<IAccountOverviewService>();
            accountOverviewService.Setup(a => a.GetSubAffDetails(It.IsAny<AccountOverviewParam>())).Returns((0, new List<SubAffDetail> { new SubAffDetail() }));
            var controller = CreateController(accountOverviewService: accountOverviewService.Object);

            // Action
            var partialViewResult = controller.SubAffDetails(new AccountOverviewParam { FromDate = DateTimeHelper.CreateDateTime(2020, 12, 01) }) as PartialViewResult;
            var result = partialViewResult.Model as List<SubAffDetail>;
            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Summary/SubAffDetails.cshtml", partialViewResult.ViewName);
            Assert.NotEmpty(result);
        }

        private static SummaryController CreateController(
            ISessionService sessionService = null,
            ISystemService languageService = null,
            IAccountOverviewService accountOverviewService = null)
        {
            sessionService = sessionService ?? MockingHelper.GetSessionService();
            languageService = languageService ?? Mock.Of<ISystemService>();
            accountOverviewService = accountOverviewService ?? Mock.Of<IAccountOverviewService>();

            return new SummaryController(sessionService, languageService, accountOverviewService);
        }
    }
}
