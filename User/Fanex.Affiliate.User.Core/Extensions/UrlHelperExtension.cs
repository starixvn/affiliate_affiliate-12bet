namespace Fanex.Affiliate.User.Core.Extensions
{
    using System.IO;
    using System.Web.Hosting;
    using System.Web.Mvc;
    using BusinessService;
    using Utilities;

    public static class UrlHelperExtension
    {
        private static readonly IAppSetting appSetting = DependencyResolver.Current.GetService<IAppSetting>();
        private static readonly ISystemService systemService = DependencyResolver.Current.GetService<ISystemService>();

        public static string RenderLink(this UrlHelper urlHelper, string bundleVirtualPath)
        {
            var link =  urlHelper.Content(appSetting.IsLocal ? bundleVirtualPath : RegexHelper.Replace(bundleVirtualPath, @"\.(js|css)$", ".min.$1"));
            var version = GenerateContentVersion(bundleVirtualPath);
            return $"{link}?v={version}";
        }

        public static string RenderLanguageContent(this UrlHelper urlHelper, string bundleVirtualPath)
        {
            var favoriteShortedLanguage = systemService.GetFavoriteShortedLanguage();

            return urlHelper.Content(RegexHelper.Replace(bundleVirtualPath, @"^\~/", $"~/{favoriteShortedLanguage}/"));
        }

        private static string GenerateContentVersion(string contentPath)
        {
            const string format = "MMddyyyy_HHmm";
            var fullPathFile = HostingEnvironment.MapPath(contentPath);
            var version = File.GetLastWriteTime(fullPathFile).ToString(format);
            return version;
        }
    }
}
