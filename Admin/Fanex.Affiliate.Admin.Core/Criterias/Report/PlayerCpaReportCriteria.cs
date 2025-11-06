namespace Fanex.Affiliate.Admin.Core.Criterias.Report
{
    using System;
    using Fanex.Data.Repository;
    
    public class PlayerCpaReportCriteria : CriteriaBase
    {
        public string UserName { get; set; }

        public string CustName { get; set; }

        public string DealName { get; set; }

        public string StatusId { get; set; }

        public int ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int NRows { get; set; }

        public override string GetSettingKey() => "Aff_Admin_Report_PlayerCPA";

        public override bool IsValid() => true;
    }
}
