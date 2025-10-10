using Fanex.Affiliate.User.Core.Filters;
using System.Configuration;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Site
{
    public static class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            var env = ConfigurationManager.AppSettings["Environment"];
            if (env != "LOCAL")
            {
                filters.Add(new GlobalErrorHandlerAttribute());
            }

            filters.Add(new JsonHandlerAttribute());
            filters.Add(new GeoDomainRedirectFilterAttribute());
        }
    }
}
