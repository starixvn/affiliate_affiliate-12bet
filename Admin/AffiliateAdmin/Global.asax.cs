using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Utilities;
using Fanex.Data;
using System;
using System.Configuration;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.SessionState;

namespace AffiliateAdmin
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            MvcHandler.DisableMvcResponseHeader = true;

            IoCConfig.Register();
            LoggingConfig.RegisterSentry();
            // RedisConfig.RegisterRedis();

            SslConfig.RegisterHttpSecurityProtocol();

            UMConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            DbSettingProviderManager
                    .StartNewSession()
                    .Register(false)
                    .Run();


            AreaRegistration.RegisterAllAreas();
        }

        protected void Application_BeginRequest()
        {
            try
            {
                // Check if landing page framing is enabled
                var enableFraming = ConfigurationManager.AppSettings["EnableLandingPageFraming"];
                if (string.Equals(enableFraming, "true", StringComparison.OrdinalIgnoreCase))
                {
                    var landingPageUrl = ConfigurationManager.AppSettings["LandingPageUrl"];
                    var additionalFrameSources = ConfigurationManager.AppSettings["CSP.AdditionalFrameSources"];
                    
                    if (!string.IsNullOrEmpty(landingPageUrl))
                    {
                        // Extract the domain from the landing page URL for CSP
                        var uri = new Uri(landingPageUrl);
                        var landingDomain = $"{uri.Scheme}://{uri.Host}";
                        
                        // Build frame sources list
                        var frameSources = $"'self' {landingDomain}";
                        if (!string.IsNullOrEmpty(additionalFrameSources))
                        {
                            frameSources += $" {additionalFrameSources}";
                        }
                        frameSources += " https:";
                        
                        // Add CSP header to allow framing landing page domain
                        // This allows iframes to load content from the landing page domain
                        var cspPolicy = $"default-src 'self' blob: data:; " +
                                       $"frame-src {frameSources}; " +
                                       $"script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:; " +
                                       $"style-src 'self' 'unsafe-inline' blob: data:; " +
                                       $"img-src 'self' blob: data: https:; " +
                                       $"connect-src 'self' {landingDomain} https:;";
                        
                        Response.Headers.Add("Content-Security-Policy", cspPolicy);
                        
                        // Also set X-Frame-Options to allow same origin framing
                        Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
                    }
                }
            }
            catch (Exception ex)
            {
                // Log error but don't break the application
                LogHelper.WriteError(ex);
            }
        }

        void Application_End(object sender, EventArgs e)
        {
            //  Code that runs on application shutdown
        }

        void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs
            Exception ex = Server.GetLastError().GetBaseException();

            if (ex is HttpException)
            {
                return;
            }

            LogHelper.WriteError(ex);
        }

        public override void Init()
        {
            base.Init();
            try
            {
                // Get the app name from config file...
                string appName = ConfigurationManager.AppSettings["ApplicationName"];
                if (!string.IsNullOrEmpty(appName))
                {
                    foreach (string moduleName in this.Modules)
                    {
                        IHttpModule module = this.Modules[moduleName];

                        HanldeSessionState(module, appName);
                    }
                }

            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Major Code Smell", "S3011:Reflection should not be used to increase accessibility of classes, methods, or fields", Justification = "<Pending>")]
        private static void HanldeSessionState(IHttpModule module, string appName)
        {
            if (module is SessionStateModule ssm)
            {
                FieldInfo storeInfo = typeof(SessionStateModule).GetField("_store", BindingFlags.Instance | BindingFlags.NonPublic);
                SessionStateStoreProviderBase store = (SessionStateStoreProviderBase)storeInfo.GetValue(ssm);
                if (store == null) //In IIS7 Integrated mode, module.Init() is called later
                {
                    FieldInfo runtimeInfo = typeof(HttpRuntime).GetField("_theRuntime", BindingFlags.Static | BindingFlags.NonPublic);
                    HttpRuntime theRuntime = (HttpRuntime)runtimeInfo.GetValue(null);
                    FieldInfo appNameInfo = typeof(HttpRuntime).GetField("_appDomainAppId", BindingFlags.Instance | BindingFlags.NonPublic);
                    appNameInfo.SetValue(theRuntime, appName);
                }
                else
                {
                    Type storeType = store.GetType();
                    if (storeType.Name.Equals("OutOfProcSessionStateStore"))
                    {
                        FieldInfo uribaseInfo = storeType.GetField("s_uribase", BindingFlags.Static | BindingFlags.NonPublic);
                        uribaseInfo.SetValue(storeType, appName);
                    }
                }
            }
        }
    }
}