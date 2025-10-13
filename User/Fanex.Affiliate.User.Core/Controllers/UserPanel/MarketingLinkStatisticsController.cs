namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using System.Linq;
    using System.Web.Mvc;
    using BusinessService;
    using CoreService;
    using Filters;
    using MetalModels.UserPanel;
    using Utilities;
    using ViewModels.UserPanel.Statistics;

    [CustomAuthorize]
    public class MarketingLinkStatisticsController : BaseController
    {
        private readonly IStatisticsService _statisticsService;

        public MarketingLinkStatisticsController(
            ISessionService sessionService,
            ISystemService systemsService,
            IStatisticsService statisticsService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _statisticsService = statisticsService;
        }

        public ActionResult Index()
        {
            var now = DateTimeHelper.Gmt8Now;
            var startMonth = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1);
            var languages = SystemHelper.GetTargetLanguageList(SystemService.GetLanguageList(), SessionService.UserSession.PreferredLanguage);

            var viewModel = new MarketingPageStatisticsViewModel
            {
                FromDate = startMonth,
                ToDate = now,
                IncludeInActiveLink = false
            };

            ViewBag.Languages = languages;

            return View("~/Views/UserPanel/Statistics/MarketingPageStatistics/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(MarketingPageStatisticsViewModel vm)
        {
            var param = new MarketingPageStatisticsParam
            {
                AffId = SessionService.UserSession.AffId,
                FromDate = vm.FromDate,
                ToDate = vm.ToDate,
                IncludedInActive = vm.IncludeInActiveLink,
                LanguageCodes = vm.Language
            };

            var model = _statisticsService.GetMarketingPageStatistics(param).GroupBy(s => s.ChannelName);

            return PartialView("~/Views/UserPanel/Statistics/StatisticsPartial/_MarketingPageStatisticsContent.cshtml", model);
        }
    }
}
