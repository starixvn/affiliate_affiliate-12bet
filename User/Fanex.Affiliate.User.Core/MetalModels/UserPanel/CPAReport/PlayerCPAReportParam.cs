namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel.CPAReport
{
    using System;
    using Constants;

    public class PlayerCPAReportParam
    {
        private const string ALL_STATUSES = "2,3,1,4,5,0,6";
        public int AffId { get; set; }

        public string Player { get; set; }

        public int Status { get; set; }

        public int ViewBy { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int PageSize { get; set; } = Page.PageSize;

        public int PageIndex { get; set; } = Page.PageIndex;

        public int SortType { get; set; }

        public bool SortDirectionType { get; set; }

        public string StatusId
        {
            get
            {
                if (Status < 0)
                {
                    return ALL_STATUSES;
                }

                return Status.ToString();
            }
        }
    }
}