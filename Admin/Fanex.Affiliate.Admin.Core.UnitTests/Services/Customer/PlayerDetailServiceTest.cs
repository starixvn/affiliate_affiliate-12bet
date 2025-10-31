using Fanex.Affiliate.Admin.Core.Criterias.UserPanel;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Affiliate.Admin.Core.Services.UserPanel;
using Fanex.Data.Repository;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Fanex.Affiliate.Admin.Core.UnitTests.Services.Customer
{
    public class PlayerDetailServiceTest
    {
        [Fact]
        public void GetPlayerDetailList_WhenCall_ReturnCorrectData()
        {
            // Arrange
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(r => r.Fetch<PlayerDetail>(It.IsAny<PlayerDetailCriteria>(), It.IsAny<string>())).Returns(new List<PlayerDetail>
            {
                new PlayerDetail
                {
                    RegisteredDate = new DateTime(2019, 11, 24),
                    FirstDepositDate = new DateTime(2019, 11, 24)
                }
            });

            // Action
            var service = new PlayerDetailService(dynamicRepository.Object);
            var result = service.GetPlayerDetailList(new PlayerDetailParam());
            var item = result.Item2.MainData.FirstOrDefault();

            // Assert
            dynamicRepository.Verify(d => d.Fetch<PlayerDetail>(It.Is<PlayerDetailCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && !c.IsValid()), It.IsAny<string>()));
            Assert.Single(result.Item2.MainData);
            Assert.Equal("11/24/2019 00:00:00", item.RegisteredDateText);
            Assert.Equal("11/24/2019 00:00:00", item.FirstDepositDateText);
        }

        [Fact]
        public void GetPlayerDetailList_WhenCall_ReturnCorrectDataHasNull()
        {
            // Arrange
            var dynamicRepository = new Mock<IDynamicRepository>();
            dynamicRepository.Setup(r => r.Fetch<PlayerDetail>(It.IsAny<PlayerDetailCriteria>(), It.IsAny<string>())).Returns(new List<PlayerDetail>
            {
                new PlayerDetail()
            });

            // Action
            var service = new PlayerDetailService(dynamicRepository.Object);
            var result = service.GetPlayerDetailList(new PlayerDetailParam());
            var item = result.Item2.MainData.FirstOrDefault();

            // Assert
            dynamicRepository.Verify(d => d.Fetch<PlayerDetail>(It.Is<PlayerDetailCriteria>(c => !string.IsNullOrEmpty(c.GetSettingKey()) && !c.IsValid()), It.IsAny<string>()));
            Assert.Single(result.Item2.MainData);
            Assert.Equal(string.Empty, item.RegisteredDateText);
            Assert.Equal(string.Empty, item.FirstDepositDateText);
        }
    }
}
