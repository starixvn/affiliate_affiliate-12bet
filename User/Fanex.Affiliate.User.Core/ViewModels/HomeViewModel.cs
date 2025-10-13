using Fanex.Affiliate.User.Core.Constants;

namespace Fanex.Affiliate.User.Core.ViewModels
{
    public class HomeViewModel
    {
        public bool IsAuthenticated { get; set; }

        public bool IsShowAlert { get; set; }

        public string SignUpLink { get; set; }

        public string BannerLink { get; set; }

        public string Promotion12BetLink { get; set; }

        public string Language { get; set; }

        public string ShortedLanguageCode => SystemLanguage.GetShortedCodeForTracking(Language);

        public string CurrentCountry { get; set; }
    }
}
