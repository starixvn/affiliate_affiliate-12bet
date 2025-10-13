namespace Fanex.Affiliate.User.Core.Controllers
{
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.CoreService;
    using Filters;
    using System.Web.Mvc;

    [CustomAuthorize]
    public class MainController : BaseController
    {
        public MainController(
            ISessionService sessionService,
            ISystemService systemsService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {

        }

        [HttpGet]
        public ActionResult Index()
        {
            return View("~/Views/UserPanel/Main/index.cshtml");
        }
    }
}