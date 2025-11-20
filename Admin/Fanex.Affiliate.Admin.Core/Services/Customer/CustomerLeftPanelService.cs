using Affiliate.Infrastructure.Helpers;
using DNAide.Utils;
using Fanex.Affiliate.Admin.Core.Commands.Customer;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Criterias.Customer;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Customer;
using Fanex.Affiliate.Admin.Core.DTO.Email;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.Customer;
using Fanex.Affiliate.Admin.Core.Services.Affiliate;
using Fanex.Affiliate.Admin.Core.Services.Email;
using Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee;
using Fanex.Affiliate.Admin.Core.Utilities;
using Fanex.Data.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.Customer
{
    public class CustomerLeftPanelService : BaseDynamicService, ICustomerLeftPanelService
    {
        private readonly IEmailService _emailService;
        private readonly IAffiliateService _affiliateService;
        private readonly IThirdPartyLicenseeService _thirdPartyLicenseeService;

        public CustomerLeftPanelService(
            IEmailService emailService,
            IAffiliateService affiliateService,
            IDynamicRepository dynamicRepository,
            IThirdPartyLicenseeService thirdPartyLicenseeService) : base(dynamicRepository)
        {
            _emailService = emailService;
            _affiliateService = affiliateService;
            _thirdPartyLicenseeService = thirdPartyLicenseeService;
        }
        public AffiliateInfoOnLeftPanel GetAffiliateInfoOnLeftPanel(string affUserName, string accId, string accOnId, string sessionId)
        {
            var affiliateInfo = GetAffiliateInfoOnLeftPanel(affUserName);
            if (affiliateInfo != null)
            {
                affiliateInfo.AffLink = GenerateUrl(affUserName, affiliateInfo.AffType, accId, accOnId, sessionId).ToString();
            }
            return affiliateInfo;
        }

        private AffiliateInfoOnLeftPanel GetAffiliateInfoOnLeftPanel(string affUserName)
        {
            var criteria = new AffiliateInfoOnLeftPanelCriteria { Username = affUserName };

            return GetTData<AffiliateInfoOnLeftPanel>(criteria);
        }

        public IEnumerable<OnlineList> GetOnlineList(string affUserName)
        {
            var criteria = new AffiliateOnlineCriteria { Username = affUserName };

            return FetchTData<OnlineList>(criteria);
        }

        public TransferLimitSettingInfo GetTransferLimitSetting(int affId)
        {
            var criteria = new TransferLimitCriteria { AffId = affId };

            return GetTData<TransferLimitSettingInfo>(criteria);
        }

        public ResultInfo UpdateTransferLimitSetting(TransferLimitSettingParam param)
        {
            if (!param.DisabledTransfer && param.TransferLimit == 0)
            {
                return new ResultInfo
                {
                    Code = ErrCode.GeneralErrorCode,
                    Message = "Limit must be a whole positive number."
                };
            }

            var command = new UpdateTransferLimitCommand
            {
                AffId = param.AffId,
                DisabledTransfer = param.DisabledTransfer,
                TransferLimit = param.TransferLimit,
                UserId = param.UserId,
                Ip = param.Ip,
            };

            return ExecuteReturnResultInfo(command);
        }

        public ResultInfo UpdateAffType(UpdateAffTypeParam param)
        {
            var command = new UpdateAffTypeCommand
            {
                AffId = param.AffId,
                AffType = param.AffType,
                UserId = param.UserId,
                Ip = param.Ip,
            };

            return ExecuteReturnResultInfo(command);
        }

        public ResultInfo UpdateLanguage(UpdateLanguageParam param)
        {
            var command = new UpdateLanguageCommand
            {
                AffId = param.AffId,
                PreferredLanguage = param.PreferredLanguage,
                UserId = param.UserId,
                Ip = param.Ip,
            };

            return ExecuteReturnResultInfo(command);
        }

        public async Task<ResultInfo> UpdateStatusAsync(UpdateStatusParam param, AffInformationEmail emailParam)
        {
            var command = new UpdateStatusCommand
            {
                AffId = param.AffId,
                Status = param.Status,
                UserId = param.UserId,
                Ip = param.Ip,
            };

            var result = await ExecuteReturnResultInfoAsync(command);

            if (result.IsSuccessful && param.Status.MatchWith(AffStatus.Disapproved))
            {
                var affInfo = _affiliateService.GetAffiliateBasicInfo(param.AffId);

                SendDisapprovedEmail(emailParam, affInfo);
            }

            if (result.IsSuccessful && (param.Status.MatchWith(AffStatus.Approved) || param.Status.MatchWith(AffStatus.Suspended)))
            {
                var affInfo = _affiliateService.GetAffiliateBasicInfo(param.AffId);

                await TrackAndSendAffiliateToLicenseeAsync(affInfo);
            }

            return result;
        }

        private async Task TrackAndSendAffiliateToLicenseeAsync(AffiliateBasicInfo affInfo)
        {
            try
            {
                await _thirdPartyLicenseeService.SendAffiliateInfoAsync(affInfo);

            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);
            }

        }

        private void SendDisapprovedEmail(AffInformationEmail emailParam, AffiliateBasicInfo affInfo)
        {
            emailParam.UserSiteUrl = SiteDomainHelper.GetUserSiteUrl(affInfo.AffType);
            emailParam.Language = affInfo.PreferredLanguage;
            emailParam.FirstName = affInfo.FirstName;
            emailParam.MailTo = affInfo.Email;
            emailParam.IsHtml = !affInfo.MailOption;

            _emailService.SendDisapprovedEmail(emailParam);
        }

        private static Uri GenerateUrl(string custName, int affType, string accId, string accOnId, string sessionId)
        {
            var rndStr = Encryption.RandomString(6);
            var accKey = Generator.GenerateSHA512String(sessionId + rndStr);
            var url = SiteDomainHelper.GetUserInternalSiteUrl(affType);
            url += "?chalengeStr=" + rndStr;
            url += "&accKey=" + accKey;
            url += "&custName=" + custName;
            url += "&accId=" + accId;
            url += "&accOnId=" + accOnId;
            return new Uri(url, UriKind.Absolute);
        }
    }
}
