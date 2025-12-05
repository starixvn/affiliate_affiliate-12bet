using System;

namespace Fanex.Affiliate.User.Core.Criterias
{
    public abstract class AffByDateCriteria : BaseCriteria
    {
        public int AffId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}
