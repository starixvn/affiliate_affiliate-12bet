using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Filters;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers
{
    public class TermAndConditionController : BaseController
    {

        public TermAndConditionController(
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

            return View("~/Views/TermAndCondition/Index.cshtml");
        }

        [HttpGet]
        public ActionResult Popup()
        {
            return View("~/Views/TermAndCondition/Popup.cshtml", model: SessionService.CurrentLanguage);
        }
    }
}