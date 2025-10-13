namespace Fanex.Affiliate.User.Core.Controllers
{
    using CoreService;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.Filters;
    using System.Web.Mvc;

    public class ProductController : BaseController
    {
        public ProductController(
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

            return View("~/Views/Product/Index.cshtml");
        }
    }
}