using Fanex.Affiliate.User.Core.BusinessService;
using Fanex.Affiliate.User.Core.CoreService;
using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.DTO.VerificationAccount;
using Fanex.Affiliate.User.Core.Extensions;
using Fanex.Affiliate.User.Core.Filters;
using Fanex.Affiliate.User.Core.MetalModels;
using Fanex.Affiliate.User.Core.MetalModels.Email;
using Fanex.Affiliate.User.Core.Resources;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels;
using System;
using System.Web.Mvc;
using System.Web.UI;

namespace Fanex.Affiliate.User.Core.Controllers
{
    public class VerificationAccountController : AuthBaseController
    {
        private const int CaptchaImgWidth = 74;
        private const int CaptchaImgHeight = 26;

        private readonly IVerificationService _verificationService;

        public VerificationAccountController(
            ISessionService sessionService,
            IAppSetting appSetting,
            ISystemService systemsService,
            ICaptchaService captchaService,
            IAuthService authService,
            IVerificationService verificationService,
            IAccountService accountService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, appSetting, captchaService, authService, accountService, ipLocationService)
        {
            _verificationService = verificationService;
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index()
        {
            var verificationSession = SessionService.VerificationSession;
            if (verificationSession == null)
            {
                return Redirect(Url.RenderLanguageContent("~/Home"));
            }

            var userInfo = AccountService.GetUserInfoById(verificationSession.AffId, false);

            var viewModel = new VerificationAccountViewModel
            {
                Email = EmailHelper.HideEmailPart(userInfo.Email)
            };

            return View("~/Views/VerificationAccount/Index.cshtml", viewModel);
        }

        [HttpGet]
        [OutputCache(NoStore = true, Duration = 0, Location = OutputCacheLocation.None, VaryByParam = "*")]
        public ActionResult CaptchaImage()
        {
            var captcha = Generator.GetRandomString(4);
            if (SessionService.VerificationSession != null)
            {
                SessionService.VerificationSession.Captcha = captcha;
            }

            return File(CaptchaService.GenerateImageBuffer(captcha, CaptchaImgWidth, CaptchaImgHeight, true), "image/png");
        }

        [AjaxOnly]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult SendCode(string email)
        {
            var verificationSession = SessionService.VerificationSession;
            if (verificationSession == null || string.IsNullOrEmpty(email))
            {
                return Json(GetErrorResult(Error.General));
            }

            var sendCodeParam = CreateSendCodeParam();
            sendCodeParam.Email = email;
            var result = _verificationService.SendCode(sendCodeParam);
            if (result.CanSendCode && result.IsValidEmail)
            {
                verificationSession.Counter = result.NewCounter;
                verificationSession.SentCodeTime = result.NewSendCodeTime;
            }
            verificationSession.Token = Guid.NewGuid().ToString();

            return Json(new SendCodeResponse
            {
                CanSendCode = result.CanSendCode,
                IsValidEmail = result.IsValidEmail,
                VerificationToken = verificationSession.Token,
                Action = _verificationService.CreateActionLink(
                    AppSetting.SymmetricPassword,
                    AppSetting.SymmetricSalt,
                    Convert.ToInt32(AppSetting.GetValue("ExpirationCodeInMinute")))
            });
        }

        [AjaxOnly]
        [EncryptedAction]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult VerifyAccount(VerificationAccountParam param)
        {
            var verificationSession = SessionService.VerificationSession;
            if (verificationSession == null)
            {
                return Json(CreateVerifyAccountResult(GetErrorResult(Error.General)));
            }

            var requestValidationResult = ValidateLoginRequest(param.Captcha, verificationSession.Captcha);
            if (!requestValidationResult.IsOk)
            {
                return Json(CreateVerifyAccountResult(requestValidationResult));
            }

            var verificationOtpParam = CreateVerificationOtpParam(param);
            if (_verificationService.IsValidOtp(verificationOtpParam))
            {
                var userParam = CreateUserLoginParam(param.LoginInfo);
                var loginResult = AuthService.GetLoginResult(userParam, false);

                var userInfo = loginResult.UserInfo;
                if (userInfo != null && verificationSession.AffId == userInfo.AffId)
                {
                    if (!IsValidDomain(userInfo.AffType))
                    {
                        return Json(CreateVerifyAccountResult(GetErrorResult(Lang.NotAllowOnDomain)));
                    }

                    if (loginResult.Result.IsOk)
                    {
                        SessionService.VerificationSession = null;
                        AssignLoginInfoAndSetAuth(userInfo, userParam.LoginIp);

                        return Json(CreateVerifyAccountResult(loginResult.Result));
                    }
                }
                return Json(CreateVerifyAccountResult(GetErrorResult(Error.LoginWrongInfo)));
            }

            return Json(CreateVerifyAccountResult(GetErrorResult(Error.VerificationFailed)));
        }

        private SendCodeParam CreateSendCodeParam()
        {
            var verificationSession = SessionService.VerificationSession;

            return new SendCodeParam
            {
                AffId = verificationSession.AffId,
                SentCodeTime = verificationSession.SentCodeTime,
                CurrentLanguage = SessionService.CurrentLanguage,
                IntervalInMinute = Convert.ToInt32(AppSetting.GetValue("SendCodeIntervalInMinute")),
                VerificationEmailParam = new VerificationAccountEmailParam
                {
                    RootDomain = SiteDomainHelper.GetRootUrl(this, AppSetting),
                    Ip = Request.GetClientIP(),
                    CurrentLanguage = SessionService.CurrentLanguage
                }
            };
        }

        private UserLoginParam CreateUserLoginParam(string loginInfo)
        {
            return new UserLoginParam
            {
                LoginInfo = loginInfo,
                LoginIp = Request.GetClientIP(),
                Language = SessionService.CurrentLanguage,
                UserAgent = Request.UserAgent,
                IsVerifyingAccount = true
            };
        }

        private VerificationOtpParam CreateVerificationOtpParam(VerificationAccountParam param)
        {
            var verificationSession = SessionService.VerificationSession;
            var userInfo = AccountService.GetUserInfoById(verificationSession.AffId, false);

            return new VerificationOtpParam
            {
                SecretKey = userInfo.SecretKey,
                Counter = verificationSession.Counter,
                OtpCode = param.Code,
                HashKey = verificationSession.Token,
                HashMessage = param.HashMessage,
                Captcha = param.Captcha,
                LoginInfo = param.LoginInfo,
                AffId = verificationSession.AffId,
                IpAddress = Request.GetClientIP(),
                Language = SessionService.CurrentLanguage,
                UserAgent = Request.UserAgent
            };
        }

        private VerifyAccountResult CreateVerifyAccountResult(ResultInfo result)
        {
            return new VerifyAccountResult
            {
                IsOk = result.IsOk,
                Message = result.Message,
                Action = _verificationService.CreateActionLink(
                    AppSetting.SymmetricPassword,
                    AppSetting.SymmetricSalt,
                    Convert.ToInt32(AppSetting.GetValue("ExpirationCodeInMinute")))
            };
        }
    }
}