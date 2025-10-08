namespace Fanex.Affiliate.Admin.Core.DTO.Report
{
    using System;

    public class PaymentCpaManagement
    {
        private const string DATE_FORMAT = "MM/dd/yyyy";

        public int PaymentId { get; set; }

        public int RowIdx { get; set; }

        public DateTime? StartSchedule { get; set; }

        public string StartScheduleStr => StartSchedule?.ToString(DATE_FORMAT) ?? string.Empty;

        public DateTime? EndSchedule { get; set; }

        public string EndScheduleStr => EndSchedule?.ToString(DATE_FORMAT) ?? string.Empty;

        public int AffId { get; set; }

        public string AffUserName { get; set; }

        public int GroupId { get; set; }

        public string DealName { get; set; }

        public string PaymentFrequency { get; set; }

        public int RedepositDays { get; set; }

        public decimal RedepositRate { get; set; }

        public string Status { get; set; }

        public byte StatusId { get; set; }

        public DateTime? ExpiredRedepositDate { get; set; }

        public string ExpiredRedepositDateStr => ExpiredRedepositDate?.ToString(DATE_FORMAT) ?? "-";

        public int TotalEligiblePlayers { get; set; }

        public string NoOfRedepositPlayers { get; set; }

        public decimal EstimateAmount { get; set; }

        public decimal ApprovedAmount { get; set; }

        public DateTime? ApprovedDate { get; set; }

        public string ApprovedDateStr => EndSchedule?.ToString(DATE_FORMAT) ?? "";

        public decimal AdjustedAmount { get; set; }

        public DateTime? AdjustedDate { get; set; }

        public string AdjustedDateStr => AdjustedDate?.ToString(DATE_FORMAT) ?? "";

        public string Description { get; set; }

        public decimal FinalCpaAmount { get; set; }

        public bool IsEnabled { get; set; }

        public int AdjustedBy { get; set; }
    }
}
