using Fanex.Affiliate.Admin.Core.Extensions;
using System;
using System.Configuration;

namespace Fanex.Affiliate.Admin.Core.Configurations
{
    public class AppSetting : IAppSetting
    {
        public static IAppSetting Instance { get; } = new AppSetting();

        public string InternalAsianAffiliateUrl => GetValue("internalAsianAffiliateURL");

        public string InternalEuropeanAffiliateUrl => GetValue("internalEuropeanAffiliateURL");

        public string Environment => GetValue("Environment");

        public bool IsProduction => Environment.Equals("PRODUCTION", StringComparison.OrdinalIgnoreCase);

        public string CcMail => GetValue("ccMail");

        public string BccMail => GetValue("bccMail");

        public string EuropeanAffSiteUrl => GetValue("EuropeanAffiliateURL");

        public string AsianAffSiteUrl => GetValue("AsianAffiliateURL");

        public bool IsDev => Environment.Equals("DEV", StringComparison.OrdinalIgnoreCase);

        public string GetValue(string key) => ConfigurationManager.AppSettings[key];

        public string MailContact => GetValue("MailContact");

        public string AppMailId => GetValue("app_mail_id");

        public string AppMailAddress => GetValue("app_mail_address");

        public string SentryDsn => GetValue("Dsn");

        public string LoggingCategory => GetValue("LoggingCategory");

        public string RabbitMQConnectionString => GetValue("RabbitMQConnectionString");

        public string BannerRootUrl => GetValue("BannerUrl");

        public string LandingPageUrl => GetValue("LandingPageUrl");

        public string EmailBackgroundUrl => GetValue("EmailBackgroundUrl");

        public string[] BannerFolders => GetValue("BannerFolders").Split(';');

        public int ImageSize => Convert.ToInt32(GetValue("imagesize"));

        public string ServerId => GetValue("ServerID");

        public string SiteName => GetValue("SiteName");

        public string SiteFriendlyName => "12Bet";

        public string DefaultLanguage => GetValue("DefaultLanguage");

        public string DefaultLanguageCode => GetValue("DefaultLanguageCode");

        public string DefaultShortedLanguageCode => GetValue("DefaultShortedLanguageCode");

        public string DefaultCurrency => GetValue("DefaultCurrency");

        public string MemberSiteApiUrl => GetValue("MemberSiteApiUrl");

        public int MemberSiteId => Convert.ToInt32(GetValue("MemberSiteId"));

        public string MemberSiteProxyUrl => GetValue("MemberSiteProxyUrl");

        public string MemberSiteApiUsername => GetValue("MemberSiteApiUsername");

        public string MemberSiteApiPassword => GetValue("MemberSiteApiPassword");

        public int MemberSiteApiTokenCacheTimeOut => Convert.ToInt32(GetValue("MemberSiteApiTokenCacheTimeOut"));

        public int MarketingSpecificAffId => Convert.ToInt32(GetValue("MarketingSpecificAffId"));

        public string MarketingSpecificAffName => GetValue("MarketingSpecificAffName");

        public bool IsUseMemberSiteProxy => Convert.ToBoolean(GetValue("IsUseProxyToGetMemberSiteApi"));

        public bool IsApiDataModifiable => Convert.ToBoolean(GetValue("IsApiDataModifiable"));

        public bool IsMarketingSpecificEmail(string email) => email.MatchWith(GetValue("MarketingSpecificEmail"));
    }
}
