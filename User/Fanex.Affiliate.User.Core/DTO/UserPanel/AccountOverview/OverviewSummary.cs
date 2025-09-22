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

        public bool IsHybridSetting { get; set; }

        public string GroupType { get; set; }

        public decimal CPAAmount { get; set; }

        public bool IsCurrentMonth { get; set; }
    }
}
