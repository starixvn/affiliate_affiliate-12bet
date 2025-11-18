using System;

namespace Fanex.Affiliate.User.Core.DTO.UserPanel.AccountOverview
{
    public class SubAffDetail : BaseGroupTypeId
    {
        public int AffId { get; set; }

        public string UserName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime ApprovedDate { get; set; }

        public bool IsSuspended { get; set; }

        public DateTime SuspendedDate { get; set; }

        public decimal Turnover { get; set; }

        public decimal GGR { get; set; }

        public decimal Commission { get; set; }

        public int ActivePlayer { get; set; }

        public int QualifiedMember { get; set; }

        public int QualifiedMemberCPA { get; set; }
    }
}