using Fanex.Data.Repository;

namespace Fanex.Affiliate.User.Core.Criterias.CPAReport
{
    public class AffiliatePlayerCPATurnOverCriteria : CriteriaBase
    {
        public int MemberCPAID { get; set; }

        public override string GetSettingKey() => $"Aff_User_Report_PlayerCPA_TO_Detail";

        public override bool IsValid() => true;
    }
}
