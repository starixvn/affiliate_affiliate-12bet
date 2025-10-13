namespace Fanex.Affiliate.User.Core.Controllers
{
    using CoreService;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.Filters;
    using System.Web.Mvc;

    public class FaqController : BaseController
    {
        public FaqController(
            ISessionService sessionService,
            ISystemService systemsService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index()
        {
            ViewBag.Language = SessionService.CurrentLanguage;
            ViewBag.Country = SessionService.CurrentCountry;

            return View("~/Views/Faq/Index.cshtml");
        }
    }
}