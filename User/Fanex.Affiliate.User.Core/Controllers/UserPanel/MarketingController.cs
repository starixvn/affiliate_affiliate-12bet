namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using System;
    using System.Collections.Generic;
    using System.Drawing;
    using System.Linq;
    using System.Web.Mvc;
    using BusinessService;
    using Constants;
    using CoreService;
    using DTO;
    using DTO.UserPanel;
    using Enum;
    using Extensions;
    using Filters;
    using MetalModels;
    using MetalModels.UserPanel;
    using Resources;
    using Utilities;
    using ViewModels.UserPanel.Marketing;

    public class MarketingController : BaseMarketingController
    {
        private const string CHANNEL_NAME_REGEX = "^[a-zA-Z0-9]+$";

        private readonly IQrCodeGeneratorService _qrCodeGeneratorService;
        private readonly IAppSetting _appSetting;
        private readonly IFileSystem _fileSystem;

        public MarketingController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemsService,
            IMarketingService marketingService,
            IQrCodeGeneratorService qrCodeGeneratorService,
            IFileSystem fileSystem,
            IIpLocationService ipLocationService) 
            : base(sessionService, appSetting, systemsService, marketingService, ipLocationService)
        {
            _appSetting = appSetting;
            _qrCodeGeneratorService = qrCodeGeneratorService;
            _fileSystem = fileSystem;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult GetSubCategory(string category, AffiliateLinkType linkType)
        {
            var subCategoryList = MarketingService.GetCategoryList(true, linkType, SessionService.IsInternal)
                .Where(c => c.Category.MatchWith(category) && !string.IsNullOrEmpty(c.SubCategory));
            var newSub = subCategoryList.Select(i => new SelectListItem
            {
                Value = i.SubCategory,
                Text = Lang.ResourceManager.GetString(RegexHelper.Replace(i.SubCategory, @"\s+", "")) ?? i.SubCategory
            });

            return Json(newSub, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult GetSize(SizeParam param)
        {
            param.AffType = SessionService.UserSession.AffType;
            var sizeList = MarketingService.GetSizeList(param, SessionService.IsInternal);

            return Json(sizeList, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult GetLinkTo(LinkToParam param)
        {
            var selectedDomain = GetDomain(param.SelectedDomainId, param.TargetCountryCode, param.LinkType);
            var pageList = MarketingService.GetLandingPageList(new LandingPageParam
            {
                AffId = SessionService.UserSession.AffId,
                IsMobile = selectedDomain.IsMobile,
                IsInternal = SessionService.IsInternal,
                LinkType = param.LinkType,
                TargetCountryCode = param.TargetCountryCode
            });

            return Json(SystemHelper.GetPageList(pageList), JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult GetBanner(MarketingBannerParam bannerParam)
        {
            var userSession = SessionService.UserSession;
            var selectedDomain = GetDomain(bannerParam.SelectedDomainId, bannerParam.SelectedTargetCountry, bannerParam.TargetId);

            var bannerSettingKey = userSession.PreferredLanguage.Replace("-", string.Empty).ToUpperInvariant();

            bannerParam.AffId = userSession.AffId;
            bannerParam.AffCode = userSession.AffCode;
            bannerParam.AffType = userSession.AffType;
            bannerParam.SelectedDomain = selectedDomain;
            bannerParam.TextLinkTemplate = MarketingService.GetTextLinkTemplate(bannerParam.TargetId);
            bannerParam.BannerDomain = AppSetting.GetValue($"BannerDomain{bannerSettingKey}") ?? AppSetting.BannerDomain;

            var bannerList = GetBannerList(bannerParam);
            ViewBag.TotalItem = bannerParam.NRows;

            return View("~/Views/UserPanel/AccountOverview/Partial/_BannerList.cshtml", bannerList);
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult RenderQrCodePage(QrCodeParam param)
        {
            IDictionary<string, QrCodeLinkModel> result = new Dictionary<string, QrCodeLinkModel>();

            if (param.SelectedDomainId != null)
            {
                result = GenerateQrCodeViewModel(param);
                MarketingService.TrackingAffMarketingLink(SessionService.UserSession.AffId, result, param);
            }

            ViewBag.SelectedTargetCountry = param.SelectedTargetCountry;
            ViewBag.SelectedDomainId = param.SelectedDomainId;
            ViewBag.SelectedPage = param.SelectedPage;
            ViewBag.SelectedLinkType = param.SelectedLinkType;
            ViewBag.SelectedChannel = param.SelectedChannel;
            ViewBag.Language = param.SelectedLanguage;

            return View("~/Views/UserPanel/AccountOverview/Partial/_GeneratedQrCode.cshtml", result.Values);
        }

        [HttpGet]
        public ActionResult DownloadQrCode(QrCodeParam param)
        {
            var qrCodes = GenerateQrCodeViewModel(param, false);
            if (qrCodes.Count == 0)
            {
                return HttpNotFound();
            }
            var qrCode = qrCodes.First();
            var imageFile = Convert.FromBase64String(qrCode.Value.QrCode);

            return File(imageFile, "image/png", $"{param.SelectedLanguage}.png");
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult AddChannel(string channelName)
        {
            if (!string.IsNullOrEmpty(channelName))
            {
                var channelTrim = channelName.Trim();
                if (channelTrim.Length > Number.Twenty)
                {
                    return Json(new ResultInfo
                    {
                        IsOk = false,
                        Message = Error.NameToLong20
                    });
                }

                if (RegexHelper.IsMatch(channelTrim, CHANNEL_NAME_REGEX))
                {
                    var userId = SessionService.UserSession.AffId;

                    return Json(MarketingService.AddMarketingChannel(userId, channelTrim));
                }
            }

            return Json(new ResultInfo
            {
                IsOk = false,
                Message = Error.InvalidChannelName
            });
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult GetChannels()
        {
            var userId = SessionService.UserSession.AffId;
            return Json(MarketingService.GetChannels(userId));
        }

        [HttpPost]
        [AjaxOnly]
        public ActionResult ToggleMarketingLink(MarketingLinkViewModel model)
        {
            var userId = SessionService.UserSession.AffId;
            var param = new MarketingLinkParam
            {
                AffId = userId,
                AffMediaLink = model.AffRefLink,
                ChannelCode = model.ChannelCode,
                LanguageCode = model.LanguageCode,
                IsOn = model.IsOn
            };
            var result = MarketingService.ToggleMarketingLink(param);

            return Json(result);
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult RenderUsingMarketLinkPage()
        {
            var userId = SessionService.UserSession.AffId;

            return View("~/Views/UserPanel/AccountOverview/Partial/_ChannelLinkStatistic.cshtml", MarketingService.GetUsingMarketingLinks(userId));
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult GetChangedFilters(MarketingFilterParam param)
        {
            var changedForm = GetChangedFilter(param);

            return Json( new
            {
                sizeList = changedForm.SizeList,
                domainList = changedForm.Domains,
                languageList = changedForm.Languages,
                pageList = changedForm.SitePages,
                categoryList = changedForm.CategoryList
            }, JsonRequestBehavior.AllowGet);
        }

        private IEnumerable<MarketingItem> GetBannerList(MarketingBannerParam bannerParam)
        {
            if (bannerParam.SelectedDomain == null)
            {
                return new List<MarketingItem>();
            }

            return MarketingService.GetBannerList(bannerParam);
        }

        private IDictionary<string, QrCodeLinkModel> GenerateQrCodeViewModel(QrCodeParam param, bool includePrefix = true)
        {
            var selectedLInkType = param.SelectedLinkType;

            var linkList = selectedLInkType == AffiliateLinkType.AffiliateLink
                ? GetLinkForMemberList(param)
                : GetLinkForSubAffList(param);

            return GetQrCodes(linkList, includePrefix);
        }

        private IDictionary<string, QrCodeLinkModel> GetQrCodes(IDictionary<string, LanguageLinkViewModel> txtLinkList, bool includePrefix)
        {
            var qrCodeLinks = txtLinkList.Select(link => GetQrCodeParam(link, includePrefix));
            return qrCodeLinks.ToDictionary(itm => itm.DisplayName);
        }

        private QrCodeLinkModel GetQrCodeParam(KeyValuePair<string, LanguageLinkViewModel> link, bool includePrefix)
        {
            var language = link.Value.Language;
            var languageCode = language.Code;
            var textLink = link.Value.Link;

            using (var icon = GetQrCodeIcon(languageCode))
            {
                var qrCode = _qrCodeGeneratorService.GenerateBase64QrCode(textLink, icon, includePrefix);

                return new QrCodeLinkModel
                {
                    Language = language,
                    Link = textLink,
                    QrCode = qrCode,
                    DisplayName = link.Key
                };
            }
        }

        private Image GetQrCodeIcon(string selectedLanguage = SystemLanguage.DefaultLanguageCode)
        {
            var qrIconFileName = string.Format(_appSetting.QrCodeIconPathTemplate, selectedLanguage);
            var defaultQrIconFileName = string.Format(_appSetting.QrCodeIconPathTemplate, SystemLanguage.DefaultLanguageCode);

            var path = HttpContext.Server.MapPath($"~/www/build/styles/Images/{qrIconFileName}");
            var defaultPath = HttpContext.Server.MapPath($"~/www/build/styles/Images/{defaultQrIconFileName}");

            var iconPath = _fileSystem.Exists(path) ? path : defaultPath;
            return _qrCodeGeneratorService.GetImage(iconPath);
        }
    }
}