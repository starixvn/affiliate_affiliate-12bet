using Fanex.Data;
using System;

namespace Fanex.Affiliate.User.Core.Criterias.CPAReport
{
    public class GetPlayerCPAReportCriteria : AffPagingCriteria
    {
        [SpParam(SqlParamName = "CustName")]
        public string Player { get; set; }

        public string StatusId { get; set; }

        public int ViewBy { get; set; }

        public int GroupId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey() => $"Aff_User_Report_PlayerCPA";

        public override bool IsValid() => AffId > 0 && FromDate <= ToDate;
    }
}
