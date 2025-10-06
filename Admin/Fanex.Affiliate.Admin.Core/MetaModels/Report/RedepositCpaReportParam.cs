namespace Fanex.Affiliate.Admin.Core.MetaModels.Report
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class RedepositCpaReportParam
    {
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string UserName { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string DealIds { get; set; }

        public string Status { get; set; }

        public byte ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool IsExportExcel { get; set; }

        public int PageIndex { get; set; } = 1;

        public int PageSize { get; set; } = 20;
    }
}
