using Fanex.Data.Repository;

namespace Fanex.Affiliate.Admin.Core.Criterias.UserPanel
{
    public class GetChannelsCriteria : CriteriaBase
    {
        const string SP_NAME = "";

        public override string GetSettingKey() => SP_NAME;

        public override bool IsValid() => true;
    }
}
