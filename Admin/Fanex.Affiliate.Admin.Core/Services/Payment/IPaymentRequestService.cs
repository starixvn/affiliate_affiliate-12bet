using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.DTO.Payment;
using Fanex.Affiliate.Admin.Core.MetaModels.Payment;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Payment
{
    public interface IPaymentService
    {
        EntityResult<PaymentRequest> GetPaymentRequestList(PaymentRequestParam param);

        PaymentRequestDetail GetPaymentRequestDetail(long transId);

        ResultInfo UpdatePaymentRequest(PaymentRequestUpdateParam param, PaymentRequestUpdateEmail emailParam);

        Task<ResultInfo> HandlePaymentRequestAsync(PaymentRequestUpdateParam param, PaymentRequestUpdateEmail emailParam);
    }
}
