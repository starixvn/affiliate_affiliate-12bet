namespace Fanex.Affiliate.User.Core.ViewModels.UserPanel.CPAReport
{
    using System;
    using System.Collections.Generic;
    using System.Web.Mvc;

    public class CPAReportViewModel
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public IEnumerable<SelectListItem> StatusList { get; set; }
    }
}
