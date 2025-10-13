namespace Fanex.Affiliate.User.Core.Filters
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using Controllers;
    using CoreService;
    using DTO;
    using Extensions;
    using Resources;
    using Utilities;

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class SkipGeoDomainRedirectAttribute : Attribute
    {
        // This is a marker attribute to skip IP restriction
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class GeoDomainRedirectFilterAttribute : ActionFilterAttribute
    {
        private const string IndexAction = "Index";

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var appSetting = DependencyResolver.Current.GetService<IAppSetting>();
            var ipLocationService = DependencyResolver.Current.GetService<IIpLocationService>();
            var sessionService = DependencyResolver.Current.GetService<ISessionService>();

            var isSkip = filterContext.ActionDescriptor.IsDefined(typeof(SkipGeoDomainRedirectAttribute), inherit: true) 
                         || filterContext.ActionDescriptor.ControllerDescriptor.IsDefined(typeof(SkipGeoDomainRedirectAttribute), inherit: true) 
                         || sessionService.IsInternal;

            if (!isSkip)
            {
                var request = filterContext.HttpContext.Request;
                var countryCode = ipLocationService.GetCountryFromIp(request.GetClientIP()).CountryShort;
                var defaultDomain = appSetting.DefaultDomainSiteByCountry(countryCode);

                if (!IsSameDomain(request, defaultDomain))
                {
                    if (request.IsAjaxRequest())
                    {
                        filterContext.Result = new JsonResult
                        {
                            Data = new ResultInfo
                            {
                                IsOk = false,
                                Message = Lang.NotAllowOnCountry
                            },
                            JsonRequestBehavior = JsonRequestBehavior.AllowGet
                        };
                    }
                    else
                    {
                        RedirectToDefaultDomain(filterContext, defaultDomain);
                    }

                    return;
                }
            }

            base.OnActionExecuting(filterContext);
        }

        private static bool IsSameDomain(HttpRequestBase request, string defaultDomain)
        {
            if (string.IsNullOrEmpty(defaultDomain))
            {
                return true;
            }

            if (request == null || request.Url == null)
            {
                return false;
            }

            var scheme = request.Url.Scheme;
            var host = request.Url.Host;
            var currentBase = $"{scheme}://{host}";

            if (!Uri.TryCreate(defaultDomain, UriKind.Absolute, out var defaultUri) ||
                !Uri.TryCreate(currentBase, UriKind.Absolute, out var currentUri))
            {
                return false;
            }

            return string.Equals(defaultUri.Host, currentUri.Host, StringComparison.OrdinalIgnoreCase);
        }

        private static void RedirectToDefaultDomain(ActionExecutingContext filterContext, string defaultDomain)
        {
            var request = filterContext.HttpContext.Request;
            var controllerName = filterContext.RouteData.Values["controller"]?.ToString();
            var action = filterContext.RouteData.Values["action"]?.ToString();
            var queryString = request.QueryString?.ToString();

            var path = defaultDomain + (action.MatchWith(IndexAction)
                ? $"/{controllerName}"
                : $"/{controllerName}/{action}");

            if (!string.IsNullOrWhiteSpace(queryString))
            {
                path += $"?{queryString}";
            }

            var controller = (BaseController)filterContext.Controller;
            filterContext.Result = controller.RedirectToAbsolutePath(path);
        }
    }
}