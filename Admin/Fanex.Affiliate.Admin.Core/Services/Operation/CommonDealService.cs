namespace Fanex.Affiliate.Admin.Core.Services.Operation
{
    using System.Collections.Generic;
    using System.Linq;
    using DTO.Common;
    using Fanex.Affiliate.Admin.Core.Criterias.Operation;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Operation;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
    using Fanex.Data.Repository;

    public class CommonDealService: BaseDynamicService, ICommonDealService
    {
        public CommonDealService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public IEnumerable<DealType> GetDealTypes()
        {
            var data = FetchTData<DealType>("Aff_Admin_Deal_GroupType_Sel");
            return data.OrderBy(_ => _.GroupTypeName);
        }

        public IEnumerable<PaymentFrequency> GetPaymentFrequency()
        {
            const string spKey = "Aff_Admin_Deal_Schedule_Sel";

            return FetchTData<PaymentFrequency>(spKey);
        }

        public EntityResult<DealInfo> GetDeals(DealParam param)
        {
            var criteria = new DealCriteria
            {
                GroupId = param.GroupId,
                GroupName = param.GroupName,
                GroupTypeId = param.GroupTypeId,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize
            };

            return FetchEntityResult<DealInfo>(criteria);
        }

        public IEnumerable<DeductionItem> GetDeductionList()
        {
            const string spKey = "Aff_Admin_CommGroup_Deductions_Sel";

            return FetchTData<DeductionItem>(spKey);
        }

        public DealSettingDetail GetDealSettingDetail(int groupId)
        {
            var criteria = new DealDetailCriteria
            {
                GroupId = groupId
            };

            var (dealSettingInfoList, revenueTierSettingList, revenueDeductionSettingList, cpaTierSettingList, cpaGroupProductList)
                = DynamicRepository.FetchMultiple<DealSettingDetail, RevenueTierSetting, RevenueDeductionSetting, CpaTierSetting, CpaGroupProduct>(criteria);

            var dealSettingInfo = dealSettingInfoList.FirstOrDefault();
            if (dealSettingInfo == null)
            {
                return null;
            }

            dealSettingInfo.CPATierSetting = cpaTierSettingList;
            dealSettingInfo.ProductGroup = cpaGroupProductList;
            dealSettingInfo.RevenueTierSetting = revenueTierSettingList;

            if (dealSettingInfo.DealType != Constants.DealType.CPA && revenueDeductionSettingList != null)
            {
                dealSettingInfo.PlatformFeeSetting = revenueDeductionSettingList.Where(p =>
                    p.DeductionId == Constants.Deduction.PlatformFeeId);

                dealSettingInfo.DepositFeeSetting = revenueDeductionSettingList.FirstOrDefault(p =>
                    p.DeductionId == Constants.Deduction.DepositFeeId);

                dealSettingInfo.WithdrawalFeeSetting = revenueDeductionSettingList.FirstOrDefault(p =>
                    p.DeductionId == Constants.Deduction.WithdrawalFeeId);
            }

            return dealSettingInfo;
        }

        public IEnumerable<NormalDeal> GetNormalDealList(GetNormalDealParam param)
        {
            var criteria = new GetAssignDealCriteria
            {
                AffId = param.AffId
            };

            var normalDeals = FetchTData<NormalDeal>(criteria);
            param.GroupId = criteria.GroupId;

            return normalDeals;
        }

        public IEnumerable<NormalDeal> GetMarketingDealList(GetNormalDealParam param)
        {
            return GetNormalDealList(param).Where(c => c.GroupName.Contains("NoCommission-"));
        }

        public IEnumerable<TargetCountry> GetPlayerTargetCountry()
        {
            const string spKey = "Aff_Admin_Deal_PlayerTargetCountry_ListSel";

            return FetchTData<TargetCountry>(spKey);
        }
    }
}
