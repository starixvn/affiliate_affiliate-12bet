namespace Fanex.Affiliate.User.Core.Controllers
{
    using CoreService;
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.Filters;
    using Fanex.Affiliate.User.Core.ViewModels;
    using System.Web.Mvc;

    public class PromotionController : BaseController
    {

        public PromotionController(
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
            var viewModel = new ProPageViewModel
            {
                CurrentLanguage = SessionService.CurrentLanguage,
                IsAuthenticated = HttpContext.Request.IsAuthenticated && SessionService.UserSession != null
            };

            return View("~/Views/Promotion/Index.cshtml", viewModel);
        }
    }
}