using Fanex.Affiliate.User.Core.Constants;
using Fanex.Affiliate.User.Core.Enum;
using Fanex.Affiliate.User.Core.MetalModels;
using Fanex.Affiliate.User.Core.MetalModels.Email;
using Fanex.Affiliate.User.Core.Resources;
using Fanex.Affiliate.User.Core.Utilities;
using Fanex.Affiliate.User.Core.ViewModels;
using System.Web;

namespace Fanex.Affiliate.User.Core.BusinessService
{
    public class EmailService : IEmailService
    {
        private readonly IAppSetting _appSetting;
        private readonly IMailProcessor _mailProcessor;
        private readonly ISystemService _systemsService;

        public EmailService(
            IAppSetting appSetting,
            IMailProcessor mailProcessor,
            ISystemService systemsService)
        {
            _appSetting = appSetting;
            _mailProcessor = mailProcessor;
            _systemsService = systemsService;
        }
        public void SendRecoverPasswordEmail(RecoverPasswordEmailParam emailParam)
        {
            emailParam.ContactInfo = GetContactInfoContent(emailParam);
            var preferredLanguage = emailParam.User.PreferredLanguage;
            var emailContent = GetEmailTextContent(TemplateString.RecoverPassword, preferredLanguage, emailParam);

            HandleSetCulture(preferredLanguage);
            if (!emailParam.User.MailOption)
            {
                emailContent = GetEmailHtmlContent(emailContent, Lang.EmailTitlePasswordRecovery, preferredLanguage, emailParam.RootDomain);
            }

            _mailProcessor.Send(emailContent, emailParam.MailTo, Lang.SubjectForgetPass);
            _systemsService.SetCulture(emailParam.CurrentLanguage);
        }

        public void SendNewPasswordEmail(NewPasswordEmailParam emailParam)
        {
            emailParam.ContactInfo = GetContactInfoContent(emailParam);
            var preferredLanguage = emailParam.User.PreferredLanguage;
            var emailContent = GetEmailTextContent(TemplateString.NewPassword, preferredLanguage, emailParam);

            HandleSetCulture(preferredLanguage);
            if (!emailParam.User.MailOption)
            {
                emailContent = GetEmailHtmlContent(emailContent, Lang.EmailTitleNewPassword, preferredLanguage, emailParam.RootDomain);
            }

            _mailProcessor.Send(emailContent, emailParam.MailTo, Lang.SubjectNewPass);
            _systemsService.SetCulture(emailParam.CurrentLanguage);
        }

        public void SendPaymentEmail(PaymentEmailParam emailParam)
        {
            emailParam.ContactInfo = GetContactInfoContent(emailParam);
            var templateName = emailParam.PaymentType == PaymentRequestType.Cancel ? TemplateString.PaymentCancel : TemplateString.PaymentRequest;
            var preferredLanguage = emailParam.User.PreferredLanguage;
            var emailContent = GetEmailTextContent(templateName, preferredLanguage, emailParam);

            HandleSetCulture(preferredLanguage);
            if (!emailParam.User.MailOption)
            {
                emailContent = GetEmailHtmlContent(emailContent, Lang.EmailTitlePayment, preferredLanguage, emailParam.RootDomain);
            }

            var subject = Lang.PaymentSubject.Replace("{transid}", emailParam.TransId.ToString());
            _mailProcessor.Send(emailContent, emailParam.MailTo, subject);
            _systemsService.SetCulture(emailParam.CurrentLanguage);
        }

        public void SendSignUpEmail(EmailSignUpParam emailParam)
        {
            emailParam.ContactInfo = GetContactInfoContent(emailParam);
            var preferredLanguage = emailParam.User.PreferredLanguage;
            var emailContent = GetEmailTextContent(TemplateString.Signup, preferredLanguage, emailParam);

            HandleSetCulture(preferredLanguage);
            if (!emailParam.User.MailOption)
            {
                emailContent = GetEmailHtmlContent(emailContent, Lang.EmailTitleSignUp, preferredLanguage, emailParam.RootDomain);
            }

            _mailProcessor.Send(emailContent, emailParam.MailTo, Lang.RegisSubject);
            _systemsService.SetCulture(emailParam.CurrentLanguage);
        }

        public void SendNoticeEmailToCsd(NoticeEmailParam emailParam)
        {
            var emailContent = GetEmailTextContent(TemplateString.Csd, SystemLanguage.DefaultLanguageCode, emailParam);
            var subject = string.Format(Lang.CsdSubject, emailParam.UserName);

            _mailProcessor.Send(emailContent, emailParam.MailTo, subject);
        }

        public void SendContactUsEmail(EmailBaseParam emailParam, ContactUsParam model)
        {
            var emailContent = GetEmailTextContent(TemplateString.ContactUs, SystemLanguage.DefaultLanguageCode, model);
            var subject = $"12Bet Affiliates - Contact Us - {model.Subject}";

            _mailProcessor.Send(emailContent, emailParam.MailTo, subject);
        }

        public void SendVerificationEmail(VerificationAccountEmailParam emailParam)
        {
            emailParam.ContactInfo = GetContactInfoContent(emailParam);
            var preferredLanguage = emailParam.User.PreferredLanguage;
            var emailContent = GetEmailTextContent(TemplateString.VerificationAccount, preferredLanguage, emailParam);

            HandleSetCulture(preferredLanguage);
            if (!emailParam.User.MailOption)
            {
                emailContent = GetEmailHtmlContent(emailContent, Lang.EmailTittleVerificationAccount, preferredLanguage, emailParam.RootDomain);
            }

            _mailProcessor.Send(emailContent, emailParam.MailTo, Lang.SubjectVerificationAccount, true);
            _systemsService.SetCulture(emailParam.CurrentLanguage);
        }

        private string GetEmailTextContent(string templateName, string preferredLanguage, object model)
        {
            return BuildEmailTextContent(templateName, preferredLanguage, null, model);
        }

        private string GetEmailContactTextContent(string templateName, string preferredLanguage, string countryCode, object model)
        {
            return BuildEmailTextContent(templateName, preferredLanguage, countryCode, model);
        }

        private string BuildEmailTextContent(string templateName, string preferredLanguage, string countryCode, object model)
        {
            string viewPath;

            if (!string.IsNullOrEmpty(countryCode) && SystemLanguage.SpecialCountry.ContainsKey(countryCode))
            {
                viewPath = string.Format(TemplateString.EmailTemplatePathWithSpecialCountry, templateName, preferredLanguage, countryCode);
            }
            else
            {
                viewPath = string.Format(TemplateString.EmailTemplatePath, templateName, preferredLanguage);
            }

            var viewPathBackup = string.Format(TemplateString.EmailTemplatePath, templateName, SystemLanguage.DefaultLanguageCode);
            var physicalPath = HttpContext.Current.Server.MapPath(viewPath);
            var physicalPathBackup = HttpContext.Current.Server.MapPath(viewPathBackup);

            return _mailProcessor.BuildTemplateContent(physicalPath, physicalPathBackup, model);
        }

        private string GetEmailHtmlContent(string content, string title, string language, string domain)
        {
            var viewModel = new EmailTemplateViewModel
            {
                RootUrl = domain,
                ImageRootUrl = _appSetting.EmailBackgroundUrl,
                Language = language,
                Content = content,
                Title = title
            };
            var viewPath = HttpContext.Current.Server.MapPath(TemplateString.CommonLayoutEmailTemplatePath);
            var viewPathBackup = viewPath;

            return _mailProcessor.BuildTemplateContent(viewPath, viewPathBackup, viewModel);
        }

        private void HandleSetCulture(string preferredLanguage)
        {
            var userLang = _systemsService.IsValid(preferredLanguage) ? preferredLanguage : SystemLanguage.DefaultLanguageCode;
            _systemsService.SetCulture(userLang);
        }

        public string GetContactInfoContent(EmailBaseParam param)
        {
            return EmailHelper.GetContactInfoContent(param, GetEmailContactTextContent, _appSetting.EmailBackgroundUrl);
        }
    }
}
