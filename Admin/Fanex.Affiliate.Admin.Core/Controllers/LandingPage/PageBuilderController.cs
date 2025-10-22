using Fanex.Affiliate.Admin.Core.Attributes;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Services.Common;
using Fanex.Affiliate.Admin.Core.Services.LandingPage;
using Fanex.Affiliate.Admin.Core.ViewModels.LandingPage;
using System.Web.Mvc;
using Fanex.Affiliate.Admin.Core.MetaModels.LandingPage;
using Fanex.Affiliate.Admin.Core.Configurations;
using System.Collections.Generic;
using Fanex.Affiliate.Admin.Core.DTO.LandingPage;

namespace Fanex.Affiliate.Admin.Core.Controllers.LandingPage
{
    [FunctionAuthorize(FunctionName = Function.PageManagement)]
    [AllowLandingPageFrame]
    public class PageBuilderController : ReadOnlySessionBaseController
    {
        private readonly IAppSetting _appSetting;
        private readonly ILandingPageService _landingPageService;
        private readonly IPageBuilderService _pageBuilderService;

        public PageBuilderController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ILandingPageService landingPageService,
            IPageBuilderService pageBuilderService) : base(sessionService)
        {
            _appSetting = appSetting;
            _landingPageService = landingPageService;
            _pageBuilderService = pageBuilderService;
        }

        [HttpGet]
        public ActionResult Index(int? pageId, bool isClone = false)
        {
            PageBuilderDetail pageBuilderDetail = null;
            if(pageId.HasValue)
            {
                pageBuilderDetail = _pageBuilderService.GetPageBuilderDetail(pageId.Value);
                if(isClone)
                {
                    pageBuilderDetail.PageId = 0;
                    pageBuilderDetail.PageName = string.Empty;
                    pageBuilderDetail.PageCode = string.Empty;
                }
            }

            var model = new PageBuilderViewModel
            {
                LandingPageUrl = _appSetting.LandingPageUrl,
                BannerRootUrl = _appSetting.BannerRootUrl,
                CampaignList = _landingPageService.GetCampaignInfoList(),
                AllLanguagesInSystem = _landingPageService.GetAllLanguagesInSystem(),
                DealList = _landingPageService.GetLandingPageDealList(),
                TargetCountryList = _landingPageService.GetTargetCountryList(),
                StatusList = _landingPageService.GetLandingPageStatusList(),
                ModuleList = _landingPageService.GetModuleList(),
                PageBuilderDetail = pageBuilderDetail
            };

            return View("~/Areas/Portal/Views/LandingPage/PageBuilder.cshtml", model);
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetMediaSources(MediaSourceParam param)
        {
             return GenerateJsonNetResult(_pageBuilderService.GetMediaSources(param));
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetNormalDealList()
        {
            return GenerateJsonNetResult(_landingPageService.GetNormalDealList());
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        public ActionResult GetCampaignInfoList()
        {
            return GenerateJsonNetResult(_landingPageService.GetCampaignInfoList());
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.PageManagement, IsHost = true)]
        public ActionResult InsertLandingPageDeal(InsertLandingPageDealParam param)
        {
            if (ModelState.IsValid)
            {
                AssignUserInfoParam(param);
                return GenerateJsonNetResult(_pageBuilderService.InsertLandingPageDeal(param));
            }
            return GenerateModelStateErrResult();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.AllCampaigns, IsHost = true)]
        public ActionResult InsertLandingPageCampaign(InsertLandingPageCampaignParam param)
        {
            if (ModelState.IsValid)
            {
                AssignUserInfoParam(param);
                param.CampaignName = param.CampaignName.Trim();
                param.Description = param.Description?.Trim();

                return GenerateJsonNetResult(_pageBuilderService.InsertLandingPageCampaign(param));
            }
            return GenerateModelStateErrResult();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.PageManagement, IsHost = true)]
        public ActionResult InsertPageBuilder(InsertUpdatePageBuilderParam param)
        {
            if (ModelState.IsValid)
            {
                var encodeParam = EncodePageBuilderParam(param);
                AssignUserInfoParam(encodeParam);
                return GenerateJsonNetResult(_pageBuilderService.InsertPageBuilder(encodeParam));
            }
            return GenerateModelStateErrResult();
        }

        [HttpPost]
        [ValidateAntiForgeryHeader]
        [FunctionAuthorize(FunctionName = Function.PageManagement, IsHost = true)]
        public ActionResult UpdatePageBuilder(InsertUpdatePageBuilderParam param)
        {
            if (ModelState.IsValid && param.PageId > 0)
            {
                var encodeParam = EncodePageBuilderParam(param);
                AssignUserInfoParam(encodeParam);
                return GenerateJsonNetResult(_pageBuilderService.UpdatePageBuilder(encodeParam));
            }
            return GenerateModelStateErrResult();
        }

        private InsertUpdatePageBuilderParam EncodePageBuilderParam(InsertUpdatePageBuilderParam param)
        {
            return new InsertUpdatePageBuilderParam
            {
                PageId = param.PageId,
                CampaignId = param.CampaignId,
                PageName = param.PageName.Trim(),
                PageCode = param.PageCode.Trim(),
                DealIds = Server.HtmlEncode(param.DealIds),
                StatusId = param.StatusId,
                TargetCountryCode = Server.HtmlEncode(param.TargetCountryCode),
                LanguageCode = Server.HtmlEncode(param.LanguageCode),
                ModuleComponentsSetting = EncodeModuleComponents(param.ModuleComponentsSetting),
                IsPreview = param.IsPreview
            };
        }

        private IList<ModuleComponentItem> EncodeModuleComponents(IList<ModuleComponentItem> componentStructure)
        {
            foreach (var item in componentStructure)
            {
                if (!string.IsNullOrEmpty(item.ExtraInfo))
                {
                    item.ExtraInfo = Server.HtmlEncode(item.ExtraInfo);
                }
            }
            
            return componentStructure;
        }
    }
}
