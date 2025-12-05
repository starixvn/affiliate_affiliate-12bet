namespace Fanex.Affiliate.User.Core.Criterias
{
    public class GetPlayerDetailListCriteria : PagingByDateCriteria
    {
        public int AffId { get; set; }

        public int SortById { get; set; }

        public bool IsSortAsc { get; set; }

        public override string GetSettingKey() => "Aff_User_Overview_PlayersDetail_Sel";

        public override bool IsValid() => AffId > 0 && base.IsValid();
    }
}
