namespace Fanex.Affiliate.Admin.Core.MetaModels.Operation
{
    using System.ComponentModel.DataAnnotations;
    using Fanex.Affiliate.Admin.Core.Constants;

    public class DealParam
    {
        public int GroupId { get; set; }

        public string GroupName { get; set; }

        public byte GroupTypeId { get; set; }

        [Range(Validation.MinPageIndex, Validation.MaxPageIndex)]
        public int PageIndex { get; set; }

        [Range(Validation.MinPageSize, Validation.MaxPageSize)]
        public int PageSize { get; set; }
    }
}
