using Fanex.Affiliate.User.Core.Resources;
using System.Collections.Generic;
using System.Threading;

namespace Fanex.Affiliate.User.Core.Constants
{
    public static class SystemLanguage
    {
        private const string _English_LanguageCode = "en-US";
        private const string _Bangladesh_LanguageCode = "bn-BD";
        private const string _India_LanguageCode = "en-IN";
        private const string _Indonesia_LanguageCode = "id-ID";
        private const string _Japan_LanguageCode = "ja-JP";
        private const string _Cambodia_LanguageCode = "km-KH";
        private const string _Korea_LanguageCode = "ko-KR";
        private const string _Thailand_LanguageCode = "th-TH";
        private const string _VietNam_LanguageCode = "vi-VN";
        private const string _Chinese_LanguageCode = "zh-CN";
        private const string _Taiwan_LanguageCode = "zh-TW";

        private static readonly IReadOnlyDictionary<string, string> _supportedLanguageForGoogleAnalytics = new Dictionary<string, string>
        {
            [_English_LanguageCode] = "en",
            [_Bangladesh_LanguageCode] = "bn",
            [_India_LanguageCode] = "hien",
            [_Indonesia_LanguageCode] = "id",
            [_Japan_LanguageCode] = "jp",
            [_Cambodia_LanguageCode] = "kh",
            [_Korea_LanguageCode] = "ko",
            [_Thailand_LanguageCode] = "th",
            [_VietNam_LanguageCode] = "vn",
            [_Chinese_LanguageCode] = "cs",
            [_Taiwan_LanguageCode] = "ch",
        };

        private static readonly IReadOnlyDictionary<string, string> _supportedLanguageForSEO = new Dictionary<string, string>
        {
            [_English_LanguageCode] = "en",
            [_Chinese_LanguageCode] = "zh",
            [_Taiwan_LanguageCode] = "zh-MY",
            [_Thailand_LanguageCode] = "th",
            [_VietNam_LanguageCode] = "vi",
            [_Indonesia_LanguageCode] = "id",
            [_India_LanguageCode] = "en-IN",
            [_Korea_LanguageCode] = "ko",
        };


        private static readonly IReadOnlyDictionary<string, string> _supportedFavoriteLanguages = new Dictionary<string, string>
        {
            ["en"] = _English_LanguageCode,
            ["br"] = _English_LanguageCode,
            ["my"] = _English_LanguageCode,
            ["bd"] = _Bangladesh_LanguageCode,
            ["bn"] = _Bangladesh_LanguageCode,
            ["hien"] = _India_LanguageCode,
            ["hi"] = _India_LanguageCode,
            ["hitg"] = _India_LanguageCode,
            ["in"] = _India_LanguageCode,
            ["id"] = _Indonesia_LanguageCode,
            ["jp"] = _Japan_LanguageCode,
            ["kh"] = _English_LanguageCode,
            ["kr"] = _Korea_LanguageCode,
            ["ko"] = _Korea_LanguageCode,
            ["th"] = _Thailand_LanguageCode,
            ["vn"] = _VietNam_LanguageCode,
            ["cn"] = _Chinese_LanguageCode,
            ["cs"] = _Chinese_LanguageCode,
            ["tw"] = _Taiwan_LanguageCode,
            ["ch"] = _Taiwan_LanguageCode,
        };

        private static readonly IReadOnlyDictionary<string, IList<KeyValuePair<string, string>>> _supportedAlternateLanguages = new Dictionary<string, IList<KeyValuePair<string, string>>>
        {
            [_English_LanguageCode] = new List<KeyValuePair<string, string>> {
                new KeyValuePair<string, string>("br", "en-BR"),
                new KeyValuePair<string, string>("br", "pt-BR"),
                new KeyValuePair<string, string>("br", "pt"),
                new KeyValuePair<string, string>("en", "en-MY"),
                new KeyValuePair<string, string>("en", "my-MY"),
                new KeyValuePair<string, string>("en", "my"),
                new KeyValuePair<string, string>("en", "en-US"),
                new KeyValuePair<string, string>("en", "en-UK"),
                new KeyValuePair<string, string>("en", "en"),
                new KeyValuePair<string, string>("en", "")
            },
            [_Bangladesh_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("bd", "en-BD"),
                new KeyValuePair<string, string>("bd", "bn-BD"),
                new KeyValuePair<string, string>("bd", "bn"),
                new KeyValuePair<string, string>("bd", "")
            },
            [_India_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("hien", "en-IN"),
                new KeyValuePair<string, string>("hi", "hi-IN"),
                new KeyValuePair<string, string>("hitg", "te-IN"),
                new KeyValuePair<string, string>("in", "")
            },
            [_Indonesia_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("id", "en-ID"),
                new KeyValuePair<string, string>("id", "id-ID"),
                new KeyValuePair<string, string>("id", "id"),
                new KeyValuePair<string, string>("id", "")
            },
            [_Japan_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("jp", "en-JP"),
                new KeyValuePair<string, string>("jp", "ja-JP"),
                new KeyValuePair<string, string>("jp", "ja"),
                new KeyValuePair<string, string>("jp", "")
            },
            [_Cambodia_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("kh", "en-KH"),
                new KeyValuePair<string, string>("kh", "km-KH"),
                new KeyValuePair<string, string>("kh", "km"),
                new KeyValuePair<string, string>("kh", "")
            },
            [_Korea_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("kr", "en-KR"),
                new KeyValuePair<string, string>("kr", "ko-KR"),
                new KeyValuePair<string, string>("kr", "ko"),
                new KeyValuePair<string, string>("kr", "")
            },
            [_Thailand_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("th", "en-TH"),
                new KeyValuePair<string, string>("th", "th-TH"),
                new KeyValuePair<string, string>("th", "th"),
                new KeyValuePair<string, string>("th", "")
            },
            [_VietNam_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("vn", "en-VN"),
                new KeyValuePair<string, string>("vn", "vn-VN"),
                new KeyValuePair<string, string>("vn", "vi-VN"),
                new KeyValuePair<string, string>("vn", "vn"),
                new KeyValuePair<string, string>("vn", "")
            },
            [_Chinese_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("cn", "en-CN"),
                new KeyValuePair<string, string>("cn", "zh-CN"),
                new KeyValuePair<string, string>("cn", "zh"),
                new KeyValuePair<string, string>("cn", "cs"),
                new KeyValuePair<string, string>("cn", "")
            },
            [_Taiwan_LanguageCode] = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("tw", "en-TW"),
                new KeyValuePair<string, string>("tw", "id-TW"),
                new KeyValuePair<string, string>("tw", "tw"),
                new KeyValuePair<string, string>("tw", "ch"),
                new KeyValuePair<string, string>("tw", "")
            },
        };

        private static readonly IList<string> _unsupportedP2pProductLanguages = new List<string> { _Bangladesh_LanguageCode, _India_LanguageCode, _Cambodia_LanguageCode };

        public static IReadOnlyDictionary<string, string> SupportedLanguage => _supportedLanguageForGoogleAnalytics;

        public static IReadOnlyDictionary<string, string> SupportedFavoriteLanguages => _supportedFavoriteLanguages;

        public static IReadOnlyDictionary<string, IList<KeyValuePair<string, string>>> SupportedAlternateLanguages => _supportedAlternateLanguages;

        public static IList<string> UnsupportedP2pProductLanguages => _unsupportedP2pProductLanguages;

        public const string DefaultLanguageCode = _English_LanguageCode;

        public const string EnglishLanguageCode = _English_LanguageCode;

        public const string BangladeshLanguageCode = _Bangladesh_LanguageCode;

        public const string IndiaLanguageCode = _India_LanguageCode;

        public const string IndonesiaLanguageCode = _Indonesia_LanguageCode;

        public const string JapanLanguageCode = _Japan_LanguageCode;

        public const string CambodianLanguageCode = _Cambodia_LanguageCode;

        public const string KoreaLanguageCode = _Korea_LanguageCode;

        public const string ThailandLanguageCode = _Thailand_LanguageCode;

        public const string VietNamLanguageCode = _VietNam_LanguageCode;

        public const string ChineseLanguageCode = _Chinese_LanguageCode;

        public const string TaiwanLanguageCode = _Taiwan_LanguageCode;

        public const string ShortedDefaultCode = "en";

        public const string ShortedTeluguCode = "hitg";

        public const string ShortedChineseSimplifiedInMalaysia = "mycs";

        public const string ShortedEnglishInPhilippines = "phen";

        public const string SelectedAllLanguages = "";

        private static readonly IList<string> _unsupportedFilterLanguages = new List<string> { ShortedChineseSimplifiedInMalaysia, ShortedEnglishInPhilippines };

        public static IList<string> UnsupportedFilterLanguages => _unsupportedFilterLanguages;

        public static string GetShortedCodeForTracking(string currentLanguage)
        {
            if (_supportedLanguageForGoogleAnalytics.TryGetValue(currentLanguage, out string result) && !string.IsNullOrEmpty(result))
            {
                return result.ToUpperInvariant();
            }

            return ShortedDefaultCode.ToUpperInvariant();
        }

        public static string GetSEOHtmlTagLangAttribute()
        {
            var currentCulture = Thread.CurrentThread.CurrentCulture;
            var htmlTagSeoName = _supportedLanguageForSEO.TryGetValue(currentCulture.Name, out string result)
                ? result
                : ShortedDefaultCode;
            return htmlTagSeoName;
        }

        public static string GetCanonicalLangName()
        {
            var currentCulture = Thread.CurrentThread.CurrentCulture;
            var canonicalLangName = _supportedLanguageForSEO.TryGetValue(currentCulture.Name, out string _)
                ? currentCulture.TwoLetterISOLanguageName
                : ShortedDefaultCode;
            return canonicalLangName;
        }

        public static string GetCurrentShortedLanguage(string currentLanguage)
        {
            return _supportedLanguageForGoogleAnalytics.ContainsKey(currentLanguage) ? _supportedLanguageForGoogleAnalytics[currentLanguage] : currentLanguage;
        }

        public static bool ShouldUsingLogoOriginal(string currentLanguage)
        {
            return currentLanguage.Equals(EnglishLanguageCode) || currentLanguage.Equals(ChineseLanguageCode) || currentLanguage.Equals(TaiwanLanguageCode);
        }

        public static string GetLanguageText(string value)
        {
            return (value.Contains("(") 
                           ? Lang.ResourceManager.GetString(value.Replace(" (", "").Replace(")", "")) 
                           : Lang.ResourceManager.GetString(value.Replace(" ", "")))
                   ?? value;
        }
    }
}