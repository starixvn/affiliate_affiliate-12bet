namespace Fanex.Affiliate.User.Core.Criterias
{
    using System;

    public class PagingByDateCriteria : PagingCriteria
    {
        private const int MAX_RANGE = 6;

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey() => string.Empty;

        public override bool IsValid() => !string.IsNullOrEmpty(GetSettingKey()) && FromDate != default && FromDate.AddMonths(MAX_RANGE) >= ToDate;
    }

}
