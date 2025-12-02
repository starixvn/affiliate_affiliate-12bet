using Fanex.Affiliate.Admin.Core.Apis;
using Fanex.Affiliate.Admin.Core.Commands.Apis;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Criterias.Apis;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Apis;
using Fanex.Affiliate.Admin.Core.Exceptions;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Fanex.Affiliate.Admin.Core.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee
{
    public class ThirdPartyLicenseeService : IThirdPartyLicenseeService
    {
        private const int PAGE_INDEX_DEFAULT = 1;
        private const int PAGE_SIZE_DEFAULT = 1000;

        private readonly IApiAffService _apiService;
        private readonly ILicenseeApi _licenseeApi;

        public ThirdPartyLicenseeService(IApiAffService apiService, ILicenseeApi licenseeApi, IAppSetting appSetting)
        {
            _apiService = apiService;
            _licenseeApi = licenseeApi;
        }

        public async Task SendAffiliateInfoAsync(AffiliateBasicInfo affInfo)
        {
            if (IsInvalidAff(affInfo.AffCategoryId, affInfo.PlayerCustId, affInfo.AffCode))
            {
                return;
            }

            var apiAffiliateInfo = new ApiAffInfo
            {
                AffId = affInfo.AffId,
                AffCode = affInfo.AffCode,
                UserName = affInfo.UserName,
                Player_Username = affInfo.PlayerUsername,
                FirstName = affInfo.FirstName,
                LastName = affInfo.LastName,
                Phone = affInfo.ContactNumber,
                Email = affInfo.Email,
                Status = affInfo.Status,
                Player_CustId = affInfo.PlayerCustId,
                ParentAff = affInfo.ParentAffName,
                DealVerifyFlags = affInfo.DealVerifyFlags
            };

            await SendAffInfosAsync(new List<ApiAffInfo> { apiAffiliateInfo });
        }

        public async Task SendMultipleAffInfosByDealAsync(int dealId)
        {
            var affInfos = await GetApiAffInfosAsync(dealId);

            await SendAffInfosByBatchAsync(dealId, affInfos);
        }

        private async Task SendAffInfosByBatchAsync(int dealId, IEnumerable<ApiAffInfo> affInfos)
        {
            var pageIndex = PAGE_INDEX_DEFAULT;
            var sendAffInfos = affInfos;

            while (sendAffInfos != null && sendAffInfos.Any())
            {
                var validAffs = affInfos.Where(a => !IsInvalidAff(a.AffCategoryId, a.Player_CustId, a.AffCode));

                if (validAffs.Any())
                {
                    await SendAffInfosAsync(sendAffInfos);
                }

                if (sendAffInfos.Count() == PAGE_SIZE_DEFAULT)
                {
                    pageIndex++;
                    sendAffInfos = await GetApiAffInfosAsync(dealId, pageIndex);
                }
                else
                {
                    sendAffInfos = null;
                }
            }
        }

        private async Task SendAffInfosAsync(IEnumerable<ApiAffInfo> validAffInfos)
        {
            var affInfosJson = JsonConvert.SerializeObject(validAffInfos);

            var (trackerId, result) = _apiService.InsertDataTracker(new InsertJobTrackerCommand
            {
                PushDataInfo = affInfosJson,
                PushDataType = DataTrackerType.InsertAffInfos
            });

            try
            {
                if (result.IsSuccessful)
                {
                    await SendAffInfosToLicenseeAsync(validAffInfos);

                    UpdateDataTracker(trackerId, DataTrackerStatus.Success);
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);
                UpdateDataTracker(trackerId, DataTrackerStatus.Failure);
            }
        }

        private async Task SendAffInfosToLicenseeAsync(IEnumerable<ApiAffInfo> validAffInfos)
        {
            var result = await _licenseeApi.InsertAffInfosAsync(validAffInfos);
            if (!result.IsSuccess)
            {
                throw new LicenseetException(validAffInfos, new ResultInfo { Code = 1, Message = result.ErrMsg });
            }
        }

        private async Task<IEnumerable<ApiAffInfo>> GetApiAffInfosAsync(int dealId, int pageIndex = PAGE_INDEX_DEFAULT)
        {
            return await _apiService.GetApiAffInfosAsync(new GetApiAffInfosCriteria
            {
                DealId = dealId,
                PageIndex = pageIndex,
                PageSize = PAGE_SIZE_DEFAULT,
            });
        }

        private void UpdateDataTracker(long trackerId, int statusId)
        {
            _apiService.UpdateDataTracker(new UpdateJobTrackerCommand
            {
                PushTrackerId = trackerId,
                StatusId = statusId
            });
        }

        private static bool IsInvalidAff(byte affCategoryId, int playerCustId, string affCode)
        {
            return (affCategoryId != AffCategoryTypes.MarketingAccount && playerCustId == 0) || string.IsNullOrEmpty(affCode);
        }
    }
}
