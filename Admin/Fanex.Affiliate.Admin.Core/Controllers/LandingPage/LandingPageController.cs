using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.LandingPage;
using Fanex.Affiliate.Admin.Core.ViewModels.LandingPage;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Controllers.LandingPage
{
    [FunctionAuthorize(FunctionName = Function.PageManagement)]
    public class LandingPageController : ReadOnlySessionBaseController
    {
        private readonly IAppSetting _appSetting;
        private readonly ILandingPageService _landingPageService;

        public LandingPageController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ILandingPageService landingPageService) : base(sessionService)
        {
            _appSetting = appSetting;
            _landingPageService = landingPageService;
        }

        [HttpGet]
        public ActionResult Index()
        {
            var model = new PageManagementViewModel
            {
                LandingPageUrl = _appSetting.LandingPageUrl,
                CampaignList = _landingPageService.GetCampaignInfoList(),
                AllLanguagesInSystem = _landingPageService.GetAllLanguagesInSystem(),
                DealList = _landingPageService.GetLandingPageDealList(),
                TargetCountryList = _landingPageService.GetTargetCountryList(),
                StatusList = _landingPageService.GetLandingPageStatusList(),
            };

            return View(model);
        }
    }
}