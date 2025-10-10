using System;
using System.Collections.Generic;

namespace Fanex.Affiliate.User.Core.Utilities
{
    public interface IAppSetting
    {
        string GetValue(string key);

        string Environment { get; }

        bool IsDev { get; }

        bool IsLocal { get; }

        bool IsProduction { get; }

        IEnumerable<string> AllowedAffiliateTypes { get; }

        int ServerId { get; }

        string JsVersion { get; }

        string Promotion12BetLink { get; }

        bool IsEuroSite { get; }

        string TextLinkTemplate { get; }

        string BannerDomain { get; }

        string EmailBackgroundUrl { get; }

        string MailContact { get; }

        string MailCc { get; }

        string MailBcc { get; }

        string RsaPublicKey { get; }

        string RsaPrivateKey { get; }

        int LoginTimeout { get; }

        int ValidIdleTime { get; }

        DateTime StatementAvailableFrom { get; }

        string SymmetricPassword { get; }

        string SymmetricSalt { get; }

        string QrCodeIconPathTemplate { get; }

        string ResourceDomain { get; }

        string AppMailId { get; }

        string AppMailAddress { get; }

        bool IsMarketingSpecificEmail(string email);

        string MemberSiteApiUrl { get; }

        string AccountSiteApiUrl { get; }

        int MemberSiteId { get; }

        string MemberSiteProxyUrl { get; }

        string MemberSiteApiUsername { get; }

        string MemberSiteApiPassword { get; }

        int MemberSiteApiTokenCacheTimeOut { get; }

        bool IsUseMemberSiteProxy { get; }

        bool IsApiDataModifiable { get; }

        string SubAffTextLinkTemplate { get; }

        string DefaultDomainSite { get; }

        string DefaultDomainSiteByCountry(string countryCode);
    }
}
