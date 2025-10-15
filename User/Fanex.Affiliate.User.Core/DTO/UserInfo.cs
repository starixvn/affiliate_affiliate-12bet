namespace Fanex.Affiliate.User.Core.DTO
{
    public class UserInfo
    {
        public int AffId { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string PreferredLanguage { get; set; }

        public bool MailOption { get; set; }

        public string Email { get; set; }

        public string LastName { get; set; }

        public string SecretKey { get; set; }

        public string TargetCountryCode { get; set; }
    }
}
