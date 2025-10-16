namespace Fanex.Affiliate.Admin.Core.MetaModels.Report
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Fanex.Affiliate.Admin.Core.Constants;

    public class PlayerCpaReportParam : PagingParam
    {
        [MaxLength(Validation.Hundred, ErrorMessage = "Affiliate must shorter than 100 characters!")]
        public string UserName { get; set; }

        [MaxLength(Validation.Hundred, ErrorMessage = "Player must shorter than 100 characters!")]
        public string CustName { get; set; }

        public string DealName { get; set; }
        
        public string StatusId { get; set; }

        public short ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }
    }
}
