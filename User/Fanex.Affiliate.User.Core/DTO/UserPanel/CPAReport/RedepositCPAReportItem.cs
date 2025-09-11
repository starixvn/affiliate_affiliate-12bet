namespace Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport
{
    using System;

    public class RedepositCPAReportItem
    {
        public int RowIdx { get; set; }

        public int DealId { get; set; }

        public DateTime StartFrom { get; set; }

        public string DisplayStartFrom => StartFrom.ToString("MM/dd/yyyy");

        public DateTime ApprovalDate { get; set; }

        public string DisplayApprovalDate => ApprovalDate.ToString("MM/dd/yyyy");

        public int RecheckDays { get; set; }

        public DateTime ExpiredRedepositDate { get; set; }

        public string DisplayExpiredRedepositDate => ExpiredRedepositDate.ToString("MM/dd/yyyy");

        public int ApprovedCPAPlayer { get; set; }

        public decimal RedepositRate { get; set; }

        public string NoOfPlayerRedeposit { get; set; }

        public decimal TotalSettledCPAAmount { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }
    }
}
