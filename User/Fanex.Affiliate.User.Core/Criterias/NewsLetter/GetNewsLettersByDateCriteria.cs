namespace Fanex.Affiliate.User.Core.Criterias
{
    using Data.Repository;
    using System;

    public class GetNewsLettersByDateCriteria : CriteriaBase
    {
        public GetNewsLettersByDateCriteria(DateTime date)
        {
            Date = date;
        }

        public DateTime Date { get; set; }

        public override string GetSettingKey() => "Aff_Admin_Newsletter_Sel";

        public override bool IsValid() => Date != default;
    }
}
