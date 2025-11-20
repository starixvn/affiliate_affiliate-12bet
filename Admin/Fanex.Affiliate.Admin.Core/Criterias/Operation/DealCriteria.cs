namespace Fanex.Affiliate.Admin.Core.Criterias.Operation
{
    public class DealCriteria : PagingCriteria
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public byte GroupTypeId { get; set; }

        public override string GetSettingKey() => "Aff_Admin_Deal_Sel";

        public override bool IsValid() => true;
    }
}