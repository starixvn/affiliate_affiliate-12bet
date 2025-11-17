namespace Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview
{
    public class OverviewSummary
    {
        public int Signups { get; set; }

        public int DepositedMembers { get; set; }

        public decimal BalanceBroughtForward { get; set; }

        public int ActivePlayers { get; set; }

        public int QualifiedMember { get; set; }

        public decimal Deposit { get; set; }

        public decimal Commission { get; set; }

        public decimal FdmDeposit { get; set; }

        public int NoOfSubAff { get; set; }

        public decimal SubAffCommission { get; set; }

        public bool IsMaxSubLevel { get; set; }

        public decimal NetGGR { get; set; }

        public int TotalClick { get; set; }

        public int UniqueClick { get; set; }

        public decimal ApprovedCPAAmount { get; set; }
        public decimal TentativeCPAAmount { get; set; }
        public decimal QualifiedMemberCPA { get; set; }
        public string GroupTypeName { get; set; }
        public bool IsGetMonthly { get; set; }
    }
}
