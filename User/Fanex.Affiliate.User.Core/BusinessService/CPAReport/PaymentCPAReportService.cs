namespace Fanex.Affiliate.User.Core.BusinessService.CPAReport
{
    using System.Collections.Generic;
    using System.Linq;
    using Constants;
    using CoreService;
    using Criterias.CPAReport;
    using Data.Repository;
    using DTO.UserPanel.CPAReport;
    using MetalModels.UserPanel.CPAReport;
    using Resources;
    using Utilities;
    using ViewModels.UserPanel.CPAReport;

    public class PaymentCPAReportService : BaseDynamicService, IPaymentCPAReportService
    {
        private const int PercentageUnit = 100;

        private const string DefaultText = "-";

        private static Dictionary<int, string> StatusMapper => new Dictionary<int, string>
        {
            {PaymentCPAStatus.Monitoring, Lang.Monitoring},
            {PaymentCPAStatus.NotQualified, Lang.NotQualified},
            {PaymentCPAStatus.Qualified, Lang.Qualified},
            {PaymentCPAStatus.Empty, Lang.Empty},
        };

        public PaymentCPAReportService(IDynamicRepository dynamicRepository) : base(dynamicRepository)
        {
        }

        public PaymentCPAReportDataViewModel GetPaymentCPAReportData(PaymentCPAReportParam param)
        {
            var criteria = param.MapTo<PaymentCPAReportParam, GetPaymenttCPAReportCriteria>();

            var rawData = FetchEntityResultWithPaging<PaymentCPAReportItem>(criteria);

            foreach (var item in rawData.MainDataList)
            {
                item.RedepositPercentage *= PercentageUnit;
                item.Status = StatusMapper.TryGetValue(item.StatusId, out string statusName) ? statusName : DefaultText;
            }

            var dataGroup = rawData.MainDataList
                .GroupBy(e => e.GroupId)
                .OrderBy(e => e.Min(i => i.RowNum))
                .Select(g => g.OrderBy(e=>e.RowNum).ToList())
                .ToList();

            return new PaymentCPAReportDataViewModel
            {
                Data = dataGroup,
                Total = rawData.Total,
                RowNumber = criteria.NRows
            };
        }
    }
}
