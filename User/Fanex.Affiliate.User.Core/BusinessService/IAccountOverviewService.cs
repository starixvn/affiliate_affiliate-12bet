namespace Fanex.Affiliate.User.Core.BusinessService
{
    using DTO.UserPanel;
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using System.Collections.Generic;

    public interface IAccountOverviewService
    {
        OverviewSummary GetUserOverviewSummary(AccountOverviewParam param);

        (string, IEnumerable<OverviewDetail>) GetUserOverviewDetailList(AccountOverviewParam param);

        (string, IEnumerable<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param);

        (string, IEnumerable<SubAffDetail>) GetSubAffDetails(AccountOverviewParam param);

        LastLoginInfo GetLastLoginInfo(int affId);
    }
}
