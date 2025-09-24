namespace Fanex.Affiliate.Admin.Core.Criterias.LinkGenerator
{
    public class GetLinkManagementCriteria : PagingCriteria
    {
        private const string SP_NAME = "";

        public override string GetSettingKey() => SP_NAME;

        public override bool IsValid() => true;

        public string TargetCountryCodes { get; set; }

        public string LinkName { get; set; }

        public string CampaignName { get; set; }
    }
}
