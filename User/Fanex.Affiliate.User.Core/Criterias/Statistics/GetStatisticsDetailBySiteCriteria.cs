namespace Fanex.Affiliate.User.Core.Criterias
{
    using Utilities;

    public class GetStatisticsDetailBySiteCriteria : PagingByDateCriteria
    {
        private const string SpKey = "Aff_ClickStatisticsDetailBySite";

        public int AffId { get; set; }

        public short DeviceType { get; set; }

        public string Domain { get; set; }

        public string SportCode { get; set; }

        public string LanguageCode { get; set; }

        public override string GetSettingKey() => DbSettingHelper.BuildSpKey(IsInternal, SpKey);

        public override bool IsValid() => AffId > 0 && base.IsValid();
    }
}
