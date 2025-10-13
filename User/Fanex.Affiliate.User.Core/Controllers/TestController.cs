namespace Fanex.Affiliate.User.Core.Controllers
{
    using BusinessService;
    using Constants;
    using CoreService;
    using DTO;
    using Enum;
    using Fanex.Affiliate.User.Core.Apis;
    using Filters;
    using MetalModels.Email;
    using ONEbook.UM.AspNetMVC.Filters;
    using Resources;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Mvc;
    using Utilities;
    using ViewModels;

    [CheckUMFilter]
    [CustomAuthorize]
    public class TestController : BaseController
    {
        private readonly IList<ContactApp> CONTACT_APPS = new List<ContactApp>
        {
            new ContactApp
            {
                Order = 1,
                Name = "Line",
                Value = "abc123"
            },
            new ContactApp
            {
                Order = 3,
                Name = "Email",
                Value = "abc@gmail.com"
            },
            new ContactApp
            {
                Order = 2,
                Name = "Telegram",
                Value = string.Empty
            }
        };

        private readonly IMailProcessor _mailProcessor;
        private readonly IAppSetting _appSetting;
        private readonly ILicenseeApi _licenseeApi;

        private readonly string _mailContact;
        private readonly string _userName;

        public TestController(
            ISessionService sessionService,
            ISystemService systemsService, 
            IAppSetting appSetting,
            IMailProcessor mailProcessor, 
            ILicenseeApi licenseeApi,
            IIpLocationService ipLocationService)
            : base(sessionService, systemsService, ipLocationService)
        {
            _mailProcessor = mailProcessor;
            _appSetting = appSetting;
            _licenseeApi = licenseeApi;
            _mailContact = appSetting.MailContact;
            _userName = sessionService.UserSession?.UserName ?? "12B0000";
        }

        [HttpGet]
        public ActionResult Index()
        {
            if (!IsValidUser())
            {
                return HttpNotFound();
            }

            return View();
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult> AccessApi()
        {
            var message = await _licenseeApi.AccessApi();
            return View(model: message);
        }

        [HttpGet]
        public ActionResult Preview(TestCriteria criteria)
        {
            if (!IsValidUser())
            {
                return HttpNotFound();
            }

            try
            {
                SystemService.SetCulture(criteria.Language);
                ViewBag.Data = GetEmailContent(criteria);

                SystemService.SetCulture(SystemLanguage.DefaultLanguageCode);
            }
            catch (Exception ex)
            {
                ViewBag.Data = ex.Message + "\n" + ex.StackTrace;
            }

            return View();
        }

        [HttpPost]
        public ActionResult SendEmail(TestCriteria criteria)
        {
            if (!IsValidUser())
            {
                return HttpNotFound();
            }

            var success = true;
            var message = string.Empty;

            try
            {
                SystemService.SetCulture(criteria.Language);

                var content = GetEmailContent(criteria);

                _mailProcessor.Send(content, criteria.EmailAddress, GetSubject(criteria.Function));

                SystemService.SetCulture(SystemLanguage.DefaultLanguageCode);
            }
            catch (Exception ex)
            {
                success = false;
                message = ex.Message + "\n" + ex.StackTrace;
            }

            var result = new
            {
                Success = success,
                Message = message
            };

            return Json(result);
        }

        private static string GetSubject(string functionName)
        {
            switch (functionName)
            {
                case TemplateString.ContactUs:
                    return Lang.ContactUs;

                case TemplateString.Csd:
                    return Lang.CsdSubject;

                case TemplateString.RecoverPassword:
                    return Lang.SubjectForgetPass;

                case TemplateString.PaymentCancel:
                    return Lang.PaymentSubject.Replace("{transid}", "12345");

                case TemplateString.PaymentRequest:
                    return Lang.PaymentSubject.Replace("{transid}", "12345");

                case TemplateString.NewPassword:
                    return Lang.SubjectNewPass;

                case TemplateString.Signup:
                    return Lang.RegisSubject;

                case TemplateString.VerificationAccount:
                    return Lang.SubjectVerificationAccount;

                default:
                    return Lang.AffiliateProgram;
            }
        }


        private string GetEmailContent(TestCriteria criteria)
        {
            var isText = criteria.Format == "txt";
            var rootUrl = SiteDomainHelper.GetRootUrl(this, _appSetting);
            var content = string.Empty;

            var model = GetModelByFunction(criteria.Function, rootUrl, criteria.Language, isText) as EmailBaseParam;
            model.ContactInfo = EmailHelper.GetContactInfoContent(model, GetEmailTextContent, _appSetting.EmailBackgroundUrl);

            content = GetEmailTextContent(criteria.Function, criteria.Language, model);

            return isText ? content : GetEmailHtmlContent(content, criteria.Language, criteria.Title, rootUrl);
        }

        private string GetEmailTextContent(string templateName, string preferredLanguage, object model)
        {
            var viewPath = string.Format(TemplateString.EmailTemplatePath, templateName, preferredLanguage);
            var viewPathBackup = string.Format(TemplateString.EmailTemplatePath, templateName, SystemLanguage.DefaultLanguageCode);
            var physicalPath = Server.MapPath(viewPath);
            var physicalPathBackup = Server.MapPath(viewPathBackup);

            return _mailProcessor.BuildTemplateContent(physicalPath, physicalPathBackup, model);
        }

        private string GetEmailHtmlContent(string content, string language, string title, string rootUrl)
        {
            var viewModel = new EmailTemplateViewModel
            {
                RootUrl = rootUrl,
                ImageRootUrl = _appSetting.EmailBackgroundUrl,
                Language = language,
                Content = content,
                Title = title
            };
            var viewPath = Server.MapPath(TemplateString.CommonLayoutEmailTemplatePath);
            var viewPathBackup = viewPath;

            return _mailProcessor.BuildTemplateContent(viewPath, viewPathBackup, viewModel);
        }

        private object GetModelByFunction(string functionName, string rootUrl, string language, bool isText)
        {
            switch (functionName)
            {
                case TemplateString.Csd:
                    return GetCSDModel(rootUrl);

                case TemplateString.RecoverPassword:
                    return GetForgetPasswordModel(rootUrl, language, isText);

                case TemplateString.PaymentCancel:
                    return GetPaymentModel(PaymentRequestType.Cancel, rootUrl, language, isText);

                case TemplateString.PaymentRequest:
                    return GetPaymentModel(PaymentRequestType.Create, rootUrl, language, isText);

                case TemplateString.NewPassword:
                    return GetRecoverPasswordModel(rootUrl, language, isText);

                case TemplateString.Signup:
                    return GetSignupModel(rootUrl, language, isText);

                case TemplateString.VerificationAccount:
                    return GetVerificationAccountModel(rootUrl, language, isText);

                default:
                    return null;
            }
        }

        private object GetCSDModel(string rootUrl)
        {
            return new NoticeEmailParam
            {
                RootDomain = rootUrl,
                UserName = _userName,
                FirstName = "Firs Name",
                LastName = "Last Name",
                SiteUrl = "abc.com.vn",
                MoreSiteUrls = "xyz.com.vn",
                MailContact = _mailContact
            };
        }

        private object GetForgetPasswordModel(string rootUrl, string language, bool isText)
        {
            return new RecoverPasswordEmailParam
            {
                RootDomain = rootUrl,
                User = GetUserInfo(language, isText),
                MailContact = _mailContact,
                Code = "12345",
                MailTo = _mailContact
            };
        }

        private object GetPaymentModel(PaymentRequestType type, string rootUrl, string language, bool isText)
        {
            const long TranId = 1L;
            const decimal Amount = 989;

            return new PaymentEmailParam
            {
                User = GetUserInfo(language, isText),
                MailContact = _mailContact,
                TransId = TranId,
                RequestDate = DateTimeHelper.Gmt8Now,
                Amount = Amount,
                RootDomain = rootUrl,
                MailTo = _mailContact,
                PaymentType = type
            };
        }

        private object GetRecoverPasswordModel(string rootUrl, string language, bool isText)
        {
            return new NewPasswordEmailParam
            {
                User = GetUserInfo(language, isText),
                MailContact = _mailContact,
                NewPassword = "1234aa",
                RootDomain = rootUrl,
                MailTo = _mailContact,
            };
        }

        private object GetSignupModel(string rootUrl, string language, bool isText)
        {
            var contactApp = EmailHelper.GetContactAppInfo(CONTACT_APPS);

            return new EmailSignUpParam
            {
                User = GetUserInfo(language, isText),
                MailContact = _mailContact,
                IMName = contactApp.Name,
                IMValue = contactApp.Value,
                UserNumberContact = "0123456789",
                RootDomain = rootUrl
            };
        }

        private object GetVerificationAccountModel(string rootUrl, string language, bool isText)
        {
            return new VerificationAccountEmailParam
            {
                User = GetUserInfo(language, isText),
                MailContact = _mailContact,
                RootDomain = rootUrl,
                Code = "123456",
                Ip = "127.0.0.1"
            };
        }

        private UserInfo GetUserInfo(string language, bool isText)
        {
            return new UserInfo
            {
                AffId = 1,
                FirstName = "Fisrt name",
                UserName = _userName,
                Email = "abc@nova.com",
                LastName = "Last name",
                MailOption = isText,
                PreferredLanguage = language
            };
        }

        private bool IsValidUser()
        {
            return _appSetting.IsLocal || SessionService.IsInternal || _appSetting.IsDev;
        }
    }

    public class TestCriteria
    {
        public string Language { get; set; }

        public string Title { get; set; }

        public string Function { get; set; }

        public string Format { get; set; }

        public string EmailAddress { get; set; }
    }
}