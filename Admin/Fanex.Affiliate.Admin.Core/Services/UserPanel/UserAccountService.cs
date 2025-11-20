using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Affiliate.Admin.Core.Commands.UserPanel.UserAccount;
using Fanex.Affiliate.Admin.Core.Configurations;
using Fanex.Affiliate.Admin.Core.Constants;
using Fanex.Affiliate.Admin.Core.Criterias.Affiliate;
using Fanex.Affiliate.Admin.Core.Criterias.UserPanel.UserAccount;
using Fanex.Affiliate.Admin.Core.DTO;
using Fanex.Affiliate.Admin.Core.DTO.Affiliate;
using Fanex.Affiliate.Admin.Core.DTO.Customer;
using Fanex.Affiliate.Admin.Core.DTO.UserPanel;
using Fanex.Affiliate.Admin.Core.Extensions;
using Fanex.Affiliate.Admin.Core.MetaModels.UserPanel;
using Fanex.Affiliate.Admin.Core.Services.Apis;
using Fanex.Affiliate.Admin.Core.Services.ThirdPartyLicensee;
using Fanex.Affiliate.Admin.Core.Utilities;
using Fanex.Data.Repository;

namespace Fanex.Affiliate.Admin.Core.Services.UserPanel
{
    public class UserAccountService : BaseDynamicService, IUserAccountService
    {
        private readonly ILicenseeService _licenseeService;
        private readonly IAppSetting _appSetting;
        private readonly IThirdPartyLicenseeService _thirdPartyLicenseeService;

        private const int TEST_CURRENCY_ID = 20;

        public UserAccountService(IDynamicRepository dynamicRepository,
            ILicenseeService licenseeService,
            IAppSetting appSetting,
            IThirdPartyLicenseeService thirdPartyLicenseeService) : base(dynamicRepository)
        {
            _licenseeService = licenseeService;
            _appSetting = appSetting;
            _thirdPartyLicenseeService = thirdPartyLicenseeService;
        }

        public UserAccount GetUserAccountInfo(int affId)
        {
            var criteria = new UserAccountCriteria { AffId = affId };

            return GetTData<UserAccount>(criteria);
        }

        public (IEnumerable<PaymentMethodInfo> paymentMethods, decimal minAmount) GetPaymentMethod()
        {
            var criteria = new PaymentMethodCriteria();

            var paymentMethods = FetchTData<PaymentMethodInfo>(criteria);

            return (paymentMethods, criteria.MinAmount);
        }

        public async Task<ResultInfo> UpdateUserAccountAsync(UserAccountParam param)
        {
            var validateResult = ValidateWebSite(param);
            if (!validateResult.IsSuccessful)
            {
                return validateResult;
            }

            var isValidPaymentMethod = ValidatePaymentMethod(param);
            if (!isValidPaymentMethod)
            {
                return ResultInfo.GenerateErr("The Preferred Payment Method is invalid!");
            }

            var curUserAccInfo = GetUserAccountInfo(param.AffId);
            var isPlayerAccountPreferred = PaymentMethod.PlayerAccount.Equals(param.PreferredPayment);
            var isDifferentUsername = !curUserAccInfo.PlayerUsername.MatchWith(param.PlayerUsername);

            if (isPlayerAccountPreferred && !string.IsNullOrWhiteSpace(param.PlayerUsername))
            {
                if (isDifferentUsername)
                {
                    var memberSiteId = _appSetting.MemberSiteId;
                    var memberSiteCust = await _licenseeService.GetMemberSiteCustomerInfoAsync(param.PlayerUsername, memberSiteId);
                    var validationResult = _licenseeService.CheckCustomerIsValid(memberSiteCust);

                    if (!validationResult.IsSuccessful)
                    {
                        return validationResult;
                    }

                    param.Player_CustId = memberSiteCust.CustId;
                    param.Player_Currency = memberSiteCust.IsTest.GetValueOrDefault()
                        ? TEST_CURRENCY_ID
                        : memberSiteCust.CurrencyId.GetValueOrDefault();
                } else
                {
                    param.Player_CustId = curUserAccInfo.PlayerCustId;
                    param.Player_Currency = curUserAccInfo.PlayerCurrencyId;
                }
            }

            return await UpdateUserAccountAsync(param, curUserAccInfo);
        }

        private async Task<ResultInfo> UpdateUserAccountAsync(UserAccountParam param, UserAccount curUserAccInfo)
        {
            var command = new UpdateUserAccountCommand
            {
                AffId = param.AffId,
                UserId = param.UserId,
                Ip = param.Ip,
                FirstName = param.FirstName,
                LastName = param.LastName,
                Gender = param.Gender,
                Email = param.Email,
                Phone = param.Phone,
                ContactApps = param.ContactApps,
                Address = param.Address,
                City = param.City,
                State = param.State,
                Postcode = param.Postcode,
                Country = param.Country,
                MailOption = param.MailOption,
                SiteUrl = param.SiteUrl,
                MoreSiteUrls = param.MoreSiteUrls,
                NoSiteDesc = param.NoSiteDesc,
                PreferredPayment = param.PreferredPayment,
                PlayerUsername = param.PlayerUsername,
                NetellerAccountId = param.NetellerAccountId,
                MoneybookersEmail = param.MoneybookersEmail,
                BankName = param.BankName,
                BankAddress = param.BankAddress,
                BankCode = param.BankCode,
                BankAccountName = param.BankAccountName,
                BankAccountNumber = param.BankAccountNumber,
                Player_CustId = param.Player_CustId,
                Player_Currency = param.Player_Currency,
            };

            if (!param.HasHostAffPersonalInfoPermission)
            {
                command.Email = curUserAccInfo.Email;
                command.Phone = curUserAccInfo.Phone;
            }

            var result = await ExecuteReturnResultInfoAsync(command);

            if (result.IsSuccessful)
            {
                await SendAffiliateInfoToLicenseeAsync(param.AffId, curUserAccInfo);
            }

            return result;
        }

        private async Task SendAffiliateInfoToLicenseeAsync(int affId, UserAccount curInfo)
        {
            try
            {
                var criteria = new AffBasicInfoCriteria { AffId = affId };
                var affInfo = GetTData<AffiliateBasicInfo>(criteria);

                if (affInfo != null)
                {
                    bool isSameAffInfo = affInfo.FirstName.MatchWith(curInfo.FirstName)
                                                  && affInfo.LastName.MatchWith(curInfo.LastName)
                                                  && affInfo.Email.MatchWith(curInfo.Email)
                                                  && affInfo.Phone.MatchWith(curInfo.Phone);
                    bool isUpdatedSensitiveInfo = !isSameAffInfo || !affInfo.PlayerUsername.MatchWith(curInfo.PlayerUsername);

                    if (isUpdatedSensitiveInfo)
                    {
                        await _thirdPartyLicenseeService.SendAffiliateInfoAsync(affInfo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteError(ex);
            }
        }

        private ResultInfo ValidateWebSite(UserAccountParam param)
        {
            if (param.IsMarketingAccount)
            {
                return new ResultInfo();
            }

            if (param.HasWebSite && string.IsNullOrEmpty(param.SiteUrl))
            {
                return new ResultInfo
                {
                    Code = ErrCode.GeneralErrorCode,
                    Message = "Website URL is required"
                };
            }

            if (!param.HasWebSite && string.IsNullOrEmpty(param.NoSiteDesc))
            {
                return new ResultInfo
                {
                    Code = ErrCode.GeneralErrorCode,
                    Message = $"Please describe how you would like to promote {_appSetting.SiteFriendlyName} if you don't have the URL is required"
                };
            }

            return new ResultInfo();
        }

        private static bool ValidatePaymentMethod(UserAccountParam param)
        {
            if (param.IsMarketingAccount)
            {
                return PaymentMethod.PlayerAccount.Equals(param.PreferredPayment);
            }

            var isPlayerUsername = (PaymentMethod.PlayerAccount.Equals(param.PreferredPayment))
                                        && !string.IsNullOrEmpty(param.PlayerUsername);
            var isMoneybookersEmail = PaymentMethod.Moneybookers.Equals(param.PreferredPayment) && !string.IsNullOrEmpty(param.MoneybookersEmail);
            var isBankTranfer = PaymentMethod.Wire.Equals(param.PreferredPayment) && IsValidWirePaymentMethod(param);

            return isPlayerUsername || isMoneybookersEmail || isBankTranfer;
        }

        private static bool IsValidWirePaymentMethod(UserAccountParam param)
        {
            return !(string.IsNullOrEmpty(param.BankName) || string.IsNullOrEmpty(param.BankAddress) ||
                string.IsNullOrEmpty(param.BankAccountName) || string.IsNullOrEmpty(param.BankAccountNumber));
        }
    }
}
