namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.AccountOverview
{
    using Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview;

    public class AccountOverviewViewModel
    {
        public LastLoginInfo LastLoginInfo { get; set; }

        public bool IsMaxSubLevel { get; set; }
    }
}
