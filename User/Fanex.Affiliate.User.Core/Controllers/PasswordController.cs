namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using Constants;
    using CoreService;
    using DTO;
    using Extensions;
    using Filters;
    using MetalModels;
    using MetalModels.Email;
    using Resources;
    using System.Linq;
    using System.Web.Mvc;
    using Utilities;

    public class PasswordController : BaseController
    {
        private const int InvalidUrlAddress = 1001;
        private const int RecoverPasswordFailed = 1002;

        private readonly IAccountService _accountService;
        private readonly ICryptographyService _cryptographyService;
        private readonly IEmailService _mailService;
        private readonly IAppSetting _appSetting;

        public PasswordController(
            ISessionService sessionService,
            IAppSetting appSetting,
            IAccountService accountService,
            ICryptographyService cryptographyService,
            ISystemService systemsService,
            IEmailService mailService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _accountService = accountService;
            _cryptographyService = cryptographyService;
            _mailService = mailService;
            _appSetting = appSetting;
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Forgot(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return Json(new ResultInfo
                {
                    IsOk = false,
                    Message = Lang.ErrEmailRequire
                });
            }

            var code = Generator.GetRandomString(10);
            var param = new UserInfoByEmailParam
            {
                Email = email.Trim(),
                Ip = Request.GetClientIP(),
                ValidCode = code,
                Language = SessionService.CurrentLanguage
            };

            var result = new ResultInfo
            {
                IsOk = true
            };

            var (errorCode, userInfo) = _accountService.GetUserInfoByEmail(param);

            if (errorCode != 0)
            {
                result.IsOk = false;
                result.Message = Common.GetErrorMessage("ForgotPassword", errorCode)
                    ?.Replace("{0}", Url.RenderLanguageContent($"~/{ControllerName.ContactUs}"));
            }
            else
            {
                var recoverEmailParam = new RecoverPasswordEmailParam
                {
                    User = userInfo,
                    MailContact = _appSetting.MailContact,
                    MailTo = param.Email,
                    RootDomain = SiteDomainHelper.GetRootUrl(this, _appSetting),
                    Code = code,
                    CurrentLanguage = SessionService.CurrentLanguage
                };

                _mailService.SendRecoverPasswordEmail(recoverEmailParam);
            }

            return Json(result);
        }

        [HttpGet]
        public ActionResult RecoverPassword(string vid, int uid = 0)
        {
            if (uid == 0 || string.IsNullOrEmpty(vid))
            {
                return RedirectToFixedAction("RecoverPasswordResult", new { isSuccessful = false });
            }
            var newPassword = Generator.GetRandomString(10);
            var param = new PasswordRecoveryParam
            {
                AffId = uid,
                ValidCode = vid,
                NewPassword = CryptographyHelper.Encrypt(newPassword),
                Ip = Request.GetClientIP(),
                Language = SessionService.CurrentLanguage
            };

            var (errorCode, userInfo) = _accountService.RecoverPassword(param);

            var isSuccessful = errorCode == 0;

            if (isSuccessful)
            {
                var recoverEmailParam = new NewPasswordEmailParam
                {
                    User = userInfo,
                    RootDomain = SiteDomainHelper.GetRootUrl(this, _appSetting),
                    NewPassword = newPassword,
                    MailTo = userInfo.Email,
                    MailContact = _appSetting.MailContact,
                    CurrentLanguage = SessionService.CurrentLanguage
                };

                _mailService.SendNewPasswordEmail(recoverEmailParam);
            }

            return RedirectToFixedAction("RecoverPasswordResult", new { isSuccessful, errCode = errorCode });
        }

        public ActionResult RecoverPasswordResult(bool isSuccessful = false, int errCode = 0)
        {
            var errorMsg = Common.GetErrorMessage("RecoverPassword", errCode == RecoverPasswordFailed ? RecoverPasswordFailed : InvalidUrlAddress);
            var result = new ResultInfo
            {
                IsOk = false,
                Message = errorMsg
            };

            if (isSuccessful)
            {
                result.IsOk = true;
                result.Message = $"{Lang.Yourlogindetail}<br>{Lang.Pleasecheckyour}<br>{Lang.ForAnyReason.Replace("{0}", Url.RenderLanguageContent("~/ContactUs"))}";
            }

            return View(result);
        }

        [CustomAuthorize]
        [HttpGet]
        public ActionResult Update()
        {
            ViewBag.PublicKey = _appSetting.RsaPublicKey;

            return View(new UpdatePasswordParam());
        }

        [CustomAuthorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Update(UpdatePasswordParam param)
        {
            var resultInfo = new ResultInfo { IsOk = false };

            if (SessionService.IsInternal)
            {
                resultInfo.Message = Lang.ErrAuthorized;
            }
            else if (ModelState.IsValid)
            {
                param.NewPassword = _cryptographyService.EncryptPassword(_appSetting.RsaPrivateKey, param.NewPassword);
                var confirmedNewPassword = _cryptographyService.EncryptPassword(_appSetting.RsaPrivateKey, param.ConfirmNewPassword);

                if (param.NewPassword != confirmedNewPassword)
                {
                    return Json(new ResultInfo
                    {
                        IsOk = false,
                        Message = Lang.ReenterNewPassw
                    });
                }

                param.OldPassword = _cryptographyService.EncryptPassword(_appSetting.RsaPrivateKey, param.OldPassword);

                param.AffId = SessionService.UserSession.AffId;
                param.Ip = Request.GetClientIP();
                param.Language = SessionService.CurrentLanguage;

                var updateResult = _accountService.UpdatePassword(param);
                resultInfo.IsOk = updateResult.IsOk;
                resultInfo.Message = updateResult.IsOk ? Lang.Passwordchanged : updateResult.Message;
            }
            else
            {
                resultInfo.Message = string.Join("<br>", ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage));
            }

            return Json(resultInfo);
        }

    }
}