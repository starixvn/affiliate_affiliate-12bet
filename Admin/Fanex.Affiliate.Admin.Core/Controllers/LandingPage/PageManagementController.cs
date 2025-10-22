using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.MetaModels.LandingPage;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.LandingPage;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers.LandingPage
{
    [FunctionAuthorize(FunctionName = Function.PageManagement)]
    public class PageManagementController : ReadOnlySessionBaseController
    {
        private readonly IPageManagementService _pageManagementService;

        public PageManagementController(
            ISessionService sessionService,
            IPageManagementService pageManagementService) : base(sessionService)
        {
            _pageManagementService = pageManagementService;
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetPageManagementList(PageManagementParam param)
        {
            return GenerateJsonNetResult(_pageManagementService.GetPageManagementList(param));
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.PageManagement, IsHost = true)]
        public ActionResult ToggleLandingPageStatus(UpdateLandingPageStatusParam param)
        {
            if (ModelState.IsValid)
            {
                AssignUserInfoParam(param);

                return GenerateJsonNetResult(_pageManagementService.ToggleLandingPageStatus(param));
            }

            return GenerateModelStateErrResult();
        }
    }
}