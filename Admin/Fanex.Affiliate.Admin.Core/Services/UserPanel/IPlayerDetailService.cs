using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using System.Collections.Generic;

namespace Fanex.Affiliate.Admin.Core.Services.UserPanel
{
    public interface IPlayerDetailService
    {
        (bool, EntityResult<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param);

        IEnumerable<Channel> GetChannels();
    }
}
