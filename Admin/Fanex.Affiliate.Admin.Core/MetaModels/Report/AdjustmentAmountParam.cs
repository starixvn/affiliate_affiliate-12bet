namespace Fanex.Affiliate.Admin.Core.MetaModels.Report
{
    public class AdjustmentAmountParam : UserInfoParam
    {
        public int AffId { get; set; }

        public int PaymentId { get; set; }

        public decimal NewAmount { get; set; }

        public decimal AdjustAmount { get; set; }

        public string TransDesc { get; set; }
    }
}
