using System.Web.Mvc;

namespace AffiliateAdmin.Areas.Portal
{
    public class PortalAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Portal";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.Routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            context.MapRoute(
                name: "PortalUserPanel",
                url: "Portal/UserPanel/{controller}/{action}/{id}",
                defaults: new { id = UrlParameter.Optional },
                namespaces: new[] { "Fanex.Affiliate.Admin.Core.Controllers.UserPanel" }
            );

            context.MapRoute(
                name: "Portal",
                url: "Portal/{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "Fanex.Affiliate.Admin.Core.Controllers", "Fanex.Affiliate.Admin.Core.Controllers.Affiliate",
                    "Fanex.Affiliate.Admin.Core.Controllers.MediaGallery", "Fanex.Affiliate.Admin.Core.Controllers.Player",
                    "Fanex.Affiliate.Admin.Core.Controllers.Domain", "Fanex.Affiliate.Admin.Core.Controllers.Administrator",
                    "Fanex.Affiliate.Admin.Core.Controllers.Report", "Fanex.Affiliate.Admin.Core.Controllers.Operation",
                    "Fanex.Affiliate.Admin.Core.Controllers.DealAssignment", "Fanex.Affiliate.Admin.Core.Controllers.LandingPage",
                    "Fanex.Affiliate.Admin.Core.Controllers.CampaignManagement", "Fanex.Affiliate.Admin.Core.Controllers.LinkGenerator"
                }
            );
        }
    }
}