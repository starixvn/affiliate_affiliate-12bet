using System;

namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview
{
    public class AccountOverviewParam : BaseParam
    {
        public int AffId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsGetMonthly { get; set; }
    }
}
