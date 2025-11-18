using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;

namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    public class DashboardViewModel : BaseGroupTypeId
    {
        public bool IsGetMonthly { get; set; }

        public bool IsCurrentMonth { get; set; }

        public OverviewSummary OverviewSummary { get; set; }
    }
}
