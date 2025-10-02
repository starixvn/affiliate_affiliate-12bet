namespace Fanex.Affiliate.Admin.Core.DTO.Component
{
    using System;

    public class ComponentDealInfo
    {
        public int DealId { get; set; }

        public string DealName { get; set; }

        public int GroupTypeId { get; set; }

        public string GroupTypeName { get; set; }

        public int StatusId { get; set; }

        public string Status { get; set; }
        public string CreatedBy { get; set; }

        public int CreatorId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedDateText => CreatedDate.ToString("MM/dd/yyyy");

        public string UpdatedBy { get; set; }

        public int UpdatedById { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public string UpdatedDateText => UpdatedDate.HasValue ? UpdatedDate.Value.ToString("MM/dd/yyyy") : string.Empty;
    }
}