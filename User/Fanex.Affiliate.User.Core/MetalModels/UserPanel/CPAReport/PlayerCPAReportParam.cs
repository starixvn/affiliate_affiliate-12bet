namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel.CPAReport
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using Constants;

    public class PlayerCPAReportParam
    {
        public int AffId { get; set; }

        public string Player { get; set; }

        public int GroupId { get; set; }

        [Required]
        public string Status { get; set; }

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
                return PlayerCpaStatus.ALL_STATUSES.Contains(Status) ? Status : PlayerCpaStatus.ALL_STATUSES;
            }
        }
    }
}