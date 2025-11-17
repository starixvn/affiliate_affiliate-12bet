namespace Fanex.Affiliate.User.Core.BusinessService
{
    using CoreService;
    using Criterias;
    using Data.Repository;
    using DTO.UserPanel;
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using System.Collections.Generic;
    using Utilities;

    public class AccountOverviewService : BaseDynamicService, IAccountOverviewService
    {
        public AccountOverviewService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        { }

        public LastLoginInfo GetLastLoginInfo(int affId)
        {
            return GetTData<LastLoginInfo>(new GetLastLoginInfoCriteria(affId));
        }

        public (string, IEnumerable<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param)
        {
            var criteria = param.MapTo<PlayerDetailParam, GetPlayerDetailListCriteria>();

            return FetchMultipleTDataWithPaging<string, PlayerDetail>(criteria, param);
        }

        public (string, IEnumerable<OverviewDetail>) GetUserOverviewDetailList(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetUserOverviewDetailListCriteria>();

            return FetchMultipleTData<string, OverviewDetail>(criteria);
        }

        public OverviewSummary GetUserOverviewSummary(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetUserOverviewSummaryCriteria>();

            return GetTData<OverviewSummary>(criteria);
        }

        public (string, IEnumerable<SubAffDetail>) GetSubAffDetails(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetSubAffDetailsCriteria>();

            return FetchMultipleTData<string, SubAffDetail>(criteria);
        }
    }
}
