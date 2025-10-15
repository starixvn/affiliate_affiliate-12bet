using Fanex.Affiliate.User.Core.DTO;
using Fanex.Affiliate.User.Core.MetalModels.Email;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Fanex.Affiliate.User.Core.Utilities
{
    public static class EmailHelper
    {
        private const int PRIORITY_1 = 2;
        private const int PRIORITY_2 = 1;
        private const int PRIORITY_3 = 3;
        private const int MandatoryLengthForSplittingEmail = 2;

        private const string ContactInfoHtml = "ContactInfo/Html";
        private const string ContactInfoText = "ContactInfo/Text";

        public static string HideEmailPart(string email, int emailLengthToCheck = 8)
        {
            var emailParts = email.Split(new[] { '@' }, StringSplitOptions.RemoveEmptyEntries);
            if (emailParts.Length != MandatoryLengthForSplittingEmail)
            {
                return string.Empty;
            }

            var emailName = emailParts[0];
            var emailSuffix = emailParts[1];

            var newEmailName = emailName.Length > emailLengthToCheck ?
                ReplaceEmailName(emailName, 4, 1) :
                ReplaceEmailName(emailName, 1, 0);

            return newEmailName + "@" + emailSuffix;
        }

        public static string GetContactInfoContent(EmailBaseParam param, Func<string, string, string, object, string> getEmailContactTextContent, string emailBackgroundUrl)
        {
            if (param?.User is null)
            {
                return string.Empty;
            }

            var contactInfoTemplateName = param.User.MailOption ? ContactInfoText : ContactInfoHtml;
            return getEmailContactTextContent(contactInfoTemplateName, param.User.PreferredLanguage, param.User.TargetCountryCode, emailBackgroundUrl);
        }

        public static ContactApp GetContactAppInfo(IEnumerable<ContactApp> contactAppList)
        {
            var contactApp = contactAppList.FirstOrDefault(c => c.Order == PRIORITY_1);

            if (string.IsNullOrEmpty(contactApp?.Value))
            {
                contactApp = contactAppList.FirstOrDefault(c => c.Order == PRIORITY_2);
            }

            return string.IsNullOrEmpty(contactApp?.Value)
                ? contactAppList.FirstOrDefault(c => c.Order == PRIORITY_3)
                : contactApp;
        }

        private static string ReplaceEmailName(string emailName, int charLengthToShow, int startIndex)
        {
            var hiddenCharCount = emailName.Length - charLengthToShow;
            var stringReplace = new string('*', hiddenCharCount);
            var convertedEmailName = emailName
                .Remove(startIndex, hiddenCharCount)
                .Insert(startIndex, stringReplace);

            return convertedEmailName;
        }
    }
}
