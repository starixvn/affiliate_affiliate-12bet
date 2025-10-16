namespace Fanex.Affiliate.Admin.Core.Services.Report
{
    using Fanex.Affiliate.Admin.Core.Criterias.Report;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Report;
    using Fanex.Affiliate.Admin.Core.Extensions;
    using Fanex.Affiliate.Admin.Core.MetaModels.Report;
    using Fanex.Data.Repository;
    using Utilities;

    public class AffiliateCpaReportService : BaseDynamicService, IAffiliateCpaReportService
    {
        public AffiliateCpaReportService(IDynamicRepository dynamicRepository) : base(dynamicRepository) { }

        public EntityResult<AffiliateCpaReport> GetData(AffiliateCpaParam param)
        {
            if (!DateTimeHelper.IsValidDateRange(param.FromDate, param.ToDate))
            {
                return new EntityResult<AffiliateCpaReport>();
            }

            var criteria = param.MapTo<AffiliateCpaParam, AffiliateCpaReportCriteria>();
            return FetchEntityResultHasItemTotal<AffiliateCpaReport>(criteria);
        }
    }
}