namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport
{
    using System.Collections.Generic;
    using DTO.UserPanel.CPAReport;

    public class RedepositCPAReportDataViewModel
    {
        public IList<List<RedepositCPAReportItem>> Data { get; set; }

        public RedepositCPAReportItem Total { get; set; }

        public int RowNumber { get; set; }
    }
}