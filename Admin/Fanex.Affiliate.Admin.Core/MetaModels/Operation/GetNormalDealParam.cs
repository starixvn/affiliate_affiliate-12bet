namespace Fanex.Affiliate.Admin.Core.MetaModels.Operation
{
    using Constants;

    public class GetNormalDealParam
    {
        public int AffId { get; set; } = DefaultValue.AllId;

        public int GroupId { get; set; }
    }
}
