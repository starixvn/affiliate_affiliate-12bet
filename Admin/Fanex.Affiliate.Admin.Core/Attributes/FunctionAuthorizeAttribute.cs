using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Extensions;
using System;
using System.Net;
using System.Security.Claims;
using System.Security.Principal;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = true, Inherited = true)]
    public class FunctionAuthorizeAttribute : ActionFilterAttribute
    {
        public string FunctionName { get; set; }

        public bool IsHost { get; set; }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var context = filterContext.HttpContext;
            var skipCheckAuthorization = filterContext.ActionDescriptor.IsDefined(typeof(AllowByPassFunctionAuthorizeAttribute), true);

            if (!(skipCheckAuthorization || string.IsNullOrEmpty(FunctionName)))
            {
                var hasPerimission = HasPerimission(filterContext.HttpContext.User);

                if (!hasPerimission)
                {
                    if (context.Request.IsAjaxRequest())
                    {
                        filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                        filterContext.HttpContext.Response.ContentType = "application/json";
                        filterContext.Result = new JsonResult
                        {
                            Data = new { ErrCode = Code.ErrCodeAccessDenied, ErrMsg = "Access Denied." },
                            JsonRequestBehavior = JsonRequestBehavior.AllowGet
                        };
                    }
                    else
                    {
                        context.Response.Redirect("~/Portal/AccessDenied");
                    }
                }
            }

            base.OnActionExecuting(filterContext);
        }

        protected virtual bool HasPerimission(IPrincipal principal)
        {
            if (principal is ClaimsPrincipal claims)
            {
                return HasFuncClaim(claims, FunctionName);
            }

            return false;
        }

        protected bool HasFuncClaim(ClaimsPrincipal claimsPrincipal, string funcName)
        {
            return funcName.MatchWith(Function.AdminRoleMenu) ? claimsPrincipal.HasClaim(funcName) : !IsHost && claimsPrincipal.HasClaim(funcName);
        }
    }
}