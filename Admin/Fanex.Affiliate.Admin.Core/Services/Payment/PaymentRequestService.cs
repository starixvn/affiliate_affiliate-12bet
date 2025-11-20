using Fanex.Affiliate.Admin.Core.Commands.Affiliate;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Constants.Apis;
using Fanex.Affiliate.Admin.Core.Criterias.PaymentRequest;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.DTO.Payment;
using Fanex.Affiliate.Admin.Core.Exceptions;
using Fanex.Affiliate.Admin.Core.MetaModels.Payment;
using Fanex.Affiliate.Admin.Core.Resources;
using Fanex.Affiliate.Admin.Core.Services.Affiliate;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Fanex.Affiliate.Admin.Core.Services.Email;
using Fanex.Affiliate.Admin.Core.Utilities;
using Fanex.Data.Repository;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Payment
{
    public class PaymentService : BaseDynamicService, IPaymentService
    {
        private readonly IAffiliateService _affiliateService;
        private readonly IEmailService _emailService;
        private readonly ILicenseeService _licenseeService;
        private readonly IAppSetting _appSetting;

        public PaymentService(
            IDynamicRepository dynamicRepository,
            IAffiliateService affiliateService,
            ILicenseeService licenseeService,
            IEmailService emailService,
            IAppSetting appSetting) : base(dynamicRepository)
        {
            _affiliateService = affiliateService;
            _licenseeService = licenseeService;
            _emailService = emailService;
            _appSetting = appSetting;
        }

        public EntityResult<PaymentRequest> GetPaymentRequestList(PaymentRequestParam param)
        {
            var criteria = new PaymentRequestCriteria
            {
                SearchById = param.SearchBy,
                Username = param.Username,
                Status = param.Status,
                IsGetAll = param.IsGetAll,
                FromDate = param.FromDate,
                ToDate = param.ToDate,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize,
            };

            return FetchEntityResult<PaymentRequest>(criteria);
        }

        public PaymentRequestDetail GetPaymentRequestDetail(long transId)
        {
            var criteria = new PaymentRequestDetailCriteria
            {
                TransId = transId
            };

            return GetTData<PaymentRequestDetail>(criteria);
        }

        public ResultInfo UpdatePaymentRequest(PaymentRequestUpdateParam param, PaymentRequestUpdateEmail emailParam)
        {
            var affInfo = _affiliateService.GetAffiliateBasicInfo(param.AffId);
            var paymentRequestDetail = GetPaymentRequestDetail(param.TransId);
            var result = UpdatePaymentRequest(param, paymentRequestDetail);
            if (result != null && result.IsSuccessful)
            {
                SendMail(param, emailParam, affInfo, paymentRequestDetail);
            }
            return result;
        }

        public async Task<ResultInfo> HandlePaymentRequestAsync(PaymentRequestUpdateParam param, PaymentRequestUpdateEmail emailParam)
        {
            var siteId = _appSetting.MemberSiteId;
            var paymentRequestDetail = GetPaymentRequestDetail(param.TransId);
            var affInfo = _affiliateService.GetAffiliateBasicInfo(paymentRequestDetail.AffId);
            var cust = await _licenseeService.GetMemberSiteCustomerInfoAsync(affInfo.PlayerUsername, siteId);
            var result = _licenseeService.CheckCustomerIsValid(cust);

            if (result.Code == CustomerStatus.LOCKED)
            {
                result = await _licenseeService.UnlockUserAsync(cust.CustId);
            }

            if (!result.IsSuccessful)
            {
                return result;
            }

            result = UpdatePaymentRequest(param, paymentRequestDetail);

            if (result.IsSuccessful && param.IsApproved)
            {
                var paymentInfo = new PaymentRequestInfo
                {
                    Amount = paymentRequestDetail.OriginalTransAmount,
                    CustId = cust.CustId,
                    RefTransId = param.TransId.ToString(),
                    SiteId = siteId,
                    Type = (int)PaymentType.WithdrawFromAffAcc,
                    UserName = affInfo.PlayerUsername
                };

                try
                {
                    LogHelper.WriteInfo($"Call member site API to payment\n" +
                        $"Param: {JsonConvert.SerializeObject(paymentInfo)}");

                    result = await _licenseeService.UpdatePaymentRequestAsync(paymentInfo);

                    LogHelper.WriteInfo($"Membersite return result:\n" +
                        $"Param: {JsonConvert.SerializeObject(paymentInfo)}\n" +
                        $"Result: {JsonConvert.SerializeObject(result)}");
                }
                catch (Exception ex)
                {
                    throw new LicenseetException(paymentInfo, ex);
                }
            }

            if (result.IsSuccessful)
            {
                SendMail(param, emailParam, affInfo, paymentRequestDetail);
            }
            return result;
        }

        private void SendMail(PaymentRequestUpdateParam param,
            PaymentRequestUpdateEmail emailParam,
            AffiliateBasicInfo affInfo,
            PaymentRequestDetail paymentRequestDetail)
        {

            emailParam.UserSiteUrl = SiteDomainHelper.GetUserSiteUrl(affInfo.AffType);
            emailParam.FirstName = affInfo.FirstName;
            emailParam.MailTo = affInfo.Email;
            emailParam.IsHtml = !affInfo.MailOption;
            emailParam.Language = affInfo.PreferredLanguage;

            emailParam.IsApproved = param.IsApproved;
            emailParam.TransId = param.TransId;
            emailParam.TransDate = paymentRequestDetail.TransDate.ToString("MM/dd/yyyy HH:mm:ss");
            emailParam.Amount = paymentRequestDetail.Amount;

            _emailService.SendPaymentRequestUpdateEmail(emailParam);
        }

        private ResultInfo UpdatePaymentRequest(PaymentRequestUpdateParam param, PaymentRequestDetail paymentRequestDetail)
        {
            if (paymentRequestDetail != null &&
                string.Equals(AffStatus.Processing, paymentRequestDetail.Status, StringComparison.InvariantCultureIgnoreCase))
            {
                var command = new UpdatePaymentRequestCommand
                {
                    TransId = param.TransId,
                    Status = param.IsApproved ? AffStatus.Approved : AffStatus.Rejected,
                    AdminDesc = param.AdminDesc,
                    AffDesc = param.AffDesc,
                    UserId = param.UserId,
                    Ip = param.Ip,
                };

                return ExecuteReturnResultInfo(command);
            }
            return new ResultInfo { Code = ErrCode.GeneralErrorCode, Message = Lang.PaymentRequestNotValid };
        }
    }
}
