using System;

namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel
{
    public class CPAReportParam
    {
        public int AffId { get; set; }

        public int StatusId {  get; set; }

        public int ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int PageSize { get; set; }

        public int PageIndex { get; set; }

        public int NRows { get; set; }

        public int SortType { get; set; }

        public bool SortDirectionType { get; set; }

        public string Month { get; set; }
    }
}
