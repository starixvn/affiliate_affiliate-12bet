namespace Fanex.Affiliate.User.Core.BusinessService
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq;
    using System.Threading;
    using System.Web;
    using Constants;
    using CoreService;
    using Criterias;
    using Data.Repository;
    using DTO;
    using DTO.Systems;
    using DTO.UserPanel;
    using Extensions;

    public class SystemService : BaseDynamicService, ISystemService
    {
        private const string LANGUAGE_COOKIE_KEY = "afffavoritelang";
        private const string COUNTRY_COOKIE_KEY = "12b_country";
        private const string COUNTRY_IP_COOKIE_KEY = "12b_ipCountry";

        private readonly ISessionService _sessionService;
        private readonly IMemoryCacheService _cacheService;
        private readonly IIpLocationService _ipLocationService;

        public SystemService(
            IDynamicRepository dynamicRepository,
            ISessionService sessionService,
            IMemoryCacheService cacheService,
            IIpLocationService ipLocationService) : base(dynamicRepository)
        {
            _sessionService = sessionService;
            _cacheService = cacheService;
            _ipLocationService = ipLocationService;
        }

        private static string GetShortedCodeFromRoute()
        {
            return HttpContext.Current.Request.RequestContext.RouteData.Values["lang"]?.ToString();
        }

        public string GetFavoriteLanguage()
        {
            var preferredShortedCode = GetShortedCodeFromRoute();
            var preferredLang = SystemLanguage.SupportedFavoriteLanguages
                .FirstOrDefault(i => string.Equals(i.Key, preferredShortedCode, StringComparison.OrdinalIgnoreCase))
                .Value;

            if (IsValid(preferredLang))
            {
                return preferredLang;
            }

            var langCookie = HttpContext.Current.Request.Cookies[LANGUAGE_COOKIE_KEY]?.Value;
            return IsValid(langCookie) ? langCookie : GetLanguageByCountry();
        }

        private string GetLanguageByCountry()
        {
            var countryCode = GetCountry();
            if (string.IsNullOrWhiteSpace(countryCode))
            {
                return null;
            }

            return GetSystemTargetCountries()
                       .FirstOrDefault(c => c.TargetCountryCode == countryCode)
                       ?.Code
                   ?? SystemLanguage.DefaultCountryCode;
        }

        public string GetFavoriteShortedLanguage()
        {
            // Get shorted code by route
            var preferredUrlLang = GetShortedCodeFromRoute();
            var shortedCodeByRoute = SystemLanguage.GetCurrentShortedLanguage(preferredUrlLang);
            if (!string.IsNullOrWhiteSpace(shortedCodeByRoute))
            {
                return shortedCodeByRoute;
            }

            // Get shorted code by cookie
            var langCookie = HttpContext.Current.Request.Cookies[LANGUAGE_COOKIE_KEY]?.Value;
            if (IsValid(langCookie))
            {
                var countryCookie = GetCountryByCookie();
                var langByCountry = GetLanguageByTargetCountry(countryCookie);
                var selectedLang = langByCountry.FirstOrDefault(l => l.Code == langCookie);

                if (selectedLang != null)
                {
                    return selectedLang.ShortedCode;
                }
            }

            // Get shorted code by country IP
            var countryByIp = GetCountryByIp();
            var langShortedCode = GetLanguageByTargetCountry(countryByIp).FirstOrDefault()?.ShortedCode;

            return langShortedCode;
        }

        public string GetCountry()
        {
            var countryByRoute = GetCountryByRoute();
            if (!string.IsNullOrWhiteSpace(countryByRoute))
            {
                return countryByRoute;
            }

            var countryByCookie = GetCountryByCookie();
            if (!string.IsNullOrWhiteSpace(countryByCookie))
            {
                return countryByCookie;
            }

            return GetCountryByIp();
        }

        private string GetCountryByRoute()
        {
            var languageShortedCode = GetShortedCodeFromRoute();
            if (string.IsNullOrWhiteSpace(languageShortedCode) || !SystemLanguage.SupportedFavoriteLanguages.ContainsKey(languageShortedCode))
            {
                return string.Empty;
            }

            var match = GetTargetCountryLanguages()
                .FirstOrDefault(dic => dic.Value.Any(l => l.ShortedCode == languageShortedCode));

            if (!string.IsNullOrWhiteSpace(match.Key))
            {
                SetCountryCookie(match.Key, COUNTRY_COOKIE_KEY);
                return match.Key;
            }

            return string.Empty;
        }

        private static string GetCountryByCookie()
        {
            var request = HttpContext.Current.Request;
            var country = request.Cookies[COUNTRY_COOKIE_KEY]?.Value;
            if (!string.IsNullOrWhiteSpace(country))
            {
                return country;
            }

            return string.Empty;
        }

        private string GetCountryByIp()
        {
            var request = HttpContext.Current.Request;
            var countryInfo = _ipLocationService.GetCountryFromIp(request.GetClientIP());
            var country = countryInfo?.CountryShort;
            SetCountryCookie(country, COUNTRY_IP_COOKIE_KEY);

            if (!IsValidCountry(country))
            {
                country = SystemLanguage.DefaultCountryCode;
            }

            SetCountryCookie(country, COUNTRY_COOKIE_KEY);
            return country;
        }

        private static void SetCountryCookie(string countryCode, string cookieKey)
        {
            var request = HttpContext.Current.Request;
            var response = HttpContext.Current.Response;

            var existingCookie = request.Cookies[cookieKey];
            if (existingCookie != null && existingCookie.Value == countryCode)
            {
                return;
            }

            var cookie = new HttpCookie(cookieKey, countryCode)
            {
                HttpOnly = true,
                Secure = true
            };

            response.Cookies.Set(cookie);
        }

        public IEnumerable<Language> GetSupportedLanguages()
        {
            var isInternal = _sessionService.IsInternal;
            var cacheKey = (isInternal 
                               ? CacheKey.InternalSupportedLanguageList 
                               : CacheKey.SupportedLanguageList) 
                           + GetCountryCodeKey();

            var supportedLanguageList = _cacheService.Get<IEnumerable<Language>>(cacheKey);
            if (supportedLanguageList == null)
            {
                supportedLanguageList = GetLanguageList().Where(l => !l.ShortedCode.MatchWith(SystemLanguage.ShortedTeluguCode));
                _cacheService.Set(cacheKey, supportedLanguageList);
            }

            return supportedLanguageList;
        }

        public IEnumerable<Language> GetLanguageList()
        {
            var isInternal = _sessionService.IsInternal;
            var cacheKey = (isInternal
                               ? CacheKey.InternalLanguageList
                               : CacheKey.LanguageList)
                           + GetCountryCodeKey();

            var languageList = _cacheService.Get<IEnumerable<Language>>(cacheKey);
            if (languageList == null)
            {
                languageList = GetAllLanguages(isInternal).Where(l => !l.ShortedCode.MatchWith(SystemLanguage.ShortedChineseSimplifiedInMalaysia));
                _cacheService.Set(cacheKey, languageList);
            }

            return languageList;
        }

        public IEnumerable<Language> GetLanguageByTargetCountry(string targetCountry = "")
        {
            var cacheKey = (_sessionService.IsInternal 
                               ? CacheKey.InternalLanguageListByTargetCountry 
                               : CacheKey.LanguageListByTargetCountry) 
                           + targetCountry;

            var languageListByTargetCountry = _cacheService.Get<IEnumerable<Language>>(cacheKey);
            if (languageListByTargetCountry == null)
            {
                languageListByTargetCountry = GetTargetCountries(targetCountry, false)
                    .Where(l => !l.ShortedCode.MatchWith(SystemLanguage.ShortedChineseSimplifiedInMalaysia))
                    .Select(l => new Language
                    {
                        Code = l.Code,
                        EnglishName = l.EnglishName,
                        NativeName = l.NativeName,
                        ShortedCode = l.ShortedCode
                    })
                    .ToList();

                _cacheService.Set(cacheKey, languageListByTargetCountry);
            }

            return languageListByTargetCountry;
        }

        private IEnumerable<Language> GetAllLanguages(bool isForInternal)
        {
            var countryCode = GetCountryCode();
            return FetchTData<Language>(new GetLanguageListCriteria(isForInternal))
                .FilterLanguageByCountry(l => l.Code, countryCode);
        }

        public IEnumerable<TargetCountryLanguage> GetSystemTargetCountries()
        {
            var isInternal = _sessionService.IsInternal;
            var cacheKey = (isInternal
                               ? CacheKey.InternalTargetCountryList
                               : CacheKey.TargetCountryList)
                           + GetCountryCodeKey();

            var targetCountryList = _cacheService.Get<IEnumerable<TargetCountryLanguage>>(cacheKey);
            if (targetCountryList == null)
            {
                targetCountryList = GetTargetCountries();
                _cacheService.Set(cacheKey, targetCountryList);
            }

            return targetCountryList ?? new List<TargetCountryLanguage>();
        }

        public bool IsValid(string langCode)
            => !string.IsNullOrWhiteSpace(langCode) && GetLanguageList().Any(l => Equals(l.Code, langCode));

        private bool IsValidCountry(string countryCode)
            => !string.IsNullOrWhiteSpace(countryCode) && GetSystemTargetCountries().Any(t => Equals(t.TargetCountryCode, countryCode));

        public void SetCulture(string languageCode)
        {
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(languageCode);
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(languageCode);

            Thread.CurrentThread.CurrentCulture.DateTimeFormat = CultureInfo.CreateSpecificCulture(SystemLanguage.EnglishLanguageCode).DateTimeFormat;
            Thread.CurrentThread.CurrentCulture.NumberFormat = CultureInfo.CreateSpecificCulture(SystemLanguage.EnglishLanguageCode).NumberFormat;
        }

        public IEnumerable<Currency> GetBaseCurrencyList()
        {
            var countryCode = GetCountryCode();
            var cacheKey = CacheKey.BaseCurrencyList + GetCountryCodeKey();

            var baseCurrencyList = _cacheService.Get<IEnumerable<Currency>>(cacheKey);
            if (baseCurrencyList == null)
            {
                baseCurrencyList = FetchTData<Currency>(new GetBaseCurrencyListCriteria())
                    .FilterCurrencyByCountry(x=> x.Code, countryCode);
                _cacheService.Set(cacheKey, baseCurrencyList);
            }

            return baseCurrencyList;
        }

        private IEnumerable<TargetCountryLanguage> GetTargetCountries(string targetCountryCode = "", bool isDefault = true)
        {
            var isInternal = _sessionService.IsInternal;
            var countryCode = GetCountryCode();

            var targetCountries = FetchTData<TargetCountryLanguage>(new GetTargetCountryCriteria(isInternal, targetCountryCode, isDefault));
            return targetCountries.FilterSpecialCountry(c => c.TargetCountryCode, countryCode);
        }

        public Dictionary<string, List<TargetCountryLanguage>> GetTargetCountryLanguages()
        {
            var cacheKey = (_sessionService.IsInternal
                               ? CacheKey.InternalTargetCountryLanguages
                               : CacheKey.TargetCountryLanguages)
                           + GetCountryCodeKey();

            var targetCountryLanguages = _cacheService.Get<IEnumerable<TargetCountryLanguage>>(cacheKey);
            if (targetCountryLanguages == null)
            {
                targetCountryLanguages = GetTargetCountries(string.Empty, false);
                _cacheService.Set(cacheKey, targetCountryLanguages);
            }

            var result = targetCountryLanguages
                .GroupBy(tcl => tcl.TargetCountryCode)
                .ToDictionary(
                    g => g.Key,
                    g => g.Where(l => l.ShortedCode != SystemLanguage.ShortedTeluguCode && l.ShortedCode != SystemLanguage.ShortedChineseSimplifiedInMalaysia)
                        .OrderByDescending(m => m.Code == SystemLanguage.EnglishLanguageCode)
                        .ToList()
                );

            return result;
        }

        private string GetCountryCode() 
            => _sessionService.UserSession?.TargetCountryCode 
               ?? _sessionService.CountryByIp;

        private string GetCountryCodeKey()
        {
            var countryCode = GetCountryCode();
            if (SystemLanguage.SpecialCountry.ContainsKey(countryCode))
            {
                return $"_{countryCode}";
            }

            return "_";
        }
    }
}
