namespace Fanex.Affiliate.User.Core.UnitTests.Utilities
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using Core.Utilities;
    using Xunit;

    public class AppSettingTests
    {
        private AppSetting _appSetting;

        private void SetUpAppSettings(Dictionary<string, string> settings)
        {
            foreach (var setting in settings)
            {
                ConfigurationManager.AppSettings[setting.Key] = setting.Value;
            }
            _appSetting = new AppSetting();
        }

        [Fact]
        public void IsDev_ShouldReturnTrue_WhenEnvironmentIsDev()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "Environment", "Dev" }
            });
            Assert.True(_appSetting.IsDev);
        }

        [Fact]
        public void IsLocal_ShouldReturnTrue_WhenEnvironmentIsLocal()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "Environment", "Local" }
            });
            Assert.True(_appSetting.IsLocal);
        }

        [Fact]
        public void IsProduction_ShouldReturnTrue_WhenEnvironmentIsProduction()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "Environment", "Production" }
            });
            Assert.True(_appSetting.IsProduction);
        }

        [Fact]
        public void ServerId_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "ServerId", "1" }
            });
            Assert.Equal(1, _appSetting.ServerId);
        }

        [Fact]
        public void AllowedAffiliateTypes_ShouldReturnCorrectValues()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "AllowedAffType", "Type1,Type2" }
            });
            var result = _appSetting.AllowedAffiliateTypes;
            Assert.Contains("Type1", result);
            Assert.Contains("Type2", result);
        }

        [Fact]
        public void Promotion12BetLink_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "Promotion12BetLink", "https://promo.com" }
            });
            Assert.Equal("https://promo.com", _appSetting.Promotion12BetLink);
        }

        [Fact]
        public void IsEuroSite_ShouldReturnTrue_WhenAffiliateTypeIsEuropean()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "AllowedAffType", "2,3,4" }
            });

            Assert.True(_appSetting.IsEuroSite);
        }

        [Fact]
        public void TextLinkTemplate_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "TextLinkTemplate", "link_template" }
            });
            Assert.Equal("link_template", _appSetting.TextLinkTemplate);
        }

        [Fact]
        public void BannerDomain_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "BannerDomain", "https://banner.com" }
            });
            Assert.Equal("https://banner.com", _appSetting.BannerDomain);
        }

        [Fact]
        public void EmailBackgroundUrl_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "EmailBackgroundUrl", "https://background.com" }
            });
            Assert.Equal("https://background.com", _appSetting.EmailBackgroundUrl);
        }

        [Fact]
        public void MailContact_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MailContact", "contact@mail.com" }
            });
            Assert.Equal("contact@mail.com", _appSetting.MailContact);
        }

        [Fact]
        public void MailCc_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MailCc", "cc@mail.com" }
            });
            Assert.Equal("cc@mail.com", _appSetting.MailCc);
        }

        [Fact]
        public void MailBcc_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MailBcc", "bcc@mail.com" }
            });
            Assert.Equal("bcc@mail.com", _appSetting.MailBcc);
        }

        [Fact]
        public void StatementAvailableFrom_ShouldReturnCorrectDate()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "StatementAvailableFrom", "2025-01-01" }
            });
            Assert.Equal(new DateTime(2025, 01, 01), _appSetting.StatementAvailableFrom);
        }

        [Fact]
        public void RsaPublicKey_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "RsaPublicKey", "public_key" }
            });
            Assert.Equal("public_key", _appSetting.RsaPublicKey);
        }

        [Fact]
        public void RsaPrivateKey_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "RsaPrivateKey", "private_key" }
            });
            Assert.Equal("private_key", _appSetting.RsaPrivateKey);
        }

        [Fact]
        public void LoginTimeout_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "LoginTimeout", "30" }
            });
            Assert.Equal(30, _appSetting.LoginTimeout);
        }

        [Fact]
        public void ValidIdleTime_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "ValidIdleTime", "15" }
            });
            Assert.Equal(15, _appSetting.ValidIdleTime);
        }

        [Fact]
        public void SymmetricPassword_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "SymmetricPassword", "password" }
            });
            Assert.Equal("password", _appSetting.SymmetricPassword);
        }

        [Fact]
        public void SymmetricSalt_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "SymmetricSalt", "salt" }
            });
            Assert.Equal("salt", _appSetting.SymmetricSalt);
        }

        [Fact]
        public void QrCodeIconPathTemplate_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "QrCodeIconPathTemplate", "qr_code_icon" }
            });
            Assert.Equal("qr_code_icon", _appSetting.QrCodeIconPathTemplate);
        }

        [Fact]
        public void ResourceDomain_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "ResourceDomain", "https://resource.com" }
            });
            Assert.Equal("https://resource.com", _appSetting.ResourceDomain);
        }

        [Fact]
        public void AppMailAddress_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "app_mail_address", "app@mail.com" }
            });
            Assert.Equal("app@mail.com", _appSetting.AppMailAddress);
        }

        [Fact]
        public void AppMailId_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "app_mail_id", "app_mail_id_123" }
            });
            Assert.Equal("app_mail_id_123", _appSetting.AppMailId);
        }

        [Fact]
        public void MemberSiteApiUrl_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MemberSiteApiUrl", "https://api.membersite.com" }
            });
            Assert.Equal("https://api.membersite.com", _appSetting.MemberSiteApiUrl);
        }

        [Fact]
        public void AccountSiteApiUrl_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "AccountSiteApiUrl", "https://api.accountsite.com" }
            });
            Assert.Equal("https://api.accountsite.com", _appSetting.AccountSiteApiUrl);
        }

        [Fact]
        public void MemberSiteId_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MemberSiteId", "1" }
            });
            Assert.Equal(1, _appSetting.MemberSiteId);
        }

        [Fact]
        public void MemberSiteProxyUrl_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MemberSiteProxyUrl", "https://proxy.membersite.com" }
            });
            Assert.Equal("https://proxy.membersite.com", _appSetting.MemberSiteProxyUrl);
        }

        [Fact]
        public void MemberSiteApiUsername_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MemberSiteApiUsername", "api_user" }
            });
            Assert.Equal("api_user", _appSetting.MemberSiteApiUsername);
        }

        [Fact]
        public void MemberSiteApiPassword_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MemberSiteApiPassword", "api_password" }
            });
            Assert.Equal("api_password", _appSetting.MemberSiteApiPassword);
        }

        [Fact]
        public void MemberSiteApiTokenCacheTimeOut_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "MemberSiteApiTokenCacheTimeOut", "60" }
            });
            Assert.Equal(60, _appSetting.MemberSiteApiTokenCacheTimeOut);
        }

        [Fact]
        public void IsUseMemberSiteProxy_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "IsUseProxyToGetMemberSiteApi", "true" }
            });
            Assert.True(_appSetting.IsUseMemberSiteProxy);
        }

        [Fact]
        public void SubAffTextLinkTemplate_ShouldReturnCorrectValue()
        {
            SetUpAppSettings(new Dictionary<string, string>
            {
                { "SubAffTextLinkTemplate", "sub_aff_template" }
            });
            Assert.Equal("sub_aff_template", _appSetting.SubAffTextLinkTemplate);
        }
    }
}