namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using Fanex.Affiliate.User.Core.BusinessService;
    using Fanex.Affiliate.User.Core.Constants;
    using Fanex.Affiliate.User.Core.CoreService;
    using Fanex.Affiliate.User.Core.DTO;
    using Fanex.Affiliate.User.Core.DTO.Auth;
    using Fanex.Affiliate.User.Core.DTO.UserPanel.MediaGallery;
    using Fanex.Affiliate.User.Core.Resources;
    using Fanex.Affiliate.User.Core.Utilities;
    using Filters;
    using MetalModels.UserPanel;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using ViewModels.UserPanel.Marketing;

    public sealed class MediaGalleryController : BaseMarketingController
    {
        private readonly IAppSetting _appSetting;

        public MediaGalleryController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemService,
            IMarketingService marketingService
            ) : base(sessionService, systemService, marketingService)
        {
            _appSetting = appSetting;
        }

        [HttpGet]
        [AjaxOnly(PermissionName = ClaimConstant.MediaGallery)]
        public ActionResult Index()
        {
            var userSession = SessionService.UserSession;
            var searchForm = GetSearchFormViewModel(userSession);

            var selectedDomain = searchForm.SelectedDomain;
            var selectedPage = searchForm.MemberSitePageList.FirstOrDefault()?.Value ?? string.Empty;
            var selectedTargetProduct = searchForm.TargetProductList.FirstOrDefault()?.Value ?? string.Empty;

            var bannerParam = new MarketingBannerParam
            {
                AffId = userSession.AffId,
                TargetProduct = selectedTargetProduct,
                SelectedTargetCountry = searchForm.SelectedTargetCountry,
                Language = searchForm.SelectedLanguage,
                AffType = userSession.AffType,
                SelectedDomain = selectedDomain,
                SelectedPage = selectedPage,
                TextLinkTemplate = _appSetting.TextLinkTemplate,
                BannerDomain = GetBannerDomain()
            };

            var viewModel = new MediaGalleryViewModel
            {
                SearchForm = searchForm,
                MarketingDataList = GetBannerList(bannerParam)
            };

            ViewBag.TotalItem = bannerParam.Nrows;

            return View("~/Views/UserPanel/AccountOverview/MediaGallery/Index.cshtml", viewModel);
        }

        [HttpGet]
        [AjaxOnly(PermissionName = ClaimConstant.MediaGallery)]
        public ActionResult GetBanner(MarketingBannerParam bannerParam)
        {
            var userSession = SessionService.UserSession;
            var selectedDomain = GetDomainListByTargetCountry(bannerParam.SelectedTargetCountry, SessionService.IsInternal)
                .FirstOrDefault(d => d.DomainId == bannerParam.SelectedDomainId);

            bannerParam.AffId = userSession.AffId;
            bannerParam.AffType = userSession.AffType;
            bannerParam.SelectedDomain = selectedDomain;
            bannerParam.TextLinkTemplate = _appSetting.TextLinkTemplate;
            bannerParam.BannerDomain = GetBannerDomain();

            var bannerList = GetBannerList(bannerParam);
            ViewBag.TotalItem = bannerParam.Nrows;

            return View("~/Views/UserPanel/AccountOverview/Partial/_BannerList.cshtml", bannerList);
        }

        [HttpGet]
        [AjaxOnly(PermissionName = ClaimConstant.MediaGallery)]
        public ActionResult GetSize(SizeParam param)
        {
            param.AffType = SessionService.UserSession.AffType;

            var sizeList = MarketingService.GetSizeList(param, SessionService.IsInternal);

            return Json(sizeList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [AjaxOnly(PermissionName = ClaimConstant.MediaGallery)]
        [PreventAccess]
        public ActionResult CountNumberOfCopies(CopiedBannerCounterParam param)
        {
            if (SessionService.IsPreventDBModification || SessionService.IsInternal)
            {
                return Json(GetErrorResult(Lang.ErrAuthorized));
            }

            param.AffId = SessionService.UserSession.AffId;
            var result = MarketingService.CountNumberOfCopies(param);

            return Json(result);
        }

        private IEnumerable<Banner> GetBannerList(MarketingBannerParam bannerParam)
        {
            if (bannerParam.SelectedDomain == null || string.IsNullOrEmpty(bannerParam.SelectedPage))
            {
                return new List<Banner>();
            }

            return MarketingService.GetBannerList(bannerParam);
        }

        private SearchFormViewModel GetSearchFormViewModel(UserSession userSession)
        {
            var linkModel = GetLinkFormViewModel();
            var targetProductList = MarketingService.GetTargetProductList(SessionService.IsInternal);
            var sizeList = MarketingService.GetSizeList(new SizeParam { AffType = userSession.AffType, Language = linkModel.SelectedLanguage }, SessionService.IsInternal);

            return new SearchFormViewModel
            {
                SelectedTargetCountry = linkModel.SelectedTargetCountry,
                SelectedLanguage = linkModel.SelectedLanguage,
                SelectedDomain = linkModel.SelectedDomain,
                TargetCountryList = linkModel.TargetCountryList,
                LanguageList = linkModel.LanguageList,
                DomainList = linkModel.DomainList,
                MemberSitePageList = linkModel.MemberSitePageList,
                TargetProductList = targetProductList.Select(i =>
                    new SelectListItem { Value = i.TargetProductId.ToString(), Text = SystemHelper.GetProductText(i.TargetProductName) }),
                SizeList = sizeList.Select(i => new SelectListItem { Value = i.Size, Text = i.Size })
            };
        }

        private string GetBannerDomain()
        {
            var bannerSettingKey = SessionService.UserSession.PreferredLanguage.Replace("-", string.Empty).ToUpperInvariant();

            return _appSetting.GetValue($"BannerDomain{bannerSettingKey}") ?? _appSetting.BannerDomain;
        }
    }
}