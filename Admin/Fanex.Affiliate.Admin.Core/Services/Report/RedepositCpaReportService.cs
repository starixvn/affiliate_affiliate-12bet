namespace Fanex.Affiliate.Admin.Core.Services.Report
{
    using Commands.PaymentCpa;
    using Criterias.Report;
    using Data.Repository;
    using DTO;
    using DTO.Report;
    using Extensions;
    using MetaModels.Report;
    using Utilities;

    public class RedepositCpaReportService : BaseDynamicService, IRedepositCpaReportService
    {
        public RedepositCpaReportService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public EntityResult<RedepositCpaReport> GetReportData(RedepositCpaReportParam param)
        {
            if (!DateTimeHelper.IsValidDateRange(param.FromDate, param.ToDate))
            {
                return new EntityResult<RedepositCpaReport>();
            }

            var criteria = param.MapTo<RedepositCpaReportParam, RedepositCpaReportCriteria>();
            return FetchEntityResultHasItemTotal<RedepositCpaReport>(criteria);
        }

        public ResultInfo AdjustmentAmount(AdjustmentAmountParam param)
        {
            var command = param.MapTo<AdjustmentAmountParam, AdjustmentAmountCommand>();
            return ExecuteReturnResultInfo(command);
        }
    }
}
