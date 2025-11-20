using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.MetaModels.Apis;
using Refit;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Apis
{
    internal interface ITokenApi
    {
        [Post("/api/Auth")]
        Task<TokenInfo> GetTokenAsync([Body] TokenRequestParam param);
    }
}
