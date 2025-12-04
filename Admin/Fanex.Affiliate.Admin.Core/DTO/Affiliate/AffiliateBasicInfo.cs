namespace Fanex.Affiliate.Admin.Core.DTO.Affiliate
{
    public class AffiliateBasicInfo
    {
        public int AffId { get; set; }

        public string AffCode { get; set; }

        public string ParentAffName { get; set; }

        public int GroupId { get; set; }

        public string AffName { get; set; }

        public string UserName => AffName;

        public int AffType { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Phone { get; set; }

        public string ContactNumber => Phone;

        public string Email { get; set; }

        public string Status { get; set; }

        public bool MailOption { get; set; }

        public string PreferredLanguage { get; set; }

        public string PlayerUsername { get; set; }

        public int PlayerCustId { get; set; }

        public bool IsUsingPrivateCommGroup { get; set; }

        public byte AffCategoryId { get; set; }

        public byte GroupTypeId { get; set; }

        public byte DealVerifyFlags { get; set; }
    }
}
