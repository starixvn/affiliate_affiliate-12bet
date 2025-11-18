namespace Fanex.Affiliate.User.Core.BusinessService
{
    using CoreService;
    using Criterias;
    using Data.Repository;
    using DTO.UserPanel.AccountOverview;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;
    using MetalModels.UserPanel;
    using System.Collections.Generic;
    using System.Linq;
    using Utilities;

    public class AccountOverviewService : BaseDynamicService, IAccountOverviewService
    {
        public AccountOverviewService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        { }

        public LastLoginInfo GetLastLoginInfo(int affId)
        {
            return GetTData<LastLoginInfo>(new GetLastLoginInfoCriteria(affId));
        }

        public (int, IEnumerable<PlayerDetail>) GetPlayerDetailList(PlayerDetailParam param)
        {
            var criteria = param.MapTo<PlayerDetailParam, GetPlayerDetailListCriteria>();

            return FetchMultipleTDataWithPaging<int, PlayerDetail>(criteria, param);
        }

        public (int, IEnumerable<OverviewDetail>) GetUserOverviewDetailList(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetUserOverviewDetailListCriteria>();

            return FetchMultipleTData<int, OverviewDetail>(criteria);
        }

        public (int, OverviewSummary) GetUserOverviewSummary(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetUserOverviewSummaryCriteria>();

            var dataItems = DynamicRepository.FetchMultiple<int, OverviewSummary>(criteria);

            return (dataItems.Item1.FirstOrDefault(), dataItems.Item2.FirstOrDefault());
        }

        public (int, IEnumerable<SubAffDetail>) GetSubAffDetails(AccountOverviewParam param)
        {
            var criteria = param.MapTo<AccountOverviewParam, GetSubAffDetailsCriteria>();

            return FetchMultipleTData<int, SubAffDetail>(criteria);
        }
    }
}
