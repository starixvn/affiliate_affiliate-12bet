namespace Fanex.Affiliate.Admin.Core.DTO.Report
{
    using System;

    public class PlayerCpaReport
    {
        private const string HYPHEN = "-";
        private const string DATE_FORMAT = "MM/dd/yyyy";

        public int MemberCPAId { get; set; }

        public int AffId { get; set; }

        public string AffUserName { get; set; }

        public int CustId { get; set; }

        public string CustUserName { get; set; }

        public DateTime? RegisteredDate { get; set; }

        public string RegisteredDateStr => RegisteredDate?.ToString(DATE_FORMAT) ?? HYPHEN;

        public int GroupId { get; set; }

        public string DealName { get; set; }

        public int ScheduleId { get; set; }

        public string ScheduleName { get; set; }

        public decimal? FTD { get; set; }

        public bool IsFTD { get; set; }

        public decimal? TotalDeposit { get; set; }

        public bool IsTotalDeposit { get; set; }

        public bool IsTO { get; set; }

        public int? MemberCpaProductId { get; set; }

        public DateTime AQD { get; set; }

        public string AqdStr => AQD.ToString(DATE_FORMAT);

        public decimal CPAAmount { get; set; }

        public int? HoldingBetTickets { get; set; }

        public int? HoldingTickets { get; set; }

        public bool IsHolding { get; set; }

        public DateTime? HQD { get; set; }

        public string HqdStr => IsHolding && HQD.HasValue ? HQD.Value.ToString(DATE_FORMAT) : HYPHEN;

        public DateTime? HED { get; set; }

        public string HedStr => IsHolding && HED.HasValue ? HED.Value.ToString(DATE_FORMAT) : HYPHEN;

        public decimal? EstimatedCPAAmount { get; set; }

        public decimal? ApprovedCPAAmount { get; set; }

        public DateTime? FirstDepositDate { get; set; }

        public string FirstDepositDateStr => ExpiredRedepositDate.HasValue && FirstDepositDate.HasValue ? FirstDepositDate.Value.ToString(DATE_FORMAT) : HYPHEN;

        public int? ReDepositDays { get; set; }

        public DateTime? ExpiredRedepositDate { get; set; }

        public string ExpiredRedepositDateStr => ExpiredRedepositDate?.ToString(DATE_FORMAT) ?? HYPHEN;

        public bool? IsRedeposit { get; set; }

        public string CPAStatus { get; set; }

        public bool IsAbnormal { get; set; }

        public string Description { get; set; }

        public string BetTicket => IsHolding && HoldingBetTickets.HasValue && HoldingTickets.HasValue ? $"{HoldingBetTickets}/{HoldingTickets}" : HYPHEN;
    }
}
