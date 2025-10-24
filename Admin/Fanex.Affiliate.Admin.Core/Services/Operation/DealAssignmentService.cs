namespace Fanex.Affiliate.Admin.Core.Services.Operation
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Commands.Operation;
    using Data.Repository;
    using Extensions;
    using Fanex.Affiliate.Admin.Core.Constants;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Email;
    using Fanex.Affiliate.Admin.Core.MetaModels.Affiliate;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
    using Fanex.Affiliate.Admin.Core.Services.Affiliate;
    using Fanex.Affiliate.Admin.Core.Services.Auth;
    using Fanex.Affiliate.Admin.Core.Services.Email;
    using Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee;
    using Fanex.Affiliate.Admin.Core.Utilities;
    using global::Affiliate.Infrastructure.Helpers;

    public class DealAssignmentService : BaseDynamicService, IDealAssignmentService
    {
        private readonly IAffiliateService _affiliateService;
        private readonly IEmailService _emailService;
        private readonly IThirdPartyLicenseeService _thirdPartyLicenseeService;
        private readonly IAuthService _authService;

        public DealAssignmentService(
            IDynamicRepository dynamicRepository,
            IAffiliateService affiliateService,
            IEmailService emailService,
            IThirdPartyLicenseeService thirdPartyLicenseeService, 
            IAuthService authService) : base(dynamicRepository)
        {
            _affiliateService = affiliateService;
            _emailService = emailService;
            _thirdPartyLicenseeService = thirdPartyLicenseeService;
            _authService = authService;
        }

        public async Task<ResultInfo> AssignDeal(AssignDealParam param, AffInfoParam affInfo, AffInformationEmail emailParam)
        {
            return await ProcessAssignGroup(param, affInfo, emailParam);
        }

        public bool HasPermissionAssignOnAff(int userId, int affId)
        {
            var affInfo = _affiliateService.GetAffiliateBasicInfo(affId);

            if (string.IsNullOrEmpty(affInfo.AffCode))
            {
                var permissionList = _authService.GetPermissionList(userId);

                return permissionList.Any(i => i.FunctionName.MatchWith(Function.EditAffStatus) && i.IsHost);
            }

            return true;
        }

        private async Task<ResultInfo> ProcessAssignGroup(AssignDealParam param, AffInfoParam affInfo, AffInformationEmail emailParam)
        {
            var command = new AssignDealCommand
            {
                UserId = param.UserId,
                AffId = affInfo.AffId,
                GroupId = param.GroupId,
                Ip = param.Ip
            };

            var assignResult = await ExecuteReturnResultInfoAsync(command);
            var isApproved = affInfo.GroupId != 0;

            if (!isApproved && assignResult.IsSuccessful)
            {
                return await ProcessApproveAffiliate(param, affInfo, emailParam);
            }

            if (assignResult.IsSuccessful)
            {
                await SendAffiliateInfoToLicensee(affInfo);
            }    

            return assignResult;
        }

        private async Task<ResultInfo> ProcessApproveAffiliate(AssignDealParam param, AffInfoParam affInfo, AffInformationEmail emailParam)
        {
            var password = Generator.GetRandomString(10);
            var (approvedResult, affCode) = ApproveAffiliate(param, password);

            if (approvedResult.IsSuccessful)
            {
                await SendAffiliateInfoToLicensee(affInfo);
                SendEmailApprove(emailParam, affInfo, password, affCode);
            }

            return approvedResult;
        }

        private (ResultInfo, string) ApproveAffiliate(AssignDealParam param, string password)
        {
            var approveParam = new ApproveAffiliateParam
            {
                UserId = param.UserId,
                AffId = param.AffId,
                Password = CryptographyHelper.Encrypt(password),
                Ip = param.Ip,
                Status = AffStatus.Approved
            };

            return _affiliateService.ApproveAffiliate(approveParam);
        }

        private async Task SendAffiliateInfoToLicensee(AffInfoParam affParam)
        {
            try
            {
                var affInfo = _affiliateService.GetAffiliateBasicInfo(affParam.AffId);

                if (affInfo != null)
                {
                    await _thirdPartyLicenseeService.SendAffiliateInfo(affInfo);
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);
            }
        }

        private void SendEmailApprove(AffInformationEmail emailParam, AffInfoParam affInfo, string password, string affCode)
        {
            emailParam.UserSiteUrl = SiteDomainHelper.GetUserSiteUrl(affInfo.AffType);
            emailParam.Language = affInfo.PreferredLanguage;
            emailParam.FirstName = affInfo.FirstName;
            emailParam.UserName = affInfo.UserName;
            emailParam.MailTo = affInfo.Email;
            emailParam.IsHtml = !affInfo.MailOption;
            emailParam.Password = password;
            emailParam.AffCode = affCode;

            _emailService.SendApprovedEmail(emailParam);
        }
    }
}
