using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Constants;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.DTO.Auth;
using Fanex.Affiliate.User.Core.Extensions;
using Fanex.Affiliate.User.Core.MetalModels;
using Fanex.Affiliate.User.Core.Resources;
using Fanex.Affiliate.User.Core.Utilities;
using System.Linq;
using System.Web.Mvc;

namespace Fanex.Affiliate.User.Core.Controllers
{
    public class AuthBaseController : BaseController
    {
        protected readonly IAccountService AccountService;

        public AuthBaseController(
            ISessionService sessionService,
            ISystemService systemsService,
            IAppSetting appSetting,
            ICaptchaService captchaService,
            IAuthService authService,
            IAccountService accountService,
            IIpLocationService ipLocationService) : base(sessionService, systemsService, ipLocationService)
        {
            CaptchaService = captchaService;
            AppSetting = appSetting;
            AuthService = authService;
            AccountService = accountService;
        }

        protected ICaptchaService CaptchaService { get; }

        protected IAppSetting AppSetting { get; }

        protected IAuthService AuthService { get; }

        protected ResultInfo ValidateLoginRequest(string inputCaptcha, string sessionCaptcha)
        {
            if (!Request.IsAjaxRequest())
            {
                return GetErrorResult(Lang.ErrAuthorized);
            }

            if (!ModelState.IsValid)
            {
                return GetErrorResult(string.Join(", ", ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage)));
            }

            if (!CaptchaService.IsValid(inputCaptcha, sessionCaptcha, Request.GetClientIP()))
            {
                return GetErrorResult(Lang.ValidationCode);
            }

            return new ResultInfo { IsOk = true };
        }

        protected bool IsValidDomain(string affType)
        {
            return AppSetting.AllowedAffiliateTypes.Any(t => t.Equals(affType));
        }

        protected void AssignLoginInfoAndSetAuth(AuthorizedUserInfo user, string clientIpAddress, int adminId = 0)
        {
            var onUserIdParam = GetOnUserIdParam(user.AffId, clientIpAddress, adminId);
            user.OnUserId = AuthService.GetOnUserId(onUserIdParam);
            var accountInfo = AccountService.GetAccountInfo(user.AffId);

            SessionService.AssignSessions(user);
            SessionService.UserSession.BaseCurrency = accountInfo.DefaultBaseCurrency;
            SessionService.UserSession.IsMarketingAccount = accountInfo.AffCategoryId == AffCategory.Marketing;
            AuthService.SignIn(user.UserName, false);
        }

        protected ResultInfo GetErrorResult(string message)
        {
            return new ResultInfo
            {
                IsOk = false,
                Message = message
            };
        }

        private OnUserIdParam GetOnUserIdParam(int affId, string clientIpAddress, int adminId)
        {
            return new OnUserIdParam
            {
                CustId = affId,
                ServerId = AppSetting.ServerId,
                Ip = clientIpAddress,
                NetSessionId = HttpContext.Session.SessionID,
                SubAccId = adminId,
                IsInternal = SessionService.IsInternal
            };
        }
    }
}