using Fanex.Data.Repository;

namespace Fanex.Affiliate.User.Core.Criterias.CPAReport
{
    public class GetPlayerCPATurnOverCriteria : CriteriaBase
    {
        public int MemberCPAID { get; set; }

        public override string GetSettingKey() => $"Aff_Admin_Report_PlayerCPA_TO_Detail";

        public override bool IsValid() => MemberCPAID > 0;
    }
}
