using Fanex.Affiliate.Admin.Core.Controllers.UserPanel;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.UserPanel;
using Fanex.Affiliate.Admin.Core.UnitTests.TestHelper;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Controllers.Customer
{
    public class PlayerDetailControllerTest
    {
        [Fact]
        public void GetPlayerDetailList_WhenCallWithValidParam_ExcuteWithCorrectData()
        {
            // Arrange
            var param = new PlayerDetailParam();
            PlayerDetailParam passedParam = null;
            var playerDetailService = new Mock<IPlayerDetailService>();
            playerDetailService.Setup(s => s.GetPlayerDetailList(param)).Returns((true, new EntityResult<PlayerDetail> { MainData = new List<PlayerDetail> { new PlayerDetail() }, TotalItem = 1 })).Callback<PlayerDetailParam>(p => passedParam = p);
            var controller = CreatePlayerDetailController(playerDetailService: playerDetailService.Object);

            // Action
            var result = controller.GetPlayerDetailList(param) as JsonNetResult;
            var data = result.Data as EntityResult<PlayerDetail>;

            // Assert
            Assert.Single(data.MainData);
            Assert.Equal(param, passedParam);
        }

        [Fact]
        public void GetPlayerDetailList_WhenCallWithInvalidParam_ReturnNull()
        {
            // Arrange
            var controller = CreatePlayerDetailController();
            controller.ModelState.AddModelError("Error01", string.Empty);

            // Action
            var result = controller.GetPlayerDetailList(new PlayerDetailParam()) as JsonNetResult;

            // Assert
            Assert.Null(result.Data);
        }

        private PlayerDetailController CreatePlayerDetailController(
            ISessionService sessionService = null,
            IPlayerDetailService playerDetailService = null
            )
        {
            var fakeSessionService = sessionService ?? MockingHelper.GetSessionService();
            var fakePlayerDetailService = playerDetailService ?? Mock.Of<IPlayerDetailService>();

            return new PlayerDetailController(fakeSessionService, fakePlayerDetailService);
        }
    }
}
