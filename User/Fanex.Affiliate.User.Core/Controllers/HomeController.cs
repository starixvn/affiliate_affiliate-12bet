using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Extensions;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers
{
    public class HomeController : BaseController
    {
        private readonly IAppSetting _appSetting;

        public HomeController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService languageService) : base(sessionService, languageService)

        {
            _appSetting = appSetting;
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index(bool isShowLogin = false)
        {
            var isAuthenticated = Request.IsAuthenticated && SessionService.UserSession != null;

            var viewModel = new HomeViewModel
            {
                IsAuthenticated = isAuthenticated,
                Language = SessionService.CurrentLanguage,
                SignUpLink = isAuthenticated ? Url.RenderLanguageContent("~/UserPanel/Main/#AccountOverView") : Url.RenderLanguageContent("~/SignUp"),
                BannerLink = isAuthenticated ? Url.RenderLanguageContent("~/UserPanel/Main/#MediaGallery") : "javascript:;",
                Promotion12BetLink = GetPromotionLink()
            };

            ViewBag.IsShowLogin = isShowLogin && !isAuthenticated;

            return View(viewModel);
        }

        private string GetPromotionLink()
        {
            var segments = Request.Url.Host.Split('.');
            var domainName = segments.Length > 1 ? segments[segments.Length - 2] : string.Empty;

            return string.Format(_appSetting.Promotion12BetLink, domainName).Replace("..", ".");
        }
    }
}