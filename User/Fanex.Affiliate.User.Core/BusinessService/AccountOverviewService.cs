namespace Fanex.Affiliate.User.Core.BusinessService
{
    using CoreService;
    using Criterias;
    using Data.Repository;
    using DTO.UserPanel;
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using System;
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

        public IEnumerable<PlayerDetail> GetPlayerDetailList(PlayerDetailParam param)
        {
            var criteria = param.MapTo<PlayerDetailParam, GetPlayerDetailListCriteria>();
            criteria.MonthDate = param.FromDate;

            return FetchTDataWithPaging<PlayerDetail>(criteria, param);
        }

        public IEnumerable<OverviewDetail> GetUserOverviewDetailList(AccountOverviewParam param)
        {
            return FetchTData<OverviewDetail>(new GetUserOverviewDetailListCriteria(param.AffId, param.FromDate));
        }

        public OverviewSummary GetUserOverviewSummary(AccountOverviewParam param)
        {
            var overviewInfo = GetTData<OverviewSummary>(param.MapTo<AccountOverviewParam, GetUserOverviewSummaryCriteria>());

            return overviewInfo;
        }

        public IEnumerable<SubAffDetail> GetSubAffDetails(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetSubAffDetailsCriteria>();
            criteria.MonthDate = param.FromDate;

            return FetchTData<SubAffDetail>(criteria);
        }
    }
}
