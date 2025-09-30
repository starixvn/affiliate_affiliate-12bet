namespace Fanex.Affiliate.Admin.Core.Criterias.CampaignManagement
{
    using Data.Repository;

    public class GetAllComponentTypeCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "Aff_LandingPage_ComponentType_Sel";

        public override bool IsValid() => true;
    }
}