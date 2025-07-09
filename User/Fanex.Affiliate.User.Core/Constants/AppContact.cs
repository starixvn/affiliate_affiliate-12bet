using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.Constants
{
    public static class AppContact
    {
        public const string Telegram = "Telegram";
        public const string WhatsApp = "WhatsApp";
        public const string Line = "Line";
        public const string Facebook = "Facebook";
        public const string QQ = "QQ";
        private const string Default = "Default";
        private const string DefaultRegexAllApps = "^.*$";
        private const string DefaultRegexWhatsApp = "^\\+\\d{10,}$";

        public static readonly IReadOnlyDictionary<string, string> FirsAppContactList = new Dictionary<string, string>
        {
            [SystemLanguage.EnglishLanguageCode] = Telegram,
            [SystemLanguage.PhilippinesLanguageCode] = Telegram,
            [SystemLanguage.BangladeshLanguageCode] = WhatsApp,
            [SystemLanguage.IndiaLanguageCode] = WhatsApp,
            [SystemLanguage.IndonesiaLanguageCode] = WhatsApp,
            [SystemLanguage.JapanLanguageCode] = Telegram,
            [SystemLanguage.CambodianLanguageCode] = Telegram,
            [SystemLanguage.KoreaLanguageCode] = Telegram,
            [SystemLanguage.ThailandLanguageCode] = Line,
            [SystemLanguage.VietNamLanguageCode] = Telegram,
            [SystemLanguage.ChineseLanguageCode] = Telegram,
            [SystemLanguage.TaiwanLanguageCode] = Telegram,
        };

        public static readonly IReadOnlyDictionary<string, string> SecondAppContactList = new Dictionary<string, string>
        {
            [SystemLanguage.EnglishLanguageCode] = Facebook,
            [SystemLanguage.PhilippinesLanguageCode] = Facebook,
            [SystemLanguage.BangladeshLanguageCode] = Telegram,
            [SystemLanguage.IndiaLanguageCode] = Telegram,
            [SystemLanguage.JapanLanguageCode] = Facebook,
            [SystemLanguage.CambodianLanguageCode] = Facebook,
            [SystemLanguage.ChineseLanguageCode] = QQ,
            [SystemLanguage.TaiwanLanguageCode] = QQ,
        };

        public static readonly IReadOnlyDictionary<string, string> ThirdAppContactList = new Dictionary<string, string>
        {
        };

        private static readonly IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> RegexValidations = new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            [Telegram] = new Dictionary<string, string>
            {
                [Default] = "^@.+$"
            },
            ["Line"] = new Dictionary<string, string>
            {
                [Default] = "^@.+$"
            },
            [WhatsApp] = new Dictionary<string, string>
            {
                [SystemLanguage.BangladeshLanguageCode] = "^\\+880\\d{7,}$",
                [SystemLanguage.IndiaLanguageCode] = "^\\+91\\d{8,}$",
                [SystemLanguage.IndonesiaLanguageCode] = "^\\+62\\d{8,}$",
                [Default] = DefaultRegexWhatsApp
            }
        };

        private static readonly IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> PlaceHolders = new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            [Telegram] = new Dictionary<string, string>
            {
                [Default] = "@XXXXXXXXXX"
            },
            ["Line"] = new Dictionary<string, string>
            {
                [Default] = "@XXXXXXXXXX"
            },
            [WhatsApp] = new Dictionary<string, string>
            {
                [SystemLanguage.BangladeshLanguageCode] = "+880XXXXXXXXXX",
                [SystemLanguage.IndiaLanguageCode] = "+91XXXXXXXXXX", 
                [SystemLanguage.IndonesiaLanguageCode] = "+62XXXXXXXXX",
                [Default] = "+XXXXXXXXXX"
            }
        };

        public static string GetRegexByAppAndLanguage(string contactAppName, string language = "")
        {
            if (string.IsNullOrEmpty(contactAppName))
            {
                return DefaultRegexAllApps;
            }
            return GetValueDicByAppAndLanguage(RegexValidations, contactAppName, language, DefaultRegexAllApps);
        }

        public static string GetPlaceHolderByAppAndLanguage(string contactAppName, string language = "")
        {
            if (string.IsNullOrEmpty(contactAppName))
            {
                return string.Empty;
            }
            return GetValueDicByAppAndLanguage(PlaceHolders, contactAppName, language);
        }

        private static string GetValueDicByAppAndLanguage(
            IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> dictionary,
            string contactAppName,
            string language,
            string defaultValue = "")
        {
            if (!dictionary.TryGetValue(contactAppName, out var dictionaryByLanguage))
            {
                return defaultValue;
            }

            return dictionaryByLanguage.TryGetValue(language, out var value)
                ? value
                : dictionaryByLanguage[Default];
        }
    }
}
