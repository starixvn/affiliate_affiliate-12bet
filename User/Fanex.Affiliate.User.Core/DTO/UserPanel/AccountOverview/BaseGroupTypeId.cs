using Fanex.Affiliate.User.Core.Constants;

namespace Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview
{
    public class BaseGroupTypeId
    {
        public int GroupTypeId { get; set; }

        public bool IsHybridAff => GroupTypeId == GroupType.HybridTypeId;
        public bool IsCPAAff => GroupTypeId == GroupType.CpaTypeId;
        public bool IsRevenueShareAff => GroupTypeId == GroupType.RevenueShareTypeId;
    }
}
