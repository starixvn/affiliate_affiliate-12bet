using Fanex.Affiliate.User.Core.DTO.Auth;
using Fanex.Affiliate.User.Core.DTO.VerificationAccount;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace Fanex.Affiliate.User.Core.CoreService
{
    public interface ISessionService
    {
        UserSession UserSession { get; }

        string CaptchaCode { get; set; }

        string CurrentLanguage { get; set; }

        bool IsInternal { get; set; }

        string SignUpCaptchaCode { get; set; }

        string PrivateKey { get; set; }

        void AssignSessions(AuthorizedUserInfo authorizedUser);

        VerificationSession VerificationSession { get; set; }

        IEnumerable<ClaimsIdentity> ClaimsIdentities { get; set; }

        DateTime? LastestRequestTime { get; set; }

        bool IsOpenedFeedback { get; set; }

        bool IsPreventDBModification { get; }
    }
}