namespace Fanex.Affiliate.Admin.Core.Criterias.Operation
{
    using Data.Repository;

    public class GetAssignDealCriteria : CriteriaBase
    {
        public int AffId { get; set; }

        public int GroupId { get; set; }

        public override string GetSettingKey() =>  "Aff_Admin_Assign_Deal_Sel";

        public override bool IsValid() => true;
    }
}
