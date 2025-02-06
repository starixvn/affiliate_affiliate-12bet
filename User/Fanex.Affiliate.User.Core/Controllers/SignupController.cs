namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using CoreService;
    using DTO;
    using Fanex.Affiliate.User.Core.Extensions;
    using Fanex.Affiliate.User.Core.Filters;
    using MetalModels;
    using MetalModels.Email;
    using Newtonsoft.Json;
    using Resources;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;
    using Utilities;

    public class SignupController : BaseController
    {
        private readonly IAccountService _accountService;
        private readonly IAppSetting _appSetting;
        private readonly ICaptchaService _captchaService;
        private readonly ISecurityQuestionService _securityQuestionService;

        public SignupController(
            ISessionService sessionService,
            IAppSetting appSetting,
            IAccountService accountService,
            ISystemService languageService,
            ICaptchaService captchaService,
            ISecurityQuestionService securityQuestionService) : base(sessionService, languageService)
        {
            _accountService = accountService;
            _captchaService = captchaService;
            _appSetting = appSetting;
            _securityQuestionService = securityQuestionService;
        }

        [HttpGet]
        [LanguageRouteChecking]
        public ActionResult Index()
        {
            return View(new UserSignUpParam());
        }

        [HttpGet]
        [ChildActionOnly]
        public ActionResult SecurityQuestion()
        {
            var model = _securityQuestionService.GetSecurityQuestions(SessionService.CurrentLanguage);

            return PartialView("~/Views/Signup/_SecurityQuestion.cshtml", model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [PreventAccess]
        public ActionResult Index(UserSignUpParam param)
        {
            if (SessionService.IsPreventDBModification)
            {
                return Json(GetErrorResult(Lang.ErrAuthorized));
            }

            var result = new ResultInfo { IsOk = false };
            if (!_captchaService.IsValid(param.Captcha, SessionService.SignUpCaptchaCode, Request.GetClientIP()))
            {
                result.Message = Lang.ValidationCode;
            }
            else if (!IsValidAppContactList(param.ContactAppList))
            {
                result.Message = Error.RequireIMAccount;
            }
            else if (ModelState.IsValid)
            {
                var signUpParam = new UserSignUpParam
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
                    IsLocal = _appSetting.IsLocal
                };

                var contactApp = EmailHelper.GetContactAppInfo(param.ContactAppList);
                var emailParam = new EmailSignUpParam
                {
                    MailContact = _appSetting.MailContact,
                    RootDomain = SiteDomainHelper.GetRootUrl(this, _appSetting),
                    MailTo = _appSetting.MailContact,
                    IMName = contactApp.Name,
                    IMValue = contactApp.Value,
                    UserNumberContact = param.Phone,
                    CurrentLanguage = SessionService.CurrentLanguage
                };

                result = _accountService.CreateAffiliate(signUpParam, emailParam);
            }
            else
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                result.Message = string.Join("<br>", errors);
            }

            return Json(result);
        }

        private static bool IsValidAppContactList(IEnumerable<ContactApp> contactAppList)
        {
            return contactAppList != null && !contactAppList.All(c => string.IsNullOrEmpty(c.Value));
        }
    }
}