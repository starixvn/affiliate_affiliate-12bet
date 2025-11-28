using Fanex.Data.Repository;

namespace Fanex.Affiliate.Admin.Core.Criterias.UserPanel
{
    public class GetChannelsCriteria : CriteriaBase
    {
        public GetChannelsCriteria(int affId)
        {
            AffId = affId;
        }
        public int AffId { get; set; }

        public override string GetSettingKey() => "Aff_User_AffMediaChannel_Sel";

        public override bool IsValid() => AffId > 0;
    }
}
