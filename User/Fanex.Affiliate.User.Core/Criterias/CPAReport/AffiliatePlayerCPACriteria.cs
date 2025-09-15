using Fanex.Data;
using Fanex.Data.Repository;
using System;

namespace Fanex.Affiliate.User.Core.Criterias.CPAReport
{
    public class AffiliatePlayerCPACriteria : PagingCriteria
    {
        public int AffId { get; set; }

        public int StatusId { get; set; }

        public int ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [SpParam(SqlParamName = "NRows")]
        public int TotalRows {get; set; }

        public override string GetSettingKey() => $"Aff_User_Report_PlayerCPA";

        public override bool IsValid() => FromDate <= ToDate;
    }
}
