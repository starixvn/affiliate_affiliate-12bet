using Fanex.Affiliate.User.Core.Enum;
using Fanex.Data;

namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel
{
    public class MarketingBannerParam : LinkBaseParam
    {
        public string Category { get; set; }

        public string Language { get; set; }

        public string Size { get; set; }

        public string Currency { get; set; }

        public string AffType { get; set; }

        public int? PageSize { get; set; }

        public int? PageIndex { get; set; }

        public byte? DeviceType { get; set; }

        public AffiliateLinkType TargetId { get; set; } = AffiliateLinkType.AffiliateLink;

        public int NRows { get; set; }

        [SpParam(Ignored = true)]
        public string BannerDomain { get; set; }

        public string SubCategory { get; set; }
    }
}
