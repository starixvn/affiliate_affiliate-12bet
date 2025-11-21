namespace Fanex.Affiliate.User.Core.BusinessService
{
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using System.Collections.Generic;

    public interface IAccountOverviewService
    {
        (int, OverviewSummary) GetUserOverviewSummary(AccountOverviewParam param);

        (int, IEnumerable<OverviewDetail>) GetUserOverviewDetailList(AccountOverviewParam param);

        (int, IEnumerable<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param);

        IEnumerable<SubAffDetail> GetSubAffDetails(AccountOverviewParam param);

        LastLoginInfo GetLastLoginInfo(int affId);
    }
}
