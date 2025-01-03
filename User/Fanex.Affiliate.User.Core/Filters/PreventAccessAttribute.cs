using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.Resources;
using System;
using System.Net;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Filters
{
    [AttributeUsage(AttributeTargets.Method, Inherited = false, AllowMultiple = true)]
    public sealed class PreventAccessAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            var context = filterContext.RequestContext.HttpContext;

            context.Response.StatusCode = (int)HttpStatusCode.OK;
            filterContext.Result = new JsonResult
            {
                Data = new ResultInfo
                {
                    IsOk = false,
                    Message = Lang.ErrAuthorized
                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }
    }
}
