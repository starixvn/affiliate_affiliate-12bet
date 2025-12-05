namespace Fanex.Affiliate.User.Core.Criterias.CPAReport
{
    using System;

    public class GetPaymenttCPAReportCriteria : AffPagingCriteria
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string Status { get; set; }

        public int ViewBy { get; set; }

        public override string GetSettingKey() => "Aff_User_Report_PaymentCPA";

        public override bool IsValid() => AffId > 0 && FromDate <= ToDate;
    }
}
