using System.IO;
using System.Web.Hosting;
using System.Web.Mvc;

namespace Fanex.Affiliate.Admin.Core.Extensions
{
    public static class UrlHelperExtension
    {
        public static string VersionedLink(this UrlHelper urlHelper, string virtualPath)
        {
            var link = urlHelper.Content(virtualPath);

            var version = GenerateContentVersion(link);
            return $"{link}?v={version}";
        }

        private static string GenerateContentVersion(string contentPath)
        {
            const string format = "MMddyyyy_HHmmss";
            var fullPathFile = HostingEnvironment.MapPath(contentPath);
            var version = File.GetLastWriteTime(fullPathFile).ToString(format);
            return version;
        }
    }
}
