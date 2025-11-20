using Fanex.Affiliate.Admin.Core.Apis;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.MetaModels.Apis;
using Fanex.Affiliate.Admin.Core.Utilities;
using Fanex.Caching;
using Refit;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Handlers
{
    public class AuthenticatedHttpClientHandler : HttpClientHandler
    {
        private readonly IAppSetting _appSetting;
        private readonly ITokenApi _tokenApi;
        private readonly ICacheService _cacheService;

        public AuthenticatedHttpClientHandler(IAppSetting appSetting, ICacheService cacheService)
        {
            _appSetting = appSetting ?? throw new ArgumentNullException(nameof(cacheService));

            base.Proxy = appSetting.IsUseMemberSiteProxy ? new WebProxy(new Uri(appSetting.MemberSiteProxyUrl)) : null;
            base.AutomaticDecompression = AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            _tokenApi = TokenApiInstance(base.Proxy, appSetting.MemberSiteApiUrl);
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            await SetJwtTokenAsync(request);

            return await base.SendAsync(request, cancellationToken).ConfigureAwait(false);
        }

        private async Task SetJwtTokenAsync(HttpRequestMessage request)
        {
            var token = await _cacheService.GetAsync<string>(CacheKey.TokenExtApi);

            if (token == null)
            {
                var tokenInfo = await GetJwtTokenAsync();
                token = tokenInfo.AccessToken;

                var cachePolicy = new CacheItemOptions().SetAbsoluteExpiration(TimeSpan.FromSeconds(_appSetting.MemberSiteApiTokenCacheTimeOut));
                await _cacheService.SetAsync(CacheKey.TokenExtApi, token, cachePolicy);
            }

            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        }

        private async Task<TokenInfo> GetJwtTokenAsync()
        {
            var tokenRequestParam = new TokenRequestParam
            {
                Username = _appSetting.MemberSiteApiUsername,
                Password = _appSetting.MemberSiteApiPassword
            };

            try
            {
                var token = await _tokenApi.GetTokenAsync(tokenRequestParam);
                return token;

            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);

                throw new InvalidOperationException($"Can't get 12B Web Api JwtSecurityToken for {tokenRequestParam.Username}!");
            }
        }

        private static ITokenApi TokenApiInstance(IWebProxy proxy, string tokenApiUrl)
        {
            var handler = new HttpClientHandler
            {
                Proxy = proxy
            };

            return RestService.For<ITokenApi>(
                new HttpClient(handler)
                {
                    BaseAddress = new Uri(tokenApiUrl)
                });
        }
    }
}
