using System;

namespace Fanex.Affiliate.User.Core.DTO.Auth
{
    [Serializable]
    public class UserSession
    {
        public string PreferredLanguage { get; set; }

        public string UserName { get; set; }

        public int AffId { get; set; }

        public int AffCode { get; set; }

        public int OnUserId { get; set; }

        public string AffType { get; set; }

        public string GroupName { get; set; }

        public string GroupNameType { get; set; }

        public bool IsMaxSubLevel { get; set; }

        public bool IsDepositFeePercent { get; set; }

        public bool IsWithdrawalFeePercent { get; set; }

        public int BaseCurrency { get; set; }

        public bool DisabledTransfer { get; set; }

        public int OfferPageId { get; set; }

        public bool IsMarketingAccount { get; set; }
    }
}