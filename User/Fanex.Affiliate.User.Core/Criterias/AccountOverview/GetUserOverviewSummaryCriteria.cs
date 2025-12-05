namespace Fanex.Affiliate.User.Core.Criterias
{
    public class GetUserOverviewSummaryCriteria : AffByDateCriteria
    {
        public bool IsGetMonthly { get; set; }

        public override string GetSettingKey() => "Aff_User_Overview_Summary_Sel";
    }
}
