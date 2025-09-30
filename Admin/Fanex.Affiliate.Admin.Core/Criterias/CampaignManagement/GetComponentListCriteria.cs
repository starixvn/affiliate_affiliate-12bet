namespace Fanex.Affiliate.Admin.Core.Criterias.CampaignManagement
{
    using Data.Repository;

    public class GetComponentListCriteria : CriteriaBase
    {
        public int ComponentTypeId { get; set; }

        public string Search { get; set; }

        public string StatusIds { get; set; }

        public override string GetSettingKey() => "Aff_LandingPage_Component_ManageSel";

        public override bool IsValid() => ComponentTypeId > 0;
    }
}