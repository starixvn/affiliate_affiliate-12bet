namespace Fanex.Affiliate.User.Core.Controllers.UserPanel
{
    using System.Linq;
    using System.Web.Mvc;
    using System.Web.Mvc.Html;
    using BusinessService;
    using CoreService;
    using Enum;
    using Filters;
    using Resources;
    using Utilities;
    using ViewModels.UserPanel.Marketing;

    public class MediaGalleryController : BaseMarketingController
    {
        private readonly IAccountService _accountService;
        public MediaGalleryController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemsService,
            IMarketingService marketingService,
            IAccountService accountService,
            IIpLocationService ipLocationService)
            : base(sessionService, appSetting, systemsService, marketingService, ipLocationService)
        {
            _accountService = accountService;
        }

        [HttpGet]
        [AjaxOnly]
        public ActionResult Index()
        {
            var searchFormVM = GetSearchFormViewModel();
            ViewBag.SelectedLang = SessionService.UserSession.PreferredLanguage;

            return View("~/Views/UserPanel/AccountOverview/MediaGallery/Index.cshtml", searchFormVM);
        }

        private MediaGallerySearchFormViewModel GetSearchFormViewModel()
        {
            var userSession = SessionService.UserSession;
            var affId = userSession.AffId;
            var isInternal = SessionService.IsInternal;

            var targetCountryCode = _accountService.GetAccountInfo(affId)?.TargetCountryCode;

            var commonLinkForm = GetLinkFormViewModel(targetCountryCode, true);

            if (!_accountService.GetGeneralAffInfo(affId).IsMaxSubLevel)
            {
                commonLinkForm.LinkTypes = commonLinkForm.LinkTypes.Append(new SelectListItem
                {
                    Value = AffiliateLinkType.SubAffiliateLink.ToString(),
                    Text = Lang.SubAffiliateLink
                });
            }

            var currencyList = MarketingService.GetCurrencyList(isInternal)
                .Select(i => new SelectListItem
                {
                    Value = i.Currency,
                    Text = Lang.ResourceManager.GetString(i.Currency.Trim()) ?? i.Currency
                });

            return new MediaGallerySearchFormViewModel
            {
                CategoryList = commonLinkForm.CategoryList,
                Channels = MarketingService.GetChannels(affId),
                CurrencyList = currencyList,
                DeviceList = EnumHelper.GetSelectList(typeof(DeviceType)),
                SizeList = commonLinkForm.SizeList,
                LinkTypes = commonLinkForm.LinkTypes,
                TargetCountries = commonLinkForm.TargetCountries,
                Languages = commonLinkForm.Languages,
                Domains = commonLinkForm.Domains,
                SitePages = commonLinkForm.SitePages
            };
        }
    }
}