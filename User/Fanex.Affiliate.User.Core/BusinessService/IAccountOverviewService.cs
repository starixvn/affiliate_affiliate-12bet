namespace Fanex.Affiliate.User.Core.BusinessService
{
    using DTO.UserPanel;
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using System;
    using System.Collections.Generic;

    public interface IAccountOverviewService
    {
        OverviewSummary GetUserOverviewSummary(AccountOverviewParam param);

        IEnumerable<OverviewDetail> GetUserOverviewDetailList(AccountOverviewParam param);

        IEnumerable<PlayerDetail> GetPlayerDetailList(PlayerDetailParam param);

        IEnumerable<SubAffDetail> GetSubAffDetails(AccountOverviewParam param);

        LastLoginInfo GetLastLoginInfo(int affId);
    }
}
