using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.LandingPage;
using Fanex.Affiliate.Admin.Core.ViewModels.LinkGenerator;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers.LinkGenerator
{
    public class LinkGeneratorController : ReadOnlySessionBaseController
    {
        private readonly ILinkGeneratorService _linkGeneratorService;

        public LinkGeneratorController(
            ISessionService sessionService,
            ILinkGeneratorService linkGeneratorService) : base(sessionService)
        {
            _linkGeneratorService = linkGeneratorService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new LinkGeneratorViewModel
            {
                AllLanguagesInSystem = _linkGeneratorService.GetAllLanguagesInSystem(),
                TargetCountryList = _linkGeneratorService.GetTargetCountryList(),
            };

            return View(model);
        }
    }
}
