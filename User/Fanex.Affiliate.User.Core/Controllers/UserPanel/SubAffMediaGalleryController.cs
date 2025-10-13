using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Utilities;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    public class SubAffMediaGalleryController : BaseMarketingController
    {
        public SubAffMediaGalleryController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemsService,
            IMarketingService marketingService,
            IIpLocationService ipLocationService)
            : base(sessionService, appSetting, systemsService, marketingService, ipLocationService)
        {
        }

        public ActionResult Index()
        {
            return RedirectToRoute("UserPanel", new { controller = "MediaGallery", isTargetToMemberSite = false });
        }
    }
}