namespace Fanex.Affiliate.Admin.Core.Configurations
{
    public interface IAppSetting
    {
        string GetValue(string key);

        string MailContact { get; }

        string AppMailId { get; }

        string AppMailAddress { get; }

        string InternalEuropeanAffiliateUrl { get; }

        string InternalAsianAffiliateUrl { get; }

        string EuropeanAffSiteUrl { get; }

        string AsianAffSiteUrl { get; }

        string Environment { get; }

        bool IsProduction { get; }

        bool IsDev { get; }

        string CcMail { get; }

        string BccMail { get; }

        string SentryDsn { get; }

        string LoggingCategory { get; }

        string RabbitMQConnectionString { get; }

        string BannerRootUrl { get; }

        string LandingPageUrl { get; }

        string EmailBackgroundUrl { get; }

        string[] BannerFolders { get; }

        int ImageSize { get; }

        string ServerId { get; }

        string SiteName { get; }

        string SiteFriendlyName { get; }

        string DefaultLanguage { get; }

        string DefaultLanguageCode { get; }

        string DefaultShortedLanguageCode { get; }

        string DefaultCurrency { get; }

        string MemberSiteApiUrl { get; }

        int MemberSiteId { get; }

        string MemberSiteProxyUrl { get; }

        string MemberSiteApiUsername { get; }

        string MemberSiteApiPassword { get; }

        int MemberSiteApiTokenCacheTimeOut { get; }

        int MarketingSpecificAffId { get; }

        string MarketingSpecificAffName { get; }

        bool IsUseMemberSiteProxy { get; }

        bool IsApiDataModifiable { get; }

        bool IsMarketingSpecificEmail(string email);
    }
}
