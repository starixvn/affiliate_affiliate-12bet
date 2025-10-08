namespace Fanex.Affiliate.User.Core.MetalModels.UserPanel
{
    using Constants;
    using Fanex.Affiliate.User.Core.MetalModels.UserPanel.AccountOverview;

    public class PlayerDetailParam : AccountOverviewParam
    {
        private const int Turnover = 5;

        public int PageIndex { get; set; } = Page.PageIndex;

        public int PageSize { get; set; } = Page.PageSize;

        public int SortById { get; set; } = Turnover;

        public bool IsSortAsc { get; set; }

        public int NRows { get; set; }
    }
}
