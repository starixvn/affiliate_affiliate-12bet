using Fanex.Affiliate.Admin.Core.Criterias.Report;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Report;
using Fanex.Affiliate.Admin.Core.MetaModels.Report;
using Fanex.Data.Repository;
using System;

namespace Fanex.Affiliate.Admin.Core.Services.Report
{
    public class AffiliateReportService : BaseDynamicService, IAffiliateReportService
    {
        private const int ValidDateArrange = 6;

        public AffiliateReportService(IDynamicRepository dynamicRepository) : base(dynamicRepository) { }

        public EntityResult<AffiliateReport> GetMainReportData(AffiliateReportParam param)
        {
            if (!IsValidParam(param))
            {
                return new EntityResult<AffiliateReport>();
            }

            var criteria = new AffiliateReportCriteria
            {
                GroupIds = param.GroupIds,
                PreferredLanguage = param.PreferredLanguage,
                PaymentCurrencies = param.PaymentCurrencyIds,
                IsExcludeNegvBBF = param.IsExcludeNegvBBF,
                IsExcludeNegvCurrentBBF = param.IsExcludeNegvCurrentBBF,
                IsGetMonthly = param.IsGetMonthly,
                Statuses = param.Statuses
            };
            AssignBaseAffiliateReportCriteria(criteria, param);

            return FetchEntityResultHasItemTotal<AffiliateReport>(criteria);
        }

        public EntityResult<AffiliateReport> GetDetailReportData(AffiliateReportParam param)
        {
            var criteria = new AffiliateReportDetailCriteria
            {
                EarningType = param.EarningBy,
                IsGetAll = param.IsGetAll,
            };
            AssignBaseAffiliateReportCriteria(criteria, param);

            return FetchEntityResultHasItemTotal<AffiliateReport>(criteria);
        }

        public DateTime GetReportCutOffDate()
        {
            return DynamicRepository.Get<DateTime>(new ReportCutOffDateCriteria());
        }

        private static bool IsValidParam(AffiliateReportParam param)
        {
            return !string.IsNullOrEmpty(param.ProductIds) && IsValidDateRange(param.FromDate, param.ToDate);
        }

        private static bool IsValidDateRange(DateTime from, DateTime to)
        {
            var maxMonth = from.AddMonths(ValidDateArrange);

            return DateTime.Compare(maxMonth, to) >= 0;
        }

        private static void AssignBaseAffiliateReportCriteria(BaseAffiliateReportCriteria criteria, AffiliateReportParam param)
        {
            criteria.Username = param.UserName;
            criteria.FromDate = param.FromDate;
            criteria.ToDate = param.ToDate;
            criteria.ProductIds = param.ProductIds;
            criteria.SortType = param.SortType;
            criteria.SortDirectionType = param.SortDirectionType;
            criteria.PageIndex = param.PageIndex;
            criteria.PageSize = param.PageSize;
            criteria.IsExportExcel = param.IsExportExcel;
            criteria.BaseCurrency = param.BaseCurrencyId;
            criteria.Currencies = param.CurrencyIds;
        }
    }
}