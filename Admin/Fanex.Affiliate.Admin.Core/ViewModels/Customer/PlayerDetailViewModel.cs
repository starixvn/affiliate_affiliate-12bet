using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;

namespace Fanex.Affiliate.Admin.Core.ViewModels.Customer
{
    public class PlayerDetailViewModel
    {
        public bool IsCPADealOnly { get; set; }

        public EntityResult<PlayerDetail> Data { get; set; }
    }
}
