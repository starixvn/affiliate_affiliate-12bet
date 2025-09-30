namespace Fanex.Affiliate.Admin.Core.Criterias.CampaignManagement
{
    using Data.Repository;

    public class GetAllComponentStatusCriteria : CriteriaBase
    {
        public override string GetSettingKey() => "Aff_LandingPage_Component_Status_Sel";

        public override bool IsValid() => true;
    }
}
