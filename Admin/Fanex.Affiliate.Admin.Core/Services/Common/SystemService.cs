using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Common;
using Fanex.Caching;
using Fanex.Data.Repository;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;

namespace Fanex.Affiliate.Admin.Core.Services.Common
{
    public class SystemService : BaseDynamicService, ISystemService
    {
        private const string _Chinese_Simplified_For_Malaysia = "mycs";
        private static readonly IList<string> _unsupportedFilterLanguages = new List<string> { _Chinese_Simplified_For_Malaysia };

        private readonly ICacheService _cacheService;

        public SystemService(
            IDynamicRepository dynamicRepository,
            ICacheService cacheService) : base(dynamicRepository)
        {
            _cacheService = cacheService;
        }

        public IEnumerable<Language> GetLanguageList()
        {
            var languageList = _cacheService.Get<IEnumerable<Language>>(CacheKey.LanguageList);

            if (languageList == null)
            {
                const string SpKey = "Aff_Market_Sel";

                languageList = FetchTData<Language>(SpKey).Where(l => !_unsupportedFilterLanguages.Contains(l.ShortedLanguageCode));
                _cacheService.Set(CacheKey.LanguageList, languageList);
            }

            return languageList;
        }

        public IEnumerable<Product> GetProductList()
        {
            var productList = _cacheService.Get<IEnumerable<Product>>(CacheKey.ProductList);

            if (productList == null)
            {
                const string SpKey = "Aff_ProductList_Sel";

                productList = FetchTData<Product>(SpKey);
                _cacheService.Set(CacheKey.ProductList, productList);
            }

            return productList;
        }

        public IEnumerable<Currency> GetBaseCurrencies()
        {
            var currencyList = _cacheService.Get<IEnumerable<Currency>>(CacheKey.BaseCurrencyList);

            if (currencyList == null)
            {
                const string SpKey = "Aff_BaseCurrency_Sel";

                currencyList = FetchTData<Currency>(SpKey);
                _cacheService.Set(CacheKey.BaseCurrencyList, currencyList);
            }

            return currencyList;
        }

        public IEnumerable<Currency> GetCurrencies()
        {
            var currencyList = _cacheService.Get<IEnumerable<Currency>>(CacheKey.CurrencyList);

            if (currencyList == null)
            {
                const string SpKey = "Aff_Currency_Sel";

                currencyList = FetchTData<Currency>(SpKey);
                _cacheService.Set(CacheKey.CurrencyList, currencyList);
            }

            return currencyList;
        }

        public IEnumerable<Currency> GetPaymentCurrencies()
        {
            var currencyList = _cacheService.Get<IEnumerable<Currency>>(CacheKey.PaymentCurrencyList);

            if (currencyList == null)
            {
                const string SpKey = "Aff_PaymentCurrency_Sel";

                currencyList = FetchTData<Currency>(SpKey);
                _cacheService.Set(CacheKey.PaymentCurrencyList, currencyList);
            }

            return currencyList;
        }

        public IEnumerable<TargetCountry> GetTargetCountryList()
        {
            var targetCountries = _cacheService.Get<IEnumerable<TargetCountry>>(CacheKey.TargetCountryList);

            if (targetCountries == null)
            {
                const string SpKey = "Aff_TargetCountry_Sel";

                targetCountries = FetchTData<TargetCountry>(SpKey);
                _cacheService.Set(CacheKey.TargetCountryList, targetCountries);
            }

            return targetCountries;
        }
        public void SetCulture(string languageCode)
        {
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(languageCode);
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(languageCode);

            Thread.CurrentThread.CurrentCulture.DateTimeFormat = CultureInfo.CreateSpecificCulture("en-US").DateTimeFormat;
            Thread.CurrentThread.CurrentCulture.NumberFormat = CultureInfo.CreateSpecificCulture("en-US").NumberFormat;
        }
    }
}
