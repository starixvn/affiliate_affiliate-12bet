namespace Fanex.Affiliate.User.Core.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.CoreService;
    using Fanex.Affiliate.User.Core.DTO.UserPanel.Statistics;
    using Fanex.Affiliate.User.Core.Enum;
    using Filters;
    using MetalModels.UserPanel;
    using Utilities;
    using ViewModels.UserPanel.Statistics;

    [CustomAuthorize]
    public class LandingPageStatisticsController : BaseController
    {
        private readonly IStatisticsService _statisticsService;
        private readonly ISystemService _systemService;
        private readonly IMarketingService _marketingService;

        public LandingPageStatisticsController(
            ISessionService sessionService,
            ISystemService systemsService,
            IStatisticsService statisticsService,
            IMarketingService marketingService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _statisticsService = statisticsService;
            _marketingService = marketingService;
            _systemService = systemsService;
        }


        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var userSession = SessionService.UserSession;
            var isInternal = SessionService.IsInternal;

            var now = DateTimeHelper.Gmt8Now;
            var landingPageStatisticsParam = new LandingPageStatisticsParam
            {
                AffId = userSession.AffId,
                IsInternal = isInternal,
                FromDate = DateTimeHelper.CreateDateTime(now.Year, now.Month, 1),
                ToDate = now,
                DeviceType = (short)DeviceTypeHasAll.All
            };

            var landingPageParam = new LandingPageParam
            {
                IsInternal = isInternal
            };

            var viewModel = new LandingPageStatisticsViewModel
            {
                LanguageList = SystemHelper.GetTargetLanguageList(_systemService.GetLanguageList(), userSession.PreferredLanguage),
                MemberSitePageList = _marketingService.GetLandingPageList(landingPageParam),
                FromDate = landingPageStatisticsParam.FromDate,
                ToDate = landingPageStatisticsParam.ToDate,
                DataList = GetLandingPageStatisticsData(landingPageStatisticsParam),
                IsDetail = false
            };

            return View("~/Views/UserPanel/Statistics/LandingPageStatistics/Index.cshtml", viewModel);
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult Index(LandingPageStatisticsParam landingPageParam)
        {
            landingPageParam.AffId = SessionService.UserSession.AffId;
            landingPageParam.IsInternal = SessionService.IsInternal;

            var viewModel = new LandingPageStatisticsViewModel
            {
                DataList = GetLandingPageStatisticsData(landingPageParam),
                IsDetail = false
            };

            return PartialView("~/Views/UserPanel/Statistics/StatisticsPartial/_LandingPageStatisticsContent.cshtml", viewModel);
        }

        private IEnumerable<LandingPageStatistics> GetLandingPageStatisticsData(LandingPageStatisticsParam landingPageParam)
        {
            var dataList = _statisticsService.GetLandingPageStatistics(landingPageParam);

            foreach (var item in dataList)
            {
                var language = _systemService.GetLanguageList().FirstOrDefault(p => p.Code == item.LanguageCode);

                item.LanguageName = language == null ? item.LanguageCode : language.NativeName;
            }

            return dataList;
        }
    }
}