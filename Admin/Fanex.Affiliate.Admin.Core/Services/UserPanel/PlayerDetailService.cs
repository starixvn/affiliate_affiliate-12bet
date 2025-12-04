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

        public IEnumerable<Channel> GetChannels(int affId)
        {
            var criteria = new GetChannelsCriteria(affId);
            var channels = FetchTData<Channel>(criteria);

            return channels.Append(new Channel { ChannelCode = "Others", ChannelName = "Others" });
        }

        public (bool, EntityResult<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param)
        {
            var criteria = param.MapTo<PlayerDetailParam, PlayerDetailCriteria>();

            var dataItems = DynamicRepository.FetchMultiple<bool, PlayerDetail, PlayerDetail>(criteria);

            return (dataItems.Item1.FirstOrDefault(), new EntityResult<PlayerDetail>
            {
                MainData = dataItems.Item3,
                Total = dataItems.Item2.FirstOrDefault(),
                TotalItem = criteria.TotalItem,
            });
        }
    }
}
