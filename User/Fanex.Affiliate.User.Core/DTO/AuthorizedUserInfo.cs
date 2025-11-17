namespace Fanex.Affiliate.User.Core.DTO.Auth
{
    public class AuthorizedUserInfo
    {
        public int AffId { get; set; }

        public int AffCode { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public string AffType { get; set; }

        public string PreferredLanguage { get; set; }

        public string Status { get; set; }

        public int OnUserId { get; set; }

        public string GroupName { get; set; }

        public string GroupTypeName { get; set; }

        public bool IsMaxSubLevel { get; set; }

        public bool IsDepositFeePercent { get; set; }

        public bool IsWithdrawalFeePercent { get; set; }

        public bool DisabledTransfer { get; set; }
    }
}