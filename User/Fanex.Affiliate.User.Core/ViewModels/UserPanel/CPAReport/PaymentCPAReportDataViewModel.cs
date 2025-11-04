namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport
{
    using System.Collections.Generic;
    using DTO.UserPanel.CPAReport;

    public class PaymentCPAReportDataViewModel
    {
        public IList<List<PaymentCPAReportItem>> Data { get; set; }

        public PaymentCPAReportItem Total { get; set; }

        public int RowNumber { get; set; }
    }
}