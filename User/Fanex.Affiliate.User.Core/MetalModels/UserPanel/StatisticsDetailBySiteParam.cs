namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel
{
    public class StatisticsDetailBySiteParam : StatisticsBySiteBaseParam
    {
        public string Domain { get; set; }

        public string SportCode { get; set; }

        public string LanguageCode { get; set; }

        public int? PageSize { get; set; }

        public int? PageIndex { get; set; }

        public int NRows { get; set; }
    }
}
