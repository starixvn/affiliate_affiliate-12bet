namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using CoreService;
    using Fanex.Affiliate.User.Core.DTO;
    using Fanex.Affiliate.User.Core.Extensions;
    using Fanex.Affiliate.User.Core.MetalModels;
    using Fanex.Affiliate.User.Core.MetalModels.Email;
    using Fanex.Affiliate.User.Core.Resources;
    using Fanex.Affiliate.User.Core.Utilities;
    using Filters;
    using System.Linq;
    using System.Web.Mvc;

    public class ContactUsController : BaseController
    {
        private readonly IContactService _contactService;

        private readonly IAccountService _accountService;

        private readonly ICaptchaService _captchaService;

        private readonly IAppSetting _appSetting;

        public ContactUsController(
            ISessionService sessionService,
            ISystemService systemsService,
            IAppSetting appSetting,
            IContactService contactService,
            IAccountService accountService,
            ICaptchaService captchaService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _contactService = contactService;
            _accountService = accountService;
            _captchaService = captchaService;
            _appSetting = appSetting;
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index()
        {
            ViewBag.CurrentLanguage = SessionService.CurrentLanguage;
            ViewBag.IsInternal = SessionService.IsInternal;

            if (SessionService.UserSession == null)
            {
                return View();
            }

            var model = _accountService.GetUserInfoById(SessionService.UserSession.AffId, SessionService.IsInternal);

            var userInfo = new UserInfo
            {
                AffId = model.AffId,
                FirstName = Server.HtmlDecode(model.FirstName),
                LastName = Server.HtmlDecode(model.LastName),
                Email = Server.HtmlDecode(model.Email),
                MailOption = model.MailOption,
                PreferredLanguage = model.PreferredLanguage,
                SecretKey = model.SecretKey,
                UserName = model.UserName
            };

            return View(userInfo);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index(ContactUsParam param)
        {
            var result = new ResultInfo { IsOk = false };
            var clientIP = Request.GetClientIP();

            if (SessionService.IsUnauthorized)
            {
                result.Message = Lang.ErrAuthorized;
            }
            else if (!_captchaService.IsValid(param.Captcha, SessionService.SignUpCaptchaCode, clientIP))
            {
                result.Message = Lang.ValidationCode;
            }
            else if (ModelState.IsValid)
            {
                param.Sender = Server.HtmlEncode(param.Sender);
                param.Email = Server.HtmlEncode(param.Email);
                param.Affiliate = Server.HtmlEncode(param.Affiliate);
                param.Subject = Server.HtmlEncode(param.Subject);
                param.Content = Server.HtmlEncode(param.Content);
                param.Creator = SessionService.UserSession == null ? -1 : SessionService.UserSession.AffId;
                param.Ip = clientIP;
                param.SessionId = Session.SessionID;
                param.Browser = Request.Browser.Browser;

                var emailParam = new EmailBaseParam
                {
                    MailTo = _appSetting.MailContact
                };

                result = _contactService.SendRequest(param, emailParam);
            }
            else
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                result.Message = string.Join("<br>", errors);
            }

            return Json(result);
        }
    }
}