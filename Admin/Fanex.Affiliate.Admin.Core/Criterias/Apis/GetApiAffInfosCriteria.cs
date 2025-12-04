using Fanex.Data.Repository;

namespace Fanex.Affiliate.Admin.Core.Criterias.Apis
{
    public class GetApiAffInfosCriteria : CriteriaBase
    {
        private const string SP_NAME = "Aff_API_AffiliateDetailInfo_Sel";

        public override string GetSettingKey() => SP_NAME;

        public override bool IsValid() => true;

        public int DealId { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }
    }
}
