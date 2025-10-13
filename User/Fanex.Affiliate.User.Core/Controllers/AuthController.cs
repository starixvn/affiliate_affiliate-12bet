using System;
using System.Web.Mvc;
using System.Web.UI;
using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.Constants;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.DTO.VerificationAccount;
using Fanex.Affiliate.User.Core.Extensions;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels;
using Fanex.Affiliate.User.Core.Resources;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels;

namespace Fanex.Affiliate.User.Core.Controllers
{
    public class AuthController : AuthBaseController
    {
        private const int CaptchaImgWidth = 46;
        private const int CaptchaImgHeight = 20;

        public AuthController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemsService,
            IAuthService authService,
            ICaptchaService captchaService,
            IAccountService accountService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, appSetting, captchaService, authService, accountService, ipLocationService)
        {
        }

        [ChildActionOnly]
        [HttpGet]
        [AllowAnonymous]
        public ActionResult AuthenticationForm()
        {
            var viewModel = new AuthenticationFormViewModel
            {
                IsAuthenticated = User.Identity.IsAuthenticated && SessionService.UserSession != null
            };

            if (viewModel.IsAuthenticated)
            {
                viewModel.UserName = SessionService.UserSession?.UserName;
            }
            else
            {
                viewModel.PublicKey = AppSetting.RsaPublicKey;
            }

            return View("~/Views/Auth/AuthenticationForm.cshtml", viewModel);
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        [AllowAnonymous]
        public ActionResult SignIn([Bind(Include = "LoginInfo,ValidationKey")] UserLoginParam userParam)
        {
            if (SessionService.VerificationSession != null)
            {
                return Json(new LoginResultInfo { IsOk = false, ShouldVerifyAccount = true });
            }

            var requestValidation = ValidateLoginRequest(userParam.ValidationKey, SessionService.CaptchaCode);
            if (!requestValidation.IsOk)
            {
                return Json(requestValidation);
            }

            userParam.LoginIp = Request.GetClientIP();
            userParam.Language = SessionService.CurrentLanguage;
            userParam.UserAgent = Request.UserAgent;
            userParam.IsVerifyingAccount = false;
            userParam.LoginInfo = Uri.UnescapeDataString(userParam.LoginInfo);
            var loginResult = AuthService.GetLoginResult(userParam, false);

            if (loginResult.Result.ShouldVerifyAccount)
            {
                SessionService.VerificationSession = new VerificationSession { AffId = loginResult.UserInfo.AffId, PreferredLanguage = loginResult.UserInfo.PreferredLanguage };
                return Json(loginResult.Result);
            }

            var userInfo = loginResult.UserInfo;
            if (userInfo != null)
            {
                if (IsInvalidCountryAccess(userInfo.TargetCountryCode, SessionService.CountryByIp))
                {
                    return Json(GetErrorResult(Lang.NotAllowOnCountry));
                }

                if (!IsValidDomain(userInfo.AffType))
                {
                    return Json(GetErrorResult(Lang.NotAllowOnDomain));
                }

                if (loginResult.Result.IsOk)
                {
                    AssignLoginInfoAndSetAuth(userInfo, userParam.LoginIp);
                }
            }

            return Json(loginResult.Result);
        }

        [HttpGet]
        public ActionResult SignOut()
        {
            DoSignOut();

            return Redirect(Url.RenderLanguageContent("~/Home"));
        }

        [HttpGet]
        [SkipGeoDomainRedirect]
        public ActionResult AdminLogin(InternalLoginModel loginParam)
        {
            if (ModelState.IsValid)
            {
                var adminSessionId = AuthService.GetSessionId(loginParam.AccOnId);
                var hashedPassword = Generator.GenerateSHA512String(adminSessionId + loginParam.ChalengeStr);
                if (string.Equals(loginParam.AccKey, hashedPassword))
                {
                    var clientIpAddress = Request.GetClientIP();
                    var userLoginParam = new UserLoginParam
                    {
                        UserName = loginParam.CustName,
                        LoginIp = clientIpAddress,
                        Language = SessionService.CurrentLanguage,
                        UserAgent = Request.UserAgent,
                        IsVerifyingAccount = false
                    };

                    SessionService.IsInternal = true;
                    var loginResult = AuthService.GetLoginResult(userLoginParam, true);
                    var user = loginResult.UserInfo;

                    if (loginResult.Result.IsOk && user != null && IsValidDomain(user.AffType))
                    {
                        var adminId = loginParam.AccId * -1;
                        AssignLoginInfoAndSetAuth(user, clientIpAddress, adminId);
                    }
                    else
                    {
                        return Redirect(Url.RenderLanguageContent("~/Notify/PageNotFound"));
                    }
                }
                else
                {
                    return Redirect(Url.RenderLanguageContent("~/Notify/PageNotFound"));
                }
            }

            return Redirect(Url.RenderLanguageContent("~/UserPanel/Main/#AccountOverView"));
        }

        [HttpGet]
        [OutputCache(NoStore = true, Duration = 0, Location = OutputCacheLocation.None)]
        [CustomAuthorize]
        public ActionResult ReCheckin()
        {
            var onUserId = SessionService.UserSession.OnUserId;
            var isKickOut = onUserId > 0 && AuthService.Recheckin(SessionService.UserSession.OnUserId, SessionService.IsInternal);

            if (isKickOut)
            {
                DoSignOut();
            }

            return Json(new
            {
                IsKickOut = isKickOut,
                Message = isKickOut ? Lang.Msgkickout : string.Empty
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        [OutputCache(NoStore = true, Duration = 0, Location = OutputCacheLocation.None, VaryByParam = "*")]
        public ActionResult CaptchaImage(byte type = 0)
        {
            var captcha = CaptchaService.GenerateCaptcha();
            if (type == 0)
            {
                SessionService.CaptchaCode = captcha;
            }
            else
            {
                SessionService.SignUpCaptchaCode = captcha;
            }

            return File(CaptchaService.GenerateImageBuffer(captcha, CaptchaImgWidth, CaptchaImgHeight), "image/png");
        }

        private void DoSignOut()
        {
            Session.Clear();
            AuthService.SignOut();
        }

        private bool IsInvalidCountryAccess(string targetCountryCode, string countryByIp)
        {
            bool isCountryShortEmpty = string.IsNullOrEmpty(countryByIp) || countryByIp == SystemLanguage.DefaultCountryByIp;
            bool isTargetCountrySpecial = SystemLanguage.SpecialCountry.ContainsKey(targetCountryCode);

            // Case 1: IP country not detected
            if (isCountryShortEmpty)
            {
                // Invalid only if target is special (restricted access)
                return isTargetCountrySpecial;
            }

            bool isCountryShortSpecial = SystemLanguage.SpecialCountry.ContainsKey(countryByIp);

            // Case 2: IP country is special → only valid if target matches
            if (isCountryShortSpecial)
            {
                return targetCountryCode != countryByIp;
            }

            // Case 3: IP country is normal → valid if both are normal (not special)
            return isTargetCountrySpecial;
        }
    }
}