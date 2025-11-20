using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using System;

namespace Fanex.Affiliate.Admin.Core.DTO.Customer
{
    public class AffiliateInfoOnLeftPanel
    {
        public int? ParentAffId { get; set; }

        public string ParentAffName { get; set; }

        public int AffId { get; set; }

        public string AffCode { get; set; }

        public int GroupId { get; set; }

        public string AffName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public bool Gender { get; set; }

        public string ContactApps { get; set; }

        public string SiteUrl { get; set; }

        public string MoreSiteUrls { get; set; }

        public string NoSiteDesc { get; set; }

        public DateTime? LastLoginDate { get; set; }

        public string LastLoginDateText => LastLoginDate?.ToString("MM/dd/yyyy HH:mm:ss");

        public string LastLoginIp { get; set; }

        public string CommGroupName { get; set; }

        public decimal BalanceBf { get; set; }

        public string Status { get; set; }

        public int AffType { get; set; }

        public string PreferredLanguage { get; set; }

        public string TargetCountryName { get; set; }

        [CensoredPermissionCheck(Function.AffPersonalInfo)]
        public string Phone { get; set; }

        public string AffLink { get; set; }

        public bool IsUsingPrivateCommGroup { get; set; }

        public string ApprovedBy { get; set; }

        public bool IsDepositFeePercent { get; set; }

        public bool IsWithdrawalFeePercent { get; set; }

        [PermissionCheck(Function.TransferPlayerSetting)]
        public bool IsDisabledTransfer { get; set; }

        [PermissionCheck(Function.TransferPlayerSetting)]
        public decimal TransferLimit { get; set; }

        [PermissionCheck(Function.TransferPlayerSetting)]
        public string PlayerCurrency { get; set; }

        public byte GroupTypeId { get; set; }

        public string DealTypeName { get; set; }
    }
}
