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

    public class PaymentCpaManagementService : BaseDynamicService, IPaymentCpaManagementService
    {
        public PaymentCpaManagementService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public EntityResult<PaymentCpaManagement> GetReportData(PaymentCpaManagementParam param)
        {
            if (!DateTimeHelper.IsValidDateRange(param.FromDate, param.ToDate))
            {
                return new EntityResult<PaymentCpaManagement>();
            }

            var criteria = param.MapTo<PaymentCpaManagementParam, PaymentCpaManagementCriteria>();
            return FetchEntityResultHasItemTotal<PaymentCpaManagement>(criteria);
        }

        public ResultInfo AdjustmentAmount(AdjustmentAmountParam param)
        {
            var command = param.MapTo<AdjustmentAmountParam, AdjustmentAmountCommand>();
            return ExecuteReturnResultInfo(command);
        }
    }
}
