using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Apis
{
    public interface ILicenseeService
    {
        Task<MemberSiteCustomerInfo> GetMemberSiteCustomerInfoAsync(string userName, int siteId);

        Task<ResultInfo> CheckCustomerIsValidAsync(string userName, int siteId);

        ResultInfo CheckCustomerIsValid(MemberSiteCustomerInfo cust);

        Task<ResultInfo> UpdatePaymentRequestAsync(PaymentRequestInfo paymentRequest);

        Task<ResultInfo> UnlockUserAsync(int userId);
    }
}
