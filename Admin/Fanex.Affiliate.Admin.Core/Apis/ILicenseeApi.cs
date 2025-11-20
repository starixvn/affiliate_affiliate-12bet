using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Refit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Apis
{
    public interface ILicenseeApi
    {
        [Get("/")]
        Task<string> GetAsync();

        [Get("/api/customer/GetLoginCustomerInfo")]
        Task<MemberSiteCustomerInfo> GetCustomerInfoAsync(string userName, int siteId);

        [Post("/api/customer/UpdateCustomerWallet")]
        Task<decimal> UpdatePaymentRequestAsync(PaymentRequestInfo paymentInfo);

        [Post("/api/customer/UnlockUser")]
        Task<ApiResultInfo> UnlockUserAsync(int[] userIds);

        [Post("/api/customer/InsertAffInfos")]
        Task<ApiResultInfo> InsertAffInfosAsync(IEnumerable<ApiAffInfo> affInfos);
    }
}
