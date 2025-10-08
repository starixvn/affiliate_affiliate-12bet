using System;

namespace Fanex.Affiliate.Admin.Core.DTO.Report
{
    public class AffiliateReport
    {
        public int AffId { get; set; }

        public string UserName { get; set; }

        public string PaymentCurrency { get; set; }

        public string PaymentFrequency { get; set; }

        public DateTime? MonthDate { get; set; }

        public string Description { get; set; }

        public string MonthDateString => MonthDate?.ToString("MM/yyyy") ?? string.Empty;

        public int TotalClick { get; set; }

        public int UniqueClick { get; set; }

        public int Signup { get; set; }

        public int Fdm { get; set; }

        public decimal Fdm_Amount { get; set; }

        public decimal FDM_TotalDeposit { get; set; }

        public int ActivePlayer { get; set; }

        public int QualifiedMember { get; set; }

        public int QualifiedCPAMember { get; set; }

        public decimal Deposit { get; set; }

        public decimal Withdrawal { get; set; }

        public decimal Turnover { get; set; }

        public decimal Ggr { get; set; }

        public decimal Bonus { get; set; }

        public decimal Rebate { get; set; }

        public decimal PlatformFee { get; set; }

        public decimal DepositFee { get; set; }

        public decimal WithdrawalFee { get; set; }

        public decimal TotalFee { get; set; }

        public decimal CommissionRate { get; set; }

        public decimal Earning { get; set; }

        public string EarningBy { get; set; }

        public decimal AffWithdrawal { get; set; }

        public decimal AffAdjustment { get; set; }

        public decimal BalanceBf { get; set; }

        public decimal CurrentBBF { get; set; }

        public int NoOfSubAff { get; set; }

        public decimal SubAffEarning { get; set; }

        public decimal TotalEarning { get; set; }

        public bool IsMultiGroupProduct { get; set; }

        public int TotalDeposit { get; set; }

        public string PreferredLanguage { get; set; }

        public string Status { get; set; }

        public int GroupId { get; set; }

        public string CommGroupName { get; set; }

        public decimal ApprovedCPAAmount { get; set; }

        public decimal AdjustedCPAAmount { get; set; }

        public decimal TotalMainEarning { get; set; }
    }
}
