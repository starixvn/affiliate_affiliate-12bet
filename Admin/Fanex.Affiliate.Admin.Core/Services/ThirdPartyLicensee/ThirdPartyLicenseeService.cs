using Fanex.Affiliate.Admin.Core.Apis;
using Fanex.Affiliate.Admin.Core.Commands.Tracker;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Api;
using Fanex.Affiliate.Admin.Core.Exceptions;
using Fanex.Affiliate.Admin.Core.Services.Tracker;
using Fanex.Affiliate.Admin.Core.Utilities;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee
{
    public class ThirdPartyLicenseeService : IThirdPartyLicenseeService
    {
        private const int _Marketing_Cust_ID = -1;
        private readonly IJobTrackerService _jobTrackerService;
        private readonly ILicenseeApi _licenseeApi;
        private readonly IAppSetting _appSetting;

        public ThirdPartyLicenseeService(IJobTrackerService jobjobTrackerService, ILicenseeApi licenseeApi, IAppSetting appSetting)
        {
            _jobTrackerService = jobjobTrackerService;
            _licenseeApi = licenseeApi;
            _appSetting = appSetting;
        }

        public async Task SendAffiliateInfo(AffiliateBasicInfo affInfo)
        {
            if ((affInfo.AffCategoryId != AffCategoryTypes.MarketingAccount && affInfo.PlayerCustId == 0) || string.IsNullOrEmpty(affInfo.AffCode))
            {
                return;
            }

            var affiliateInfo = new ApiAffiliateInfo
            {
                AffiliateId = affInfo.AffId,
                AffiliateCode = affInfo.AffCode,
                AffiliateName = affInfo.UserName,
                UserName = affInfo.PlayerUsername ?? string.Empty,
                FirstName = affInfo.FirstName,
                LastName = affInfo.LastName,
                ContactNumber = affInfo.ContactNumber,
                Email = affInfo.Email,
                Status = affInfo.Status,
                CustId = affInfo.PlayerCustId == 0 ? _Marketing_Cust_ID : affInfo.PlayerCustId,
                ParentAffiliate = affInfo.ParentAffName,
                DealVerifyFlags = affInfo.DealVerifyFlags,
                SiteId = _appSetting.MemberSiteId
            };
            var (Id, Result) = _jobTrackerService.InsertDataTracker(new InsertJobTrackerCommand
            {
                PushDataInfo = JsonConvert.SerializeObject(affiliateInfo),
                PushDataType = DataTrackerType.ApproveAffiliate
            });
            try
            {
                if (Result.IsSuccessful)
                {
                    await SendAffiliateInfoToLicensee(affiliateInfo);

                    _jobTrackerService.UpdateDataTracker(new UpdateJobTrackerCommand
                    {
                        PushTrackerId = Id,
                        StatusId = DataTrackerStatus.Success
                    });
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);
                _jobTrackerService.UpdateDataTracker(new UpdateJobTrackerCommand
                {
                    PushTrackerId = Id,
                    StatusId = DataTrackerStatus.Failure
                });
            }
        }

        private async Task SendAffiliateInfoToLicensee(ApiAffiliateInfo affiliateInfo)
        {
            var result = await _licenseeApi.InsertAffiliateInfo(affiliateInfo);
            if (!result.IsSuccess)
            {
                throw new LicenseetException(affiliateInfo, new ResultInfo { Code = 1, Message = result.ErrMsg });
            }
        }
    }
}
