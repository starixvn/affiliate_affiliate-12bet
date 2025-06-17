namespace Fanex.Affiliate.User.Core.BusinessService
{
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
        private readonly ISessionService _sessionService;
        private readonly IMemoryCacheService _cacheService;

        public SystemService(
            IDynamicRepository dynamicRepository,
            ISessionService sessionService,
            IMemoryCacheService cacheService) : base(dynamicRepository)
        {
            _sessionService = sessionService;
            _cacheService = cacheService;
        }

        public string GetFavoriteLanguage()
        {
            var preferedUrlLang = HttpContext.Current.Request.RequestContext.RouteData.Values["lang"]?.ToString();
            var preferedLang = SystemLanguage.SupportedFavoriteLanguages.FirstOrDefault(i => i.Key.MatchWith(preferedUrlLang)).Value;

            if (IsValid(preferedLang))
            {
                return preferedLang;
            }

            var langCookie = HttpContext.Current.Request.Cookies["afffavoritelang"]?.Value;

            return IsValid(langCookie) ? langCookie : _sessionService.CurrentLanguage;
        }

        public string GetFavoriteShortedLanguage()
        {
            var favoriteLanguage = GetFavoriteLanguage();

            return SystemLanguage.GetCurrentShortedLanguage(favoriteLanguage);
        }

        public IEnumerable<Language> GetSupportedLanguages()
        {
            var supportedLanguageList = _cacheService.Get<IEnumerable<Language>>(CacheKey.SupportedLanguageList);

            if (supportedLanguageList == null)
            {
                supportedLanguageList = GetLanguageList().Where(l => !l.ShortedCode.MatchWith(SystemLanguage.ShortedTeluguCode));
                _cacheService.Set(CacheKey.SupportedLanguageList, supportedLanguageList);
            }

            return supportedLanguageList;
        }

        public IEnumerable<Language> GetLanguageList()
        {
            var languageList = _cacheService.Get<IEnumerable<Language>>(CacheKey.LanguageList);

            if (languageList == null)
            {
                languageList = GetAllLanguages().Where(l => !SystemLanguage.UnsupportedFilterLanguages.Contains(l.ShortedCode));
                _cacheService.Set(CacheKey.LanguageList, languageList);
            }

            return languageList;
        }

        public IEnumerable<Language> GetLanguageByTargetCountry(string targetCountry = "")
        {
            var cacheKey = $"{CacheKey.LanguageListByTargetCountry}{targetCountry}";
            var languageListByTargetCountry = _cacheService.Get<IEnumerable<Language>>(cacheKey);

            if (languageListByTargetCountry == null)
            {
                languageListByTargetCountry = GetAllLanguages(targetCountry).Where(l => !l.ShortedCode.MatchWith(SystemLanguage.ShortedChineseSimplifiedInMalaysia));
                _cacheService.Set(cacheKey, languageListByTargetCountry);
            }

            return languageListByTargetCountry;
        }

        private IEnumerable<Language> GetAllLanguages(string targetCountry = "")
        {
            var isForInternal = _sessionService.IsInternal;
            var languages = FetchTData<Language>(new GetLanguageListCriteria(isForInternal, targetCountry));

            return languages;
        }

        public IEnumerable<TargetCountry> GetSystemTargetCountries()
        {
            var isInternal = _sessionService.IsInternal;
            var cacheKey = isInternal ? CacheKey.InternalTargetCountryList : CacheKey.TargetCountryList;

            var targetCountryList = _cacheService.Get<IEnumerable<TargetCountry>>(cacheKey);
            if (targetCountryList == null)
            {
                targetCountryList = FetchTData<TargetCountry>(new GetTargetCountryCriteria(isInternal));
                _cacheService.Set(cacheKey, targetCountryList);
            }

            return targetCountryList ?? new List<TargetCountry>();
        }

        public bool IsValid(string langCode)
            => !string.IsNullOrWhiteSpace(langCode) && GetLanguageList().Any(l => Equals(l.Code, langCode));

        public void SetCulture(string languageCode)
        {
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(languageCode);
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(languageCode);

            Thread.CurrentThread.CurrentCulture.DateTimeFormat = CultureInfo.CreateSpecificCulture("en-US").DateTimeFormat;
            Thread.CurrentThread.CurrentCulture.NumberFormat = CultureInfo.CreateSpecificCulture("en-US").NumberFormat;
        }

        public IEnumerable<Currency> GetBaseCurrencyList()
        {
            var baseCurrencyList = _cacheService.Get<IEnumerable<Currency>>(CacheKey.BaseCurrencyList);

            if (baseCurrencyList == null)
            {
                baseCurrencyList = FetchTData<Currency>(new GetBaseCurrencyListCriteria());
                _cacheService.Set(CacheKey.BaseCurrencyList, baseCurrencyList);
            }

            return baseCurrencyList;
        }
    }
}
