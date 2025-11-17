namespace Fanex.Affiliate.Admin.Core.Commands.Operation
{
    public abstract class BaseDealCommand : BaseNonQueryCommand
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public int DealVerifyFlags { get; set; }

        public bool IsSubCommRate { get; set; }

        public decimal SubCommRate { get; set; }

        public string Description { get; set; }

        public string CountryCodes { get; set; }

        public short ActiveDays { get; set; }

        public short HoldingDays { get; set; }

        public short HoldingTickets { get; set; }

        public short Quota { get; set; }

        public string CpaTierList { get; set; }

        public string CpaProductList { get; set; }

        public decimal QMTurnover { get; set; }

        public bool IsActivePlayerSum { get; set; }

        public string TierList { get; set; }

        public string DeductionList { get; set; }

        public short RedepositDays { get; set; }

        public decimal RedepositRate { get; set; }
    }
}
