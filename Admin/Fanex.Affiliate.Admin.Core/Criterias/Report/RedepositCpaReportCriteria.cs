namespace Fanex.Affiliate.Admin.Core.Criterias.Report
{
    public class RedepositCpaReportCriteria : PagingByDateCriteria
    {
        public string UserName { get; set; }

        public string DealIds { get; set; }

        public string Status { get; set; }

        public byte ViewBy { get; set; }

        public bool IsExportExcel { get; set; }

        public override string GetSettingKey() => "Aff_Admin_Report_PaymentCPA";

        public override bool IsValid() => true;
    }
}
