namespace Fanex.Affiliate.User.Core.Criterias
{
    using Utilities;

    public class GetMessageListCriteria : PagingByDateCriteria
    {
        private const string SpKey = "Aff_HotNewsSel";

        public bool? Important { get; set; }

        public string Language { get; set; }

        public override string GetSettingKey() => DbSettingHelper.BuildSpKey(IsInternal, SpKey);
    }
}
