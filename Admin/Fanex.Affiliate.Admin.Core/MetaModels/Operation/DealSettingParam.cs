namespace Fanex.Affiliate.Admin.Core.MetaModels.Operation
{
    using Fanex.Affiliate.Admin.Core.DTO.Operation;

    public class DealSettingParam : DealSettingDetail
    {
        public new string VerificationMethods { get; set; }

        public bool CheckedMinFdm { get; set; }

        public bool CheckedMinTotalDeposit { get; set; }

        public bool CheckedMinTurnover { get; set; }

        public bool IsActivePlayerHoldingPeriod { get; set; }

        public bool IsQuota { get; set; }

        public bool IsRedeposit { get; set; }

        public int UserId { get; set; }

        public string Ip { get; set; }
    }
}
