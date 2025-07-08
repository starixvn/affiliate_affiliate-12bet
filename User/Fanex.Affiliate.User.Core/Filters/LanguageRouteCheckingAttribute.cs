using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Controllers;
using Fanex.Affiliate.User.Core.Extensions;
using Fanex.Affiliate.User.Core.Utilities;
using System;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true)]
    public sealed class LanguageRouteCheckingAttribute : ActionFilterAttribute
    {
        private const string IndexAction = "Index";

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var preferedUrlLang = filterContext.RouteData.Values["lang"]?.ToString();
            if (!filterContext.HttpContext.Request.IsAjaxRequest() &&
                (string.IsNullOrEmpty(preferedUrlLang) || RegexHelper.IsMatch(filterContext.HttpContext.Request.RawUrl, "/((\\w{2}|hien|hitg|phen)/?)?$", RegexOptions.IgnoreCase)))
            {
                var systemService = DependencyResolver.Current.GetService<ISystemService>();
                var favoriteShortedLanguage = systemService.GetFavoriteShortedLanguage();

                var controllerName = filterContext.RouteData.Values["controller"].ToString();
                var action = filterContext.RouteData.Values["action"].ToString();
                var queryString = filterContext.HttpContext.Request?.QueryString.ToString();

                var path = action.MatchWith(IndexAction) ?
                            $"~/{favoriteShortedLanguage}/{controllerName}" :
                            $"~/{favoriteShortedLanguage}/{controllerName}/{filterContext.RouteData.Values["action"]}";

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
