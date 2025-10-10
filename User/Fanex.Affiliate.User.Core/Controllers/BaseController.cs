using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.Extensions;
using ONEbook.UM.AspNetMVC.Filters;

namespace Fanex.Affiliate.User.Core.Controllers
{
    [CheckUMFilter]
    public class BaseController : Controller
    {
        protected BaseController(
            ISessionService sessionService,
            ISystemService systemService,
            IIpLocationService ipLocationService)
        {
            SessionService = sessionService;
            SystemService = systemService;
            IpLocationService = ipLocationService;
        }

        protected ISystemService SystemService { get; }

        protected ISessionService SessionService { get; }

        protected IIpLocationService IpLocationService { get; }

        protected virtual string RouteName => Constants.RouteName.DefaultRoute;

        protected override void Initialize(RequestContext requestContext)
        {
            base.Initialize(requestContext);

            var favoriteLanguage = SystemService.GetFavoriteLanguage();
            var currentCountry = SystemService.GetCountry();
            var countryByIp = IpLocationService.GetCountryFromIp(requestContext.HttpContext.Request.GetClientIP()).CountryShort;

            var sessionLang = SessionService.CurrentLanguage;
            var sessionCountry = SessionService.CurrentCountry;
            var sessionCountryByIp = SessionService.CountryByIp;

            if (favoriteLanguage != sessionLang)
            {
                requestContext.HttpContext.Response.Cookies.Add(new HttpCookie("afffavoritelang", favoriteLanguage) { HttpOnly = true });
                SessionService.CurrentLanguage = favoriteLanguage;
            }

            if (currentCountry != sessionCountry)
            {
                SessionService.CurrentCountry = currentCountry;
            }

            if (countryByIp != sessionCountryByIp)
            {
                SessionService.CountryByIp = countryByIp;
            }

            SystemService.SetCulture(favoriteLanguage);
        }

        protected RedirectToRouteResult RedirectToFixedAction(string actionName, object routeValue)
        {
            var routeDic = new RouteValueDictionary(routeValue)
            {
                { "controller", RouteData.Values["controller"] },
                { "action", actionName }
            };
            var result = RedirectToRoute(RouteName, routeDic);
            return result;
        }

        public RedirectResult RedirectToAbsolutePath(string path)
        {
            if (Uri.IsWellFormedUriString(path, UriKind.Absolute))
            {
                return Redirect(path);
            }

            var absolutePath = VirtualPathUtility.ToAbsolute(path);
            return Redirect(absolutePath);
        }
    }
}
