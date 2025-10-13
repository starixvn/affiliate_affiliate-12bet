using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Filters;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers
{
    public class NotifyController : BaseController
    {

        public NotifyController(
            ISessionService sessionService, 
            ISystemService systemsService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Error()
        {
            return View("~/Views/Notify/Error.cshtml");
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult PageNotFound()
        {
            return View("~/Views/Notify/PageNotFound.cshtml");
        }

        public ActionResult CodeExpired()
        {
            return Json(new
            {
                IsOk = false,
                IsExpired = true
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
