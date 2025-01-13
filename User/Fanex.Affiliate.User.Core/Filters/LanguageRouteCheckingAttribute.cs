using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Controllers;
using System;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class LanguageRouteCheckingAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var preferedUrlLang = filterContext.RouteData.Values["lang"]?.ToString();
            if (!filterContext.HttpContext.Request.IsAjaxRequest() &&
                (string.IsNullOrEmpty(preferedUrlLang) || Regex.IsMatch(filterContext.HttpContext.Request.RawUrl, "/((\\w{2}|hien|hitg)/?)?$")))
            {
                var systemService = DependencyResolver.Current.GetService<ISystemService>();
                var favoriteShortedLanguage = systemService.GetFavoriteShortedLanguage();

                var queryString = filterContext.HttpContext.Request.Url?.Query.TrimStart('?');
                var path = $"~/{favoriteShortedLanguage}/{filterContext.RouteData.Values["controller"]}";

                if (!string.IsNullOrWhiteSpace(queryString))
                {
                    path += $"?{queryString}";
                }

                var controller = (BaseController)filterContext.Controller;
                filterContext.Result = controller.RedirectToAbsolutePath(path);
            }
        }
    }
}
