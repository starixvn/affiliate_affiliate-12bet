using System.ComponentModel.DataAnnotations;

namespace Fanex.Affiliate.Admin.Core.MetaModels.LinkGenerator
{
    public class LinkManagementParam
    {
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string TargetCountryCodes { get; set; }
        public string LinkName { get; set; }
        public string CampaignName { get; set; }
    }
}
