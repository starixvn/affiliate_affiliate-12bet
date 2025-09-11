namespace Fanex.Affiliate.User.Core.Criterias.CPAReport
{
    using System;

    public class GetRedepositCPAReportCriteria : AffPagingCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey() => "Aff_User_Report_RedepositCPA";

        public override bool IsValid() => AffId > 0;
    }
}
