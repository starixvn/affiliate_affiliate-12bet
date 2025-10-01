namespace Fanex.Affiliate.Admin.Core.DTO.Campaign
{
    using System;

    public class CampaignDetailInfo : CampaignInfo
    {
        public string Description { get; set; }

        public string Creator { get; set; }

        public int CreatorId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedDateText => CreatedDate.ToString("MM/dd/yyyy");

        public string UpdatedBy { get; set; }

        public int UpdatedById { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string UpdatedDateText => UpdatedDate.HasValue ? UpdatedDate.Value.ToString("MM/dd/yyyy") : string.Empty;

        public int StatusId { get; set; }

        public string Status { get; set; }

        public int RowIdx { get; set; }
    }
}