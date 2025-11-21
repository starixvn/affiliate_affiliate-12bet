using Fanex.Affiliate.Admin.Core.Criterias.UserPanel;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Affiliate.Admin.Core.Utilities;
using Fanex.Data.Repository;
using System.Collections.Generic;
using System.Linq;

namespace Fanex.Affiliate.Admin.Core.Services.UserPanel
{
    public class PlayerDetailService : BaseDynamicService, IPlayerDetailService
    {
        public PlayerDetailService(
            IDynamicRepository dynamicRepository) : base(dynamicRepository) { }

        public IEnumerable<Channel> GetChannels()
        {
            //var criteria = new GetChannelsCriteria();
            //return FetchTData<Channel>(criteria);

            return new List<Channel> { new Channel { ChannelCode = "test", ChannelName = "Test" } };
        }

        public (bool, EntityResult<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param)
        {
            var criteria = param.MapTo<PlayerDetailParam, PlayerDetailCriteria>();

            var dataItems = DynamicRepository.FetchMultiple<bool, PlayerDetail>(criteria);

            return (dataItems.Item1.FirstOrDefault(), new EntityResult<PlayerDetail>
            {
                MainData = dataItems.Item2,
                Total = new PlayerDetail { RegisteredDate = DateTimeHelper.Gmt8Now, FirstDepositDate = DateTimeHelper.Gmt8Now },
                TotalItem = criteria.TotalItem,
            });
        }
    }
}
