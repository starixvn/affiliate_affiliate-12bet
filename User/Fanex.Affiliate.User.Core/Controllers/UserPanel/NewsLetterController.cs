using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Filters;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    [CustomAuthorize]
    public class NewsLetterController : BaseController
    {
        private INewsLetterService Service { get; }

        public NewsLetterController(
            INewsLetterService service,
            ISessionService sessionService,
            ISystemService systemsService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            Service = service;
        }

        public async Task<ActionResult> Index()
        {
            ViewBag.Content = await Service.GetCurrentContent();
            return View("~/Views/UserPanel/NewsLetter/Index.cshtml");
        }

        [AllowAnonymous]
        public async Task<ActionResult> Preview(int id)
        {
            ViewBag.Content = await Service.GetContentById(id);
            return View("~/Views/UserPanel/NewsLetter/Preview.cshtml");
        }
    }
}
