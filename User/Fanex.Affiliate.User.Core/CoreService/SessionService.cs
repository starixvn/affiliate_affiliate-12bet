using Fanex.Affiliate.User.Core.Constants;
using Fanex.Affiliate.User.Core.DTO.Auth;
using Fanex.Affiliate.User.Core.DTO.VerificationAccount;
using System.Web;
using static Fanex.Affiliate.User.Core.Constants.SessionKey;

namespace Fanex.Affiliate.User.Core.CoreService
{
    public class SessionService : ISessionService
    {
        public string CaptchaCode
        {
            get { return HttpContext.Current.Session[CaptchaCodeKey] as string; }
            set { HttpContext.Current.Session[CaptchaCodeKey] = value; }
        }

        public UserSession UserSession
        {
            get
            {
                var temp = HttpContext.Current.Session[UserSessionKey];
                return temp != null ? (UserSession)temp : null;
            }
        }

        public string CurrentLanguage
        {
            get
            {
                var session = HttpContext.Current.Session;
                if (session == null)
                {
                    return SystemLanguage.DefaultLanguageCode;
                }

                var currentLanguage = session[CurrentLanguageKey] as string;

                return string.IsNullOrEmpty(currentLanguage) ? SystemLanguage.DefaultLanguageCode : currentLanguage;
            }
            set
            {
                HttpContext.Current.Session[CurrentLanguageKey] = value;
            }
        }

        public string CurrentCountry
        {
            get
            {
                var session = HttpContext.Current.Session;
                const string defaultCountryCode = SystemLanguage.DefaultCountryCode;

                if (session == null)
                {
                    return defaultCountryCode;
                }

                var currentCountry = session[CurrentCountryKey] as string;

                return string.IsNullOrWhiteSpace(currentCountry) ? defaultCountryCode : currentCountry;
            }
            set => HttpContext.Current.Session[CurrentCountryKey] = value;
        }

        public bool IsInternal
        {
            get { return (bool)(HttpContext.Current.Session[IsInternalKey] ?? false); }
            set { HttpContext.Current.Session[IsInternalKey] = value; }
        }

        public string SignUpCaptchaCode
        {
            get { return HttpContext.Current.Session[SingUpCaptchaCodeKey] as string; }
            set { HttpContext.Current.Session[SingUpCaptchaCodeKey] = value; }
        }

        public string PrivateKey
        {
            get
            {
                return HttpContext.Current.Session[RsaKeyPairKey] as string;
            }
            set
            {
                HttpContext.Current.Session[RsaKeyPairKey] = value;
            }
        }

        public void AssignSessions(AuthorizedUserInfo authorizedUser)
        {
            var userSession = new UserSession
            {
                AffId = authorizedUser.AffId,
                AffCode = authorizedUser.AffCode,
                UserName = authorizedUser.UserName,
                PreferredLanguage = string.IsNullOrEmpty(authorizedUser.PreferredLanguage) ?
                    SystemLanguage.DefaultLanguageCode :
                    authorizedUser.PreferredLanguage,
                OnUserId = authorizedUser.OnUserId,
                AffType = authorizedUser.AffType,
                GroupName = authorizedUser.GroupName,
                GroupTypeId = authorizedUser.GroupTypeId,
                IsMaxSubLevel = authorizedUser.IsMaxSubLevel,
                IsDepositFeePercent = authorizedUser.IsDepositFeePercent,
                IsWithdrawalFeePercent = authorizedUser.IsWithdrawalFeePercent,
                DisabledTransfer = true //authorizedUser.DisabledTransfer //Hide Transfer Player
            };

            HttpContext.Current.Session[UserSessionKey] = userSession;
        }

        public VerificationSession VerificationSession
        {
            get { return HttpContext.Current.Session[VerificationSessionKey] as VerificationSession; }
            set { HttpContext.Current.Session[VerificationSessionKey] = value; }
        }

        public bool IsUnauthorized => IsInternal || (UserSession != null && UserSession.IsMarketingAccount);
    }
}