namespace Fanex.Affiliate.User.Core.DTO.UserPanel.CPAReport
{
    using Fanex.Affiliate.User.Core.Constants;
    using System;

    public class PaymentCPAReportItem
    {
        public int RowNum { get; set; }

        public int GroupId { get; set; }

        public DateTime? StartDate { get; set; }

        public string DisplayStartDate => StartDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? string.Empty;

        public DateTime? EndDate { get; set; }

        public string DisplayEndDate => EndDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? string.Empty;

        public int RecheckDays { get; set; }

        public DateTime? ExpiredRedepositDate { get; set; }

        public string DisplayExpiredRedepositDate => ExpiredRedepositDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? string.Empty;

        public int EligiblePlayers { get; set; }

        public decimal RedepositPercentage { get; set; }

        public string NoOfPlayerRedeposit { get; set; }

        public string NoOfPlayerRedepositString => NoOfPlayerRedeposit ?? string.Empty;

        public decimal EstimatedCPAAmount { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }

        public decimal AutomaticallyApprovedAmount { get; set; }
        public DateTime? AutomaticallyApprovedDate { get; set; }
        public string DisplayAutomaticallyApprovedDate => AutomaticallyApprovedDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? string.Empty;
        public decimal ManuallyApprovedAmount { get; set; }
        public DateTime? ManuallyApprovedDate { get; set; }
        public string DisplayManuallyApprovedDate => ManuallyApprovedDate?.ToString(DateTimeFormat.MM_dd_yyyy) ?? string.Empty;
        public string AdjustmentDescription { get; set; }
        public string DisplayDescription => AdjustmentDescription ?? string.Empty;
        public decimal AdjustedAmount { get; set; }
        public decimal FinalCPAAmount { get; set; }
    }
}
