using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Controllers.UserPanel;
using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;
using Fanex.Affiliate.User.Core.UnitTests.TestHelper;
using Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview;
using Moq;
using Newtonsoft.Json;
using System.Web.Mvc;
using Xunit;

namespace Fanex.Affiliate.User.Core.UnitTests.Controllers.UserPanel
{
    public class AccountOverViewControllerTest
    {
        [Fact]
        public void Index_WhenCall_ReturnCorrectView()
        {
            // Arrange
            var expectResult = new AccountOverviewViewModel { IsMaxLevel = false, LastLoginInfo = new LastLoginInfo() };
            var repository = new Mock<IAccountOverviewService>();
            repository.Setup(r => r.GetLastLoginInfo(It.IsAny<int>())).Returns(expectResult.LastLoginInfo);
            var controller = new AccountOverviewController(MockingHelper.GetSessionService(), Mock.Of<ISystemService>(), repository.Object);

            // Action
            var viewResult = controller.Index() as ViewResult;

            // Assert
            Assert.Equal("~/Views/UserPanel/AccountOverView/Index.cshtml", viewResult.ViewName);
            Assert.Equal(JsonConvert.SerializeObject(expectResult), JsonConvert.SerializeObject(viewResult.Model));
        }
    }
}