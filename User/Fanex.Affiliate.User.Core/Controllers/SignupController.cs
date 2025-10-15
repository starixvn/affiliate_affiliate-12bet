namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using CoreService;
    using DTO;
    using Extensions;
    using Filters;
    using MetalModels;
    using MetalModels.Email;
    using Newtonsoft.Json;
    using Resources;
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Mvc;
    using Utilities;

    public class SignupController : BaseController
    {
        private readonly IAccountService _accountService;
        private readonly IAppSetting _appSetting;
        private readonly ICaptchaService _captchaService;
        private readonly ISecurityQuestionService _securityQuestionService;

        private const string ParentCodeCookieName = "Fanex.UserSite.RefCode";
        private const int CookieTimeOut = 6;

        public SignupController(
            ISessionService sessionService,
            IAppSetting appSetting,
            IAccountService accountService,
            ISystemService systemsService,
            ICaptchaService captchaService,
            ISecurityQuestionService securityQuestionService,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _accountService = accountService;
            _captchaService = captchaService;
            _appSetting = appSetting;
            _securityQuestionService = securityQuestionService;
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index(string affCode = null)
        {
            const string viewPath = "~/Views/Signup/Index.cshtml";
            if (string.IsNullOrEmpty(affCode))
            {
                return View(viewPath, new UserSignUpParam());
            }

            var affInfo = new GeneralAffInfo();

            if (int.TryParse(affCode, out _))
            {
                affInfo = _accountService.GetGeneralAffInfo(affCode: affCode);
            }

            if (affInfo.IsValidAff)
            {
                SetCookie(affInfo.AffCode);

                return View(viewPath, new UserSignUpParam());
            }

            return View(viewPath, new UserSignUpParam { IsValidParentCode = false });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Index(UserSignUpParam param)
        {
            var result = await ValidateAndProcessSignup(param);
            return Json(result);
        }

        [HttpGet]
        [ChildActionOnly]
        public ActionResult SecurityQuestion()
        {
            var model = _securityQuestionService.GetSecurityQuestions(SessionService.CurrentLanguage);

            return PartialView("~/Views/Signup/_SecurityQuestion.cshtml", model);
        }

        private void SetCookie(string parentAffCode)
        {
            var cookie = new HttpCookie(ParentCodeCookieName)
            {
                HttpOnly = true,
                Expires = DateTimeHelper.UtcNow.AddHours(CookieTimeOut),
                Value = parentAffCode
            };

            HttpContext.Response.Cookies.Add(cookie);
        }

        private async Task<ResultInfo> ValidateAndProcessSignup(UserSignUpParam param)
        {
            if (!IsValidCaptcha(param.Captcha))
            {
                return new ResultInfo { IsOk = false, Message = Lang.ValidationCode };
            }

            var contactAppValidation = AppContactHelper.ValidateAppContactList(param.ContactAppList, SessionService.CurrentLanguage);
            if (!contactAppValidation.IsOk)
            {
                return contactAppValidation;
            }

            if (!ModelState.IsValid)
            {
                return GetModelStateErrors();
            }

            var signUpParam = CreateSignUpParam(param);
            var emailParam = CreateEmailParam(param);

            return await _accountService.CreateAffiliateAsync(signUpParam, emailParam);
        }

        private bool IsValidCaptcha(string captcha)
        {
            return _captchaService.IsValid(captcha, SessionService.SignUpCaptchaCode, Request.GetClientIP());
        }

        private ResultInfo GetModelStateErrors()
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);

            return new ResultInfo
            {
                IsOk = false,
                Message = string.Join("<br>", errors)
            };
        }

        private UserSignUpParam CreateSignUpParam(UserSignUpParam param)
        {
            var affParentCode = HttpContext.Request.Cookies[ParentCodeCookieName]?.Value;
            return new UserSignUpParam
            {
                FirstName = Server.HtmlEncode(param.FirstName),
                LastName = Server.HtmlEncode(param.LastName),
                Email = Server.HtmlEncode(param.Email),
                Phone = Server.HtmlEncode(param.Phone),
                Address = Server.HtmlEncode(param.Address),
                City = Server.HtmlEncode(param.City),
                Postal = Server.HtmlEncode(param.Postal),
                Country = Server.HtmlEncode(param.Country),
                SiteUrl = Server.HtmlEncode(param.SiteUrl),
                MoreSiteUrls = Server.HtmlEncode(param.MoreSiteUrls),
                NoSiteDesc = Server.HtmlEncode(param.NoSiteDesc),
                TargetCountryCode = Server.HtmlEncode(param.TargetCountryCode),
                PreferredLanguage = Server.HtmlEncode(param.PreferredLanguage),
                QuestionId = param.QuestionId,
                Answer = Server.HtmlEncode(param.Answer),
                Player_UserName = Server.HtmlEncode(param.Player_UserName),
                ContactApps = JsonConvert.SerializeObject(param.ContactAppList.Select(p => new ContactApp
                {
                    Name = Server.HtmlEncode(p.Name),
                    Value = Server.HtmlEncode(p.Value),
                    Order = p.Order
                })),
                Gender = param.Gender,
                State = Server.HtmlEncode(param.State),
                Language = SessionService.CurrentLanguage,
                AffType = _appSetting.AllowedAffiliateTypes.FirstOrDefault(),
                Ip = Request.GetClientIP(),
                IsLocal = _appSetting.IsLocal,
                AffParentCode = affParentCode
            };
        }

        private EmailSignUpParam CreateEmailParam(UserSignUpParam param)
        {
            var contactApp = EmailHelper.GetContactAppInfo(param.ContactAppList);
            return new EmailSignUpParam
            {
                MailContact = _appSetting.MailContactByCountry(param.TargetCountryCode),
                RootDomain = SiteDomainHelper.GetRootUrl(this, _appSetting),
                MailTo = _appSetting.MailContactByCountry(param.TargetCountryCode),
                IMName = contactApp.Name,
                IMValue = contactApp.Value,
                UserNumberContact = param.Phone,
                CurrentLanguage = SessionService.CurrentLanguage
            };
        }
    }
}