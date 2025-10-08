namespace Fanex.Affiliate.User.Core.Criterias
{
    using Data.Repository;
    using System;

    public class GetUserOverviewSummaryCriteria : CriteriaBase
    {
        public int AffId { get; set; }

        public bool IsGetMonthly { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override string GetSettingKey() => "Aff_User_Overview_Summary_Sel";

        public override bool IsValid() => AffId > 0;
    }
}
