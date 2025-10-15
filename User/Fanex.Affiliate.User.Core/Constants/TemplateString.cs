
namespace Fanex.Affiliate.User.Core.Constants
{
    public static class TemplateString
    {
        public const string CommonLayoutEmailTemplatePath = "~/Views/Shared/Email/CommonLayout.cshtml";

        public const string EmailTemplatePath = "~/Views/Shared/Email/{0}/Content.{1}.cshtml";

        public const string EmailTemplatePathWithSpecialCountry = "~/Views/Shared/Email/{0}/Content.{1}.{2}.cshtml";

        public const string ContactUs = "ContactUs";

        public const string Csd = "Csd";

        public const string RecoverPassword = "RecoverPassword";

        public const string PaymentCancel = "PaymentCancel";

        public const string PaymentRequest = "PaymentRequest";

        public const string NewPassword = "NewPassword";

        public const string Signup = "Signup";

        public const string VerificationAccount = "VerificationAccount";
    }
}