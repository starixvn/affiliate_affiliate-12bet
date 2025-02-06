using Fanex.Affiliate.User.Core.Constants;
using Fanex.Affiliate.User.Core.DTO.Auth;
using Fanex.Affiliate.User.Core.DTO.VerificationAccount;
using System;
using System.Collections.Generic;
using System.Security.Claims;
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

        public DateTime? LastestRequestTime
        {
            get
            {
                var time = HttpContext.Current.Session[LastestRequestTimeKey];
                return (DateTime?)time;
            }
            set { HttpContext.Current.Session[LastestRequestTimeKey] = value; }
        }

        public bool IsOpenedFeedback
        {
            get { return (bool)(HttpContext.Current.Session[IsOpenedFeedbackKey] ?? false); }
            set { HttpContext.Current.Session[IsOpenedFeedbackKey] = value; }
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
                UserName = authorizedUser.UserName,
                PreferredLanguage = string.IsNullOrEmpty(authorizedUser.PreferredLanguage) ?
                                        SystemLanguage.DefaultLanguageCode :
                                        authorizedUser.PreferredLanguage,
                OnUserId = authorizedUser.OnUserId,
                AffType = authorizedUser.AffType,
                GroupName = authorizedUser.GroupName,
                UserId = authorizedUser.UserId,
                OfferPageId = authorizedUser.OfferPageId
            };

            HttpContext.Current.Session[UserSessionKey] = userSession;
        }

        public VerificationSession VerificationSession
        {
            get { return HttpContext.Current.Session[VerificationSessionKey] as VerificationSession; }
            set { HttpContext.Current.Session[VerificationSessionKey] = value; }
        }

        public IEnumerable<ClaimsIdentity> ClaimsIdentities
        {
            get => HttpContext.Current.Session[ClaimIdentitiesKey] as IEnumerable<ClaimsIdentity>;
            set => HttpContext.Current.Session[ClaimIdentitiesKey] = value;
        }

        public bool IsPreventDBModification => true;
    }
}