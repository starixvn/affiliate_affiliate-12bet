namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel
{
    using System;
    using Constants;
    using Data;

    public class RedepositCPAReportParam
    {
        public int AffId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int PageIndex { get; set; } = Page.PageIndex;

        public int PageSize { get; set; } = Page.PageSize;

        [SpParam(Ignored = true)]
        public int TotalPages { get; set; }

        public int NRows { get; set; }
    }
}
