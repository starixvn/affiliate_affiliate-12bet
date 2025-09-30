namespace Fanex.Affiliate.Admin.Core.DTO.Component
{
    using System;

    public class ComponentDetailInfo : ComponentInfo
    {
        public string CreatedBy { get; set; }

        public int CreatorId { get; set; }

        public DateTime CreatedDate { get; set; }

        public string CreatedDateText => CreatedDate.ToString("MM/dd/yyyy");

        public string LastModifiedBy { get; set; }

        public int LastModifiedById { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public string LastModifiedDateText => LastModifiedDate.HasValue ? LastModifiedDate.Value.ToString("MM/dd/yyyy") : string.Empty;
    }
}