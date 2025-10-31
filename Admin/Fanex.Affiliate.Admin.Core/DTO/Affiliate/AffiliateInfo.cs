using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using System;

namespace Fanex.Affiliate.Admin.Core.DTO.Affiliate
{
    public class AffiliateInfo
    {
        public int AffId { get; set; }

        public int AffCode { get; set; }

        public int? ParentAffId { get; set; }

        public string ParentAffName { get; set; }

        public int? NoOfSubAff { get; set; }

        public string UserName { get; set; }

        public string Status { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string TargetCountryCode { get; set; }

        public string Language { get; set; }

        [CensoredPermissionCheck(Function.AffPersonalInfo)]
        public string Email { get; set; }

        public DateTime RegistrationDate { get; set; }

        public DateTime? ApprovalDate { get; set; }

        public string GroupName { get; set; }

        public string CommissionGroup => GroupName ?? "N/A";

        public decimal? BalanceBf { get; set; }

        public int? Member { get; set; }

        public bool IsFavorite { get; set; }

        public string Currency { get; set; }

        public string PlayerCurrency { get; set; }

        public string PlayerUserName { get; set; }

        [CensoredPermissionCheck(Function.AffPersonalInfo)]
        public string Phone { get; set; }

        public string RegistrationDateText => RegistrationDate.ToString("MM/dd/yyyy HH:mm:ss");

        public string ApprovalDateText => ApprovalDate?.ToString("MM/dd/yyyy HH:mm:ss") ?? "N/A";

        public bool IsUsingPrivateCommGroup { get; set; }

        public string ApprovedBy { get; set; }

        public string ApprovedByText => string.IsNullOrEmpty(ApprovedBy) ? "N/A" : ApprovedBy;

        public int DealVerifyFlags { get; set; }
    }
}
