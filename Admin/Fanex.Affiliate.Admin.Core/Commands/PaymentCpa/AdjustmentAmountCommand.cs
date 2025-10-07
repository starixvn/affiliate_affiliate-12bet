namespace Fanex.Affiliate.Admin.Core.Commands.PaymentCpa
{
    public class AdjustmentAmountCommand : BaseAffNonQueryCommand
    {
        public int PaymentId { get; set; }

        public decimal NewAmount { get; set; }

        public decimal AdjustAmount { get; set; }

        public string TransDesc { get; set; }

        public override string GetSettingKey() => "Aff_Admin_PaymentCPA_Adjustment_Ins";

        public override bool IsValid() => true;
    }
}
