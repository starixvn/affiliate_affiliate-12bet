namespace Fanex.Affiliate.Admin.Core.Services.Operation
{
    using System.Collections.Generic;
    using System.Linq;
    using Data.Repository;
    using Fanex.Affiliate.Admin.Core.Commands.Operation;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;
    using Fanex.Affiliate.Admin.Core.Services.Common;
    using Fanex.Affiliate.Admin.Core.Utilities.Operation;

    public class OperationService : BaseDynamicService, IOperationService
    {
        private const int OneHundred = 100;

        private readonly ISystemService _systemService;

        public OperationService(
            IDynamicRepository dynamicRepository,
            ISystemService systemService) : base(dynamicRepository)
        {
            _systemService = systemService;
        }

        public ResultInfo AddDeal(DealSettingParam param)
        {
            var (isValid, message) = ValidateDeal(param);
            if (!isValid)
            {
                return ResultInfo.GenerateErr(message);
            }

            var command = new InsertDealCommand();
            AssignCommonDeal(command, param);
            command.GroupTypeId = param.DealType;

            AssignDealByType(command, param, isAdd: true);

            return ExecuteReturnResultInfo(command);
        }

        public ResultInfo UpdateDeal(DealSettingParam param)
        {
            var (isValid, message) = ValidateDeal(param, isAdd: false);
            if (!isValid)
            {
                return ResultInfo.GenerateErr(message);
            }

            var command = new UpdateDealCommand();
            AssignCommonDeal(command, param);

            AssignDealByType(command, param, isAdd: false);

            return ExecuteReturnResultInfo(command);
        }

        private static void AssignDealByType(dynamic command, DealSettingParam param, bool isAdd)
        {
            switch (param.DealType)
            {
                case Constants.DealType.CPA:
                    AssignCpaDeal(command, param);
                    if (isAdd)
                    {
                        command.GroupId = 0;
                        command.ScheduleId = param.ScheduleId;
                        command.StartDate = param.StartDate.GetValueOrDefault();
                    }
                    break;

                case Constants.DealType.RevenueShare:
                    AssignRevenueShareDeal(command, param);
                    break;

                default:
                    AssignCpaDeal(command, param);
                    AssignRevenueShareDeal(command, param);
                    if (isAdd)
                    {
                        command.GroupId = 0;
                        command.ScheduleId = param.ScheduleId;
                        command.StartDate = param.StartDate.GetValueOrDefault();
                    }
                    break;
            }
        }

        public ResultInfo DeleteDeal(DeleteDealParam param)
        {
            var command = new DeleteDealCommand
            {
                GroupId = param.DealId,
                UserId = param.UserId,
                Ip = param.Ip
            };

            return ExecuteReturnResultInfo(command);
        }

        private (bool isValid, string message) ValidateDeal(DealSettingParam dealInfo, bool isAdd = true)
        {
            var messageList = new List<string>();
            if (dealInfo == null)
            {
                return (false, "Deal information cannot be null.");
            }

            var validateResult = DealInfoValidator.ValidateGroupName(dealInfo.DealName);
            if (!validateResult.isValid)
            {
                messageList.AddRange(validateResult.messageList);
            }

            validateResult = DealInfoValidator.ValidateSubCommRate(dealInfo.IsSubCommRate, dealInfo.SubCommRate);
            if (!validateResult.isValid)
            {
                messageList.AddRange(validateResult.messageList);
            }

            if (dealInfo.DealType == Constants.DealType.CPA)
            {
                validateResult = DealInfoValidator.ValidateCPAInfo(dealInfo, isAdd);
            }
            else if (dealInfo.DealType == Constants.DealType.RevenueShare)
            {
                validateResult = DealInfoValidator.ValidateRevenueShare(dealInfo, _systemService.GetProductList());
            }
            else
            {
                validateResult = DealInfoValidator.ValidateHybridDeal(dealInfo, _systemService.GetProductList(), isAdd);
            }

            if (!validateResult.isValid)
            {
                messageList.AddRange(validateResult.messageList);
            }

            var isValid = messageList.Count == 0;
            var message = isValid ? string.Empty : string.Join("</br>", messageList);

            return (isValid, message);
        }

        private static void AssignCommonDeal(BaseDealCommand command, DealSettingParam param)
        {
            command.GroupId = param.GroupId;
            command.GroupName = param.DealName;
            command.DealVerifyFlags = DealInfoHelper.ConvertVerificationMethodsToDealVerifyFlags(param.VerificationMethods);
            command.IsSubCommRate = param.IsSubCommRate;
            command.SubCommRate = param.SubCommRate;
            command.Description = param.Description;
            command.UserId = param.UserId;
            command.Ip = param.Ip;
        }

        private static void AssignCpaDeal(BaseDealCommand command, DealSettingParam param)
        {
            command.CountryCodes = param.CountryCodes;
            command.ActiveDays = param.ActiveDays;
            command.HoldingDays = param.HoldingDays;
            command.HoldingTickets = param.HoldingTickets;
            command.Quota = param.Quota;
            command.CpaTierList = DealInfoHelper.BuildCpaTierListXml(param.CPATierSetting, param.CheckedMinFdm, param.CheckedMinTotalDeposit, param.CheckedMinTurnover);
            command.CpaProductList = DealInfoHelper.BuildCpaProductListXml(param.ProductGroup, param.CheckedMinTurnover);
            command.RedepositDays = param.RedepositDays;
            command.RedepositRate = param.RedepositRate / OneHundred;
        }

        private static void AssignRevenueShareDeal(BaseDealCommand command, DealSettingParam param)
        {
            var (tierSettingXml, tierDeductionsXml) = GetRevenueShareSettingXmls(param);

            command.QMTurnover = param.QmTurnover;
            command.IsActivePlayerSum = param.IsActivePlayerSum;
            command.TierList = tierSettingXml;
            command.DeductionList = tierDeductionsXml;
        }

        private static (string tierSettingXml, string tierDeductionsXml) GetRevenueShareSettingXmls(DealSettingParam param)
        {
            var tierSettingXml = DealInfoHelper.BuildRevenueShareTierSettingXml(param.RevenueTierSetting, param.PlatformFeeSetting);

            var tierDeductionSettingList = param.PlatformFeeSetting.Concat(new[] { param.DepositFeeSetting, param.WithdrawalFeeSetting });

            var tierDeductionsXml = DealInfoHelper.BuildRevenueShareTierDeductionSettingXml(tierDeductionSettingList);

            return (tierSettingXml, tierDeductionsXml);
        }
    }
}
