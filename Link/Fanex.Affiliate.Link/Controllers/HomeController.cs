using System.Configuration;

namespace Fanex.Affiliate.Link.Controllers
{
    using System;
    using System.Globalization;
    using System.Linq;
    using System.Web.Mvc;
    using Commands;
    using Fanex.Affiliate.Link.Constants;
    using Fanex.Affiliate.Link.Extensions;
    using Helpers;
    using ONEbook.UM.AspNetMVC.Filters;
    using Services.Impl;
    using Services.Interface;

    /// <summary>
    /// Home controller for affiliate link.
    /// </summary>
    [CheckUMFilter]
    public class HomeController : Controller
    {
        private const string LOCAL_ENV = "LOCAL";
        private const string SPECIAL_PAGE_CODE = "12sports";
        private const string OLD_MKT_SIGNUP_PAGE_CODE = "inrsignup";
        private const string NEW_MKT_SIGNUP_PAGE_CODE = "mktsignup";
        private readonly string[] SpecialSubPageCodes = new [] { "cricket", "virtualsports" };

        private static readonly string[] MarketingForCommGroups = ConfigurationManager.AppSettings["MarketingForCommGroups"].ToString().Split(',');
        private static readonly string[] MarketingLandingPages = ConfigurationManager.AppSettings["MarketingLandingPages"].ToString().Split(',');
        private static readonly bool IsRemovePortFromUrl = string.Equals(ConfigurationManager.AppSettings["RemovePortFromUrl"].ToString(), "1", StringComparison.OrdinalIgnoreCase);
        private static readonly bool IsLocal = string.Equals(ConfigurationManager.AppSettings["Environment"].ToString(), LOCAL_ENV, StringComparison.OrdinalIgnoreCase);
        private static readonly bool IsPreventDBModification = string.Equals(ConfigurationManager.AppSettings["IsPreventDBModification"].ToString(), "1", StringComparison.OrdinalIgnoreCase);
        
        #region Services

        private readonly ITrackingSystemService _trackingSystemService;
        private readonly IAffiliateService _affiliateService;

        #endregion Services

        #region Constructor

        public HomeController()
        {
            _trackingSystemService = new TrackingSystemService();
            _affiliateService = new AffiliateService();
        }

        #endregion Constructor

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Error()
        {
            return View();
        }

        [HttpGet]
        public ActionResult PageNotFound()
        {
            return View();
        }

        public ActionResult Link(int affId, string pageCode, string lang)
        {
            var targetCountryCode = _affiliateService.GetTargetCountryCodeByLanguage(lang);

            if (targetCountryCode is null)
            {
                return IvalidLink();
            }

            return InsertAffiliate(affId, pageCode, lang, targetCountryCode);
        }

        public ActionResult CommonLink(int affId, string pageCode, string lang, string targetCountry)
        {
            //Check "{affId}/{pageCodePart1}/{pageCodePart2}/{lang}" case
            if (IsMatching(pageCode, SPECIAL_PAGE_CODE) && SpecialSubPageCodes.Any(s => IsMatching(s, lang)))
            {
                return Link(affId, pageCode: $"{pageCode}/{lang}", lang: targetCountry);
            }

            var targetCountryCode = _affiliateService.GetTargetCountryCodeByLanguage(lang);

            if (targetCountryCode is null || !IsMatching(targetCountry.ToUpperInvariant(), targetCountryCode))
            {
                return IvalidLink();
            }

            return InsertAffiliate(affId, pageCode, lang, targetCountry);
        }

        public ActionResult SpecialPageCodeLink(int affId, string pageCodePart1, string pageCodePart2, string lang, string targetCountry)
        {
            return InsertAffiliate(affId, $"{pageCodePart1}/{pageCodePart2}", lang, targetCountry);
        }

        private ActionResult InsertAffiliate(int affId, string pageCode, string lang, string targetCountry)
        {
            if(IsPreventDBModification)
            {
                ViewBag.Result = "This link does not exist or stop. Please contact administrator!";

                return View("Link");
            }
            
            if (Request.Url != null)
            {
                var affDomain = GetFullAffDomain(Request.Url.ToString(), affId);
                var urlReferrer = Request.UrlReferrer?.AbsoluteUri;
                var domainReferrer = Request.UrlReferrer?.Host;

                if (string.IsNullOrEmpty(urlReferrer) && !string.IsNullOrEmpty(Request["ref"]))
                {
                    urlReferrer = Request["ref"];
                    domainReferrer = Common.GetDomainReferrer(urlReferrer);
                }

                var command = new TrackingSystemCommand
                {
                    AffDomain = affDomain,
                    AffiliateID = affId,
                    PageCode = IsMatching(pageCode, OLD_MKT_SIGNUP_PAGE_CODE) ? NEW_MKT_SIGNUP_PAGE_CODE : pageCode,
                    LanguageCode = lang,
                    TargetCountryCode = targetCountry.ToUpperInvariant(),
                    DeviceType = GetDeviceType(),
                    IP = Request.GetClientIP(),
                    Browser = Request.Browser.Browser,
                    URLReferrer = urlReferrer,
                    DomainReferrer = domainReferrer,
                    OS = Common.GetOsName(Request.UserAgent),
                    Device = Common.GetDeviceName(Request.UserAgent),
                    BrowserVersion = Request.Browser.Version,
                    BrowserResolution = Request.Browser.ScreenPixelsWidth + "x" + Request.Browser.ScreenPixelsHeight,
                    BrowserLanguage = string.IsNullOrEmpty(Request.ServerVariables["HTTP_ACCEPT_LANGUAGE"])
                                              ? string.Empty
                                              : Request.ServerVariables["HTTP_ACCEPT_LANGUAGE"],
                    UserAgent = Request.UserAgent,
                    Country = Common.GetCountry(),

                };

                HandleFakeSpecificDomainOnLocal(command);

                var redirectUrl = _trackingSystemService.InsertStatistic(command);

                if (!string.IsNullOrEmpty(redirectUrl))
                {
                    var isMarketingLandingPage = MarketingLandingPages.Any(l => IsMatching(l, pageCode));

                    if (!isMarketingLandingPage)
                    {
                        return Redirect(redirectUrl);
                    }

                    if (isMarketingLandingPage && IsValidAffMarketing(affId))
                    {
                        return Redirect(redirectUrl);
                    }
                }
            }

            return IvalidLink();
        }

        private ActionResult IvalidLink()
        {
            ViewBag.Result = "This link does not exists. Please contact administrator!";

            return View("Link");
        }

        private string GetFullAffDomain(string url, int affId)
        {
            if (IsRemovePortFromUrl)
            {
                var uri = new Uri(url);
                url = url.Replace(":" + uri.Port, string.Empty);
            }

            const string slashString = "://";
            var pos1 = url.IndexOf(slashString, 0, StringComparison.OrdinalIgnoreCase);
            var pos2 = url.IndexOf("/" + affId.ToString(CultureInfo.InvariantCulture), 0, StringComparison.OrdinalIgnoreCase);

            return url.Substring(pos1 + slashString.Length, pos2 - (pos1 + slashString.Length));
        }

        private byte GetDeviceType()
        {
            return (byte)(Common.IsMobile() ? 1 : 0);
        }

        private void HandleFakeSpecificDomainOnLocal(TrackingSystemCommand param)
        {
            if(IsLocal)
            {
                var affId = param.AffiliateID.ToString();

                if (SpecificDomain.FakeSpecificDomainByAffOnLocal.TryGetValue(affId, out string fakeInfo))
                {
                    var infos = fakeInfo.Split(',');
                    var fakeDomain = infos[0];

                    if(param.AffDomain.Contains(fakeDomain))
                    {
                        var realDomain = infos[1];
                        param.AffDomain = param.AffDomain.Replace(fakeDomain, realDomain);
                    }    
                }
            }
        }
        
        private bool IsValidAffMarketing(int affId)
        {
            var commGroup = _affiliateService.GetCommGroupByAffId(affId);

            return MarketingForCommGroups.Any(c => IsMatching(c, commGroup));
        }

        private bool IsMatching(string value, string strToMatch)
        {
            return string.Equals(value, strToMatch, StringComparison.OrdinalIgnoreCase);
        }
    }
}