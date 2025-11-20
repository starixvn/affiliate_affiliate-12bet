namespace Fanex.Affiliate.Admin.Core.DTO.Apis
{
    public class MemberSiteCustomerInfo
    {
        public int CustId { get; set; }

        public int? SiteId { get; set; }

        public string UserName { get; set; }

        public int? CurrencyId { get; set; }

        public string UserLang { get; set; }

        public int? ActStatus { get; set; }

        public int? AgentId { get; set; }

        public string AllAgentId { get; set; }

        public int? UserLevel { get; set; }

        public bool? IsTest { get; set; }

        public int? Status { get; set; }
    }
}
