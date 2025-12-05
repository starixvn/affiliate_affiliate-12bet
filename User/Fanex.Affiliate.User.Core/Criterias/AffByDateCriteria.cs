using System;

namespace Fanex.Affiliate.User.Core.Criterias
{
    public class AffByDateCriteria : BaseCriteria
    {
        private const int MAX_RANGE = 6;

        public int AffId { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey() => string.Empty;

        public override bool IsValid() => !string.IsNullOrEmpty(GetSettingKey()) && AffId > 0 && FromDate != default && FromDate.AddMonths(MAX_RANGE) >= ToDate;
    }
}
