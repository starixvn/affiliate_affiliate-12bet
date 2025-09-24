using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.MetaModels.LinkGenerator;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.LandingPage;
using Fanex.Affiliate.Admin.Core.Services.LinkGenerator;
using Fanex.Affiliate.Admin.Core.ViewModels.LinkGenerator;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers.LinkGenerator
{
    [FunctionAuthorize(FunctionName = Function.LinkGenerator)]
    public class LinkManagementController : ReadOnlySessionBaseController
    {
        private readonly ILinkManagementService _LinkManagementService;
        private readonly ILinkGeneratorService _linkGeneratorService;

        public LinkManagementController(
            ISessionService sessionService,
            ILinkManagementService LinkManagementService,
            ILinkGeneratorService linkGeneratorService) : base(sessionService)
        {
            _LinkManagementService = LinkManagementService;
            _linkGeneratorService = linkGeneratorService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new LinkManagementViewModel
            {
                TargetCountryList = _linkGeneratorService.GetTargetCountryList(),
            };

            return View("~/Areas/Portal/Views/LinkGenerator/LinkManagement.cshtml", model);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetLinkManagementList(LinkManagementParam param)
        {
            return GenerateJsonNetResult(_LinkManagementService.GetLinkManagementList(param));
        }
    }
}