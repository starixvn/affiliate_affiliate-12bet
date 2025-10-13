using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Filters;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    [CustomAuthorize]
    public class OffersForMeController : BaseController
    {
        private readonly IOfferService _offerService;

        public OffersForMeController(
            IOfferService offerService,
            ISessionService sessionService,
            ISystemService systemsService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _offerService = offerService;
        }

        public async Task<ActionResult> Index()
        {
            ViewBag.Content = await _offerService.GetOfferById(SessionService.UserSession.OfferPageId);
            return View("~/Views/UserPanel/OffersForMe/Index.cshtml");
        }

        [AllowAnonymous]
        public async Task<ActionResult> Preview(int id)
        {
            ViewBag.Content = await _offerService.GetOfferById(id);
            return View("~/Views/UserPanel/OffersForMe/Preview.cshtml");
        }
    }
}
