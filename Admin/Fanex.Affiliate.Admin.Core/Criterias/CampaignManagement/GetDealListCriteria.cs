namespace Fanex.Affiliate.Admin.Core.Criterias.CampaignManagement
{
    using Data.Repository;

    public class GetDealListCriteria : CriteriaBase
    {
        public string DealTypes { get; set; }

        public string DealName { get; set; }

        public string StatusIds { get; set; }

        public override string GetSettingKey() => "Aff_LandingPage_Deal_ManageSel";

        public override bool IsValid() => !string.IsNullOrEmpty(StatusIds);
    }
}