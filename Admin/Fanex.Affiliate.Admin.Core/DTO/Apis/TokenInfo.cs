using Newtonsoft.Json;

namespace Fanex.Affiliate.Admin.Core.DTO.Apis
{
    public class TokenInfo
    {
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }

        [JsonProperty("token_type")]
        public string TokenType { get; set; }

        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
    }
}
