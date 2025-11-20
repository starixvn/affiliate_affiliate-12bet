using Fanex.Affiliate.Admin.Core.Apis;
using Fanex.Affiliate.Admin.Core.Constants.Apis;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.Resources;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Apis
{
    public class LicenseeService : ILicenseeService
    {
        private readonly ILicenseeApi _licenseeApi;

        public LicenseeService(ILicenseeApi licenseeApi)
        {
            _licenseeApi = licenseeApi;
        }

        public async Task<ResultInfo> CheckCustomerIsValidAsync(string userName, int siteId)
        {
            var cust = await GetMemberSiteCustomerInfoAsync(userName, siteId).ConfigureAwait(false);
            return CheckCustomerIsValid(cust);
        }

        public ResultInfo CheckCustomerIsValid(MemberSiteCustomerInfo cust)
        {
            var result = new ResultInfo { Code = CustomerStatus.NO_STATUS_CODE };
            if (cust == null)
            {
                result.Message = Lang.UserNameNotExist;
            }
            else
            {
                switch (cust.Status)
                {
                    case CustomerStatus.RUNNING:
                        result.Code = 0;
                        break;
                    case CustomerStatus.SUSPENDED:
                        result.Code = cust.Status.Value;
                        result.Message = Lang.UserNameSuspended;
                        break;
                    case CustomerStatus.CLOSED:
                        result.Code = cust.Status.Value;
                        result.Message = Lang.UserNameClosed;
                        break;
                    case CustomerStatus.LOCKED:
                        result.Code = cust.Status.Value;
                        result.Message = Lang.UserNameLocked;
                        break;
                    default:
                        result.Code = cust.Status.GetValueOrDefault(CustomerStatus.NO_STATUS_CODE);
                        result.Message = Lang.ErrInApi;
                        break;
                }
            }

            return result;

        }

        public async Task<MemberSiteCustomerInfo> GetMemberSiteCustomerInfoAsync(string userName, int siteId)
            => await _licenseeApi.GetCustomerInfoAsync(userName, siteId).ConfigureAwait(false);

        public async Task<ResultInfo> UnlockUserAsync(int userId)
        {
            var result = await _licenseeApi.UnlockUserAsync(new[] { userId });
            return new ResultInfo
            {
                Code = result.IsSuccess ? 0 : CustomerStatus.INTERNAL_ERR,
                Message = result.ErrMsg
            };
        }

        public async Task<ResultInfo> UpdatePaymentRequestAsync(PaymentRequestInfo paymentRequest)
        {
            var result = new ResultInfo { Code = 100 };
            if (paymentRequest.Amount == 0)
            {
                return result;
            }

            var afterAmount = await _licenseeApi.UpdatePaymentRequestAsync(paymentRequest).ConfigureAwait(false);
            if (afterAmount > 0)
            {
                result.Code = 0;
            }

            return result;
        }
    }
}
