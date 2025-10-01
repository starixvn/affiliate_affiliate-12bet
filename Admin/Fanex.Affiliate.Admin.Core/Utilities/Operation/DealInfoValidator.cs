namespace Fanex.Affiliate.Admin.Core.Utilities.Operation
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Affiliate.Admin.Core.Constants;
    using Fanex.Affiliate.Admin.Core.DTO;
    using Fanex.Affiliate.Admin.Core.DTO.Operation;
    using Fanex.Affiliate.Admin.Core.MetaModels.Operation;

    public static class DealInfoValidator
    {
        private const int INFINITY_NUMBER = 30_000;
        private const decimal INFINITY_MONEY = Money.AllowedMaxValue;

        private const string MIN_FDM = "MinFdm";
        private const string MIN_TOTAL_DEPOSIT = "MinTotalDeposit";
        private const string MIN_TURNOVER = "MinTO";
        private const string CPA_AMOUNT = "CpaAmount";

        private static readonly IDictionary<string, string> mappingFields = new Dictionary<string, string>
        {
            [MIN_FDM] = "Min FTD",
            [MIN_TOTAL_DEPOSIT] = "Min Total Deposit",
            [MIN_TURNOVER] = "Min Turnover",
            [CPA_AMOUNT] = "CPA Amount"
        };

        private static readonly IDictionary<string, string> messages = new Dictionary<string, string>
        {
            ["requireSubCommRate"] = "Sub-Affiliate Rate must be selected.",
            ["requireGroupName"] = "Deal name cannot be empty.",
            ["requireMinValue"] = "{0} must be greater than 0.",
            ["requireMaxValue"] = "{0} must be less than 100,000,000,000.",
            ["requireCountryCodes"] = "At least one Target Country must be selected.",
            ["requireActiveDays"] = "Activity Period must be between 1 and 30,000.",
            ["requireHoldingTicketsAndHoldingDays"] = "Holding Tickets and Holding Days must both be between 1 and 30,000.",
            ["requireQuota"] = "Quota must be between 1 and 30,000.",
            ["requireTierSetting"] = "Missing or invalid Tier Setting. Please contact your system administrator to resolve this issue.",
            ["requireProductGroup"] = "Missing or invalid Product List. Please contact your system administrator to resolve this issue.",
            ["requireProductGroupHasSelectedProduct"] = "Product Group {0} - At least one product must be selected.",
            ["requireDuplicateProductsInGroups"] = "You've selected the same Product in more than one Product Group. Please correct it.",
            ["requireIncreasing"] = "The values in the {0} columns must increase sequentially.",
            ["requireAllTierSettingsMatchGroupProduct1"] = "Product Group {0} has different Min FTD or Min Total Deposit values in some tiers compared to Product Group 1.",
            ["requireCheckBox"] = "Please select at least one condition: Min FTD, Min Total Deposit or Min Turnover.",
            ["requireMinCpaAmount"] = "CPA Amount cannot be negative.",
            ["requireRedepositRate"] = "Redeposit Percentage must be between 1 and 100.",
            ["requireRedepositPeriod"] = "Redeposit Period must be between 1 and 30,000.",
            ["requirePaymentFrequency"] = "Payment Frequency must be selected.",
            ["requireStartDate"] = "Start date must be later than today."
        };

        public static (bool isValid, List<string> messageList) ValidateGroupName(string groupName)
        {
            var messageList = new List<string>();

            if (string.IsNullOrWhiteSpace(groupName))
            {
                messageList.Add(messages["requireGroupName"]);
                return (false, messageList);
            }

            return (true, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateSubCommRate(bool isSubCommRate, decimal subCommRate)
        {
            var messageList = new List<string>();

            if (isSubCommRate && (subCommRate <= 0 || subCommRate > 0.1m))
            {
                messageList.Add(messages["requireSubCommRate"]);
                return (false, messageList);
            }

            return (true, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateHybridDeal(DealSettingParam dealInfo, IEnumerable<Product> products, bool isAdd)
        {
            var messageList = new List<string>();

            var validateCPAInfoResult = ValidateCPAInfo(dealInfo, isAdd);
            var validateRevenueShareInfoResult = RevenueShareValidator.ValidateRevenueShare(dealInfo, products);

            void AddMessage(List<string> messageListInfo, string message)
            {
                var style = "margin-left: 25px;";
                if (message == "CPA:" && !validateRevenueShareInfoResult.isValid)
                {
                    style += " margin-bottom: -18px;";
                }

                messageListInfo[0] = $"<div style=\"{style}\">{messageListInfo[0]}";
                messageListInfo.Insert(0, message);
                messageListInfo[messageListInfo.Count - 1] += "</div>";
            }

            if (!validateCPAInfoResult.isValid)
            {
                AddMessage(validateCPAInfoResult.messageList, "CPA:");
                messageList.AddRange(validateCPAInfoResult.messageList);
            }

            if (!validateRevenueShareInfoResult.isValid)
            {
                AddMessage(validateRevenueShareInfoResult.messageList, "Revenue Share:");
                messageList.AddRange(validateRevenueShareInfoResult.messageList);
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateRevenueShare(DealSettingParam dealInfo, IEnumerable<Product> products)
            => RevenueShareValidator.ValidateRevenueShare(dealInfo, products);

        public static (bool isValid, List<string> messageList) ValidateCPAInfo(DealSettingParam dealInfo, bool isAdd)
        {
            var messageList = new List<string>();

            var generalDealInfoValidation = ValidateGeneralDealInfo(dealInfo, isAdd);
            if (!generalDealInfoValidation.isValid)
            {
                messageList.AddRange(generalDealInfoValidation.messageList);
            }
            var checkBoxValidation = ValidateCheckBox(dealInfo.CheckedMinFdm, dealInfo.CheckedMinTotalDeposit, dealInfo.CheckedMinTurnover);
            if (!checkBoxValidation.isValid)
            {
                messageList.AddRange(checkBoxValidation.messageList);
            }
            var productGroupValidation = ValidateProductGroup(dealInfo.ProductGroup, dealInfo.CheckedMinTurnover);
            if (!productGroupValidation.isValid)
            {
                messageList.AddRange(productGroupValidation.messageList);
            }
            var tierSettingValidation = ValidateTierSetting(dealInfo.CPATierSetting, dealInfo.CheckedMinFdm, dealInfo.CheckedMinTotalDeposit, dealInfo.CheckedMinTurnover);
            if (!tierSettingValidation.isValid)
            {
                messageList.AddRange(tierSettingValidation.messageList);
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateGeneralDealInfo(DealSettingParam dealInfo, bool isAdd)
        {
            var messageList = new List<string>();

            void AddIfInvalid(bool condition, string message)
            {
                if (condition)
                {
                    messageList.Add(message);
                }
            }

            AddIfInvalid(string.IsNullOrWhiteSpace(dealInfo.CountryCodes), messages["requireCountryCodes"]);

            AddIfInvalid(dealInfo.ActiveDays < 1 || dealInfo.ActiveDays > INFINITY_NUMBER, messages["requireActiveDays"]);

            if (dealInfo.IsActivePlayerHoldingPeriod)
            {
                AddIfInvalid((dealInfo.HoldingTickets < 1 || dealInfo.HoldingTickets > INFINITY_NUMBER)
                    || (dealInfo.HoldingDays < 1 || dealInfo.HoldingDays > INFINITY_NUMBER),
                    messages["requireHoldingTicketsAndHoldingDays"]);
            }

            if (dealInfo.IsQuota)
            {
                AddIfInvalid(dealInfo.Quota < 1 || dealInfo.Quota > INFINITY_NUMBER, messages["requireQuota"]);
            }

            if (dealInfo.IsRedeposit)
            {
                AddIfInvalid(dealInfo.RedepositRate < 1 || dealInfo.RedepositRate > 100, messages["requireRedepositRate"]);
                AddIfInvalid(dealInfo.RedepositDays < 1 || dealInfo.RedepositDays > INFINITY_NUMBER, messages["requireRedepositPeriod"]);
            }

            AddIfInvalid(dealInfo.ScheduleId == 0, messages["requirePaymentFrequency"]);

            var todayDate = DateTimeHelper.Gmt8Now.Date;
            AddIfInvalid(isAdd && (dealInfo.StartDate == null || DateTime.Compare(dealInfo.StartDate.Value.Date, todayDate) < 0), messages["requireStartDate"]);

            bool isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateCheckBox(bool checkedMinFdm, bool checkedMinTotalDeposit, bool checkedMinTurnover)
        {
            var messageList = new List<string>();

            if (!checkedMinFdm && !checkedMinTotalDeposit && !checkedMinTurnover)
            {
                messageList.Add(messages["requireCheckBox"]);
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateProductGroup(IEnumerable<CpaGroupProduct> productGroup, bool checkedMinTurnover)
        {
            var messageList = new List<string>();

            if (!checkedMinTurnover)
            {
                return (true, messageList);
            }

            if (EnsureProductGroupAtLeastOne(productGroup))
            {
                messageList.Add(messages["requireProductGroup"]);
                return (false, messageList);
            }

            var selectedProductValidation = EnsureProductGroupHasSelectedProduct(productGroup);
            if (!selectedProductValidation.isValid)
            {
                messageList.AddRange(selectedProductValidation.messageList);
            }

            var duplicateValidation = CheckDuplicateProductsInGroups(productGroup);
            if (!duplicateValidation.isValid)
            {
                messageList.AddRange(duplicateValidation.messageList);
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        private static bool EnsureProductGroupAtLeastOne(IEnumerable<CpaGroupProduct> productGroup)
        {
            return productGroup == null || !productGroup.Any();
        }

        private static (bool isValid, List<string> messageList) EnsureProductGroupHasSelectedProduct(IEnumerable<CpaGroupProduct> productGroup)
        {
            var messageList = new List<string>();

            var products = productGroup.ToList();

            for (int i = 0; i < products.Count; i++)
            {
                var item = products[i];
                if (string.IsNullOrWhiteSpace(item.ProductIds))
                {
                    messageList.Add(string.Format(messages["requireProductGroupHasSelectedProduct"], i + 1));
                }
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        private static (bool isValid, List<string> messageList) CheckDuplicateProductsInGroups(IEnumerable<CpaGroupProduct> productGroups)
        {
            var seen = new HashSet<string>();
            var messageList = new List<string>();

            var products = productGroups.ToList();
            for (int i = 0; i < products.Count; i++)
            {
                var group = products[i];
                var productIds = group.ProductIds?.Split(',') ?? Array.Empty<string>();

                foreach (var id in productIds)
                {
                    if (seen.Contains(id))
                    {
                        messageList.Add($"Product Group {i + 1} - {messages["requireDuplicateProductsInGroups"]}");
#pragma warning disable S1227 // break statements should not be used except for switch cases
                        break;
#pragma warning restore S1227 // break statements should not be used except for switch cases
                    }
                    seen.Add(id);
                }
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        public static (bool isValid, List<string> messageList) ValidateTierSetting(
            IEnumerable<CpaTierSetting> tierSetting,
            bool checkedMinFdm,
            bool checkedMinTotalDeposit,
            bool checkedMinTurnover)
        {
            var messageList = new List<string>();

            if (EnsureTierSettingAtLeastOne(tierSetting))
            {
                messageList.Add(messages["requireTierSetting"]);
                return (isValid: false, messageList);
            }

            var groupedTierSetting = tierSetting
                .GroupBy(x => x.GroupProductId)
                .ToDictionary(g => g.Key, g => g.ToList());

            var groupedValues = groupedTierSetting.Select(kvp => kvp.Value).ToList();

            for (int index = 0; index < groupedValues.Count; index++)
            {
                var groupTiers = groupedValues[index];

                var matchValidation = ValidateAllTierSettingsMatchGroupProduct1(index, groupTiers, groupedValues[0], checkedMinFdm, checkedMinTotalDeposit);
                if (!matchValidation.isValid)
                {
                    messageList.AddRange(matchValidation.messageList);
                }

                var increasingValidation = ValidateIncreasingTiers(index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover);
                if (!increasingValidation.isValid)
                {
                    messageList.AddRange(increasingValidation.messageList);
                }

                var valueValidation = ValidateValueFieldOfTierSetting(index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover);
                if (!valueValidation.isValid)
                {
                    messageList.AddRange(valueValidation.messageList);
                }
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        private static bool EnsureTierSettingAtLeastOne(IEnumerable<CpaTierSetting> tierSetting)
        {
            return tierSetting == null || !tierSetting.Any();
        }

        private static (bool isValid, List<string> messageList) ValidateIncreasingTiers(
            int index,
            List<CpaTierSetting> groupTiers,
            bool checkedMinFdm,
            bool checkedMinTotalDeposit,
            bool checkedMinTurnover)
        {
            var isValid = true;
            var messageList = new List<string>();
            var groupProduct = $"Product Group {index + 1}";
            var fields = new List<string>();

            var validations = new List<(string Field, bool ShouldCheck)>
            {
                (MIN_FDM, checkedMinFdm && index == 0),
                (MIN_TOTAL_DEPOSIT, checkedMinTotalDeposit && index == 0),
                (MIN_TURNOVER, checkedMinTurnover),
                (CPA_AMOUNT, true)
            };

            foreach (var (field, shouldCheck) in validations)
            {
                if (shouldCheck)
                {
                    var result = ValidateIncreasingByField(groupTiers, field);
                    if (!result.isValid)
                    {
                        isValid = false;
                        fields.Add(mappingFields[result.field]);
                    }
                }
            }

            if (!isValid)
            {
                messageList.Add($"{groupProduct} - {string.Format(messages["requireIncreasing"], string.Join("/", fields))}");
            }

            return (isValid, messageList);
        }

        private static (bool isValid, string field) ValidateIncreasingByField(List<CpaTierSetting> tiers, string field)
        {
            for (int i = 1; i < tiers.Count; i++)
            {
                var prev = GetValue(tiers[i - 1], field);
                var curr = GetValue(tiers[i], field);

                if (curr <= prev)
                {
                    return (false, field);
                }
            }

            return (true, string.Empty);
        }

        private static decimal GetValue(CpaTierSetting tier, string fieldName)
        {
            switch (fieldName)
            {
                case MIN_FDM:
                    return tier.MinFdm;
                case MIN_TOTAL_DEPOSIT:
                    return tier.MinTotalDeposit;
                case MIN_TURNOVER:
                    return tier.MinTO;
                case CPA_AMOUNT:
                    return tier.CpaAmount;
                default:
                    throw new ArgumentException("Invalid field", nameof(fieldName));
            }
        }

        private static (bool isValid, List<string> messageList) ValidateAllTierSettingsMatchGroupProduct1(
            int index,
            List<CpaTierSetting> groupTiers,
            List<CpaTierSetting> firstGroupTiers,
            bool checkFdm,
            bool checkDeposit)
        {
            var messageList = new List<string>();

            if (index != 0 && !IsGroup2MatchGroup1(groupTiers, firstGroupTiers, checkFdm, checkDeposit))
            {
                messageList.Add(messages["requireAllTierSettingsMatchGroupProduct1"].Replace("{0}", (index + 1).ToString()));
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        private static bool IsGroup2MatchGroup1(
            List<CpaTierSetting> group2,
            List<CpaTierSetting> group1,
            bool checkFdm,
            bool checkDeposit
        )
        {
            if (group2.Count > group1.Count)
            {
                return false;
            }

            int group1Index = 0;

            foreach (var item2 in group2)
            {
                bool found = false;

                while (group1Index < group1.Count)
                {
                    var item1 = group1[group1Index++];

                    bool isMinFdmMatch = !checkFdm || item1.MinFdm == item2.MinFdm;
                    bool isMinTotalDepositMatch = !checkDeposit || item1.MinTotalDeposit == item2.MinTotalDeposit;

                    if (isMinFdmMatch && isMinTotalDepositMatch)
                    {
                        found = true;
                        break;
                    }
                }

                if (!found)
                {
                    return false;
                }
            }

            return true;
        }

        private static (bool isValid, List<string> messageList) ValidateValueFieldOfTierSetting(
            int index,
            List<CpaTierSetting> tierSettings,
            bool checkedMinFdm,
            bool checkedMinTotalDeposit,
            bool checkedMinTurnover)
        {
            var messageList = new List<string>();

            var (minFields, maxFields) = ValidateValueField(index, tierSettings, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover);
            if (minFields.Count > 0)
            {
                var fieldNames = string.Join("/", minFields.Where(f => f != mappingFields[CPA_AMOUNT]));
                if (!string.IsNullOrEmpty(fieldNames))
                {
                    messageList.Add($"Product Group {index + 1} - {string.Format(messages["requireMinValue"], fieldNames)}");
                }

                if (minFields.Contains(mappingFields[CPA_AMOUNT]))
                {
                    messageList.Add($"Product Group {index + 1} - {messages["requireMinCpaAmount"]}");
                }
            }

            if (maxFields.Count > 0)
            {
                var fieldNames = string.Join("/", maxFields);
                messageList.Add($"Product Group {index + 1} - {string.Format(messages["requireMaxValue"], fieldNames)}");
            }

            var isValid = messageList.Count == 0;

            return (isValid, messageList);
        }

        private static (HashSet<string> minFields, HashSet<string> maxFields) ValidateValueField(
            int index,
            List<CpaTierSetting> groupTiers,
            bool checkedMinFdm,
            bool checkedMinTotalDeposit,
            bool checkedMinTurnover)
        {
            var minFields = new HashSet<string>();
            var maxFields = new HashSet<string>();

            foreach (var tier in groupTiers)
            {
                bool fdmMinInvalid = tier.MinFdm < 1;
                bool fdmMaxInvalid = tier.MinFdm >= INFINITY_MONEY;

                bool depositMinInvalid = tier.MinTotalDeposit < 1;
                bool depositMaxInvalid = tier.MinTotalDeposit >= INFINITY_MONEY;

                bool turnoverMinInvalid = tier.MinTO < 1;
                bool turnoverMaxInvalid = tier.MinTO >= INFINITY_MONEY;

                bool cpaMinInvalid = tier.CpaAmount < 0;
                bool cpaMaxInvalid = tier.CpaAmount >= INFINITY_MONEY;

                if (index == 0)
                {
                    ValidateField(checkedMinFdm && fdmMinInvalid, "MinFdm", minFields);
                    ValidateField(checkedMinFdm && fdmMaxInvalid, "MinFdm", maxFields);

                    ValidateField(checkedMinTotalDeposit && depositMinInvalid, "MinTotalDeposit", minFields);
                    ValidateField(checkedMinTotalDeposit && depositMaxInvalid, "MinTotalDeposit", maxFields);
                }

                ValidateField(checkedMinTurnover && turnoverMinInvalid, "MinTO", minFields);
                ValidateField(checkedMinTurnover && turnoverMaxInvalid, "MinTO", maxFields);

                ValidateField(cpaMinInvalid, "CpaAmount", minFields);
                ValidateField(cpaMaxInvalid, "CpaAmount", maxFields);
            }

            return (minFields, maxFields);
        }

        private static void ValidateField(bool condition, string fieldKey, HashSet<string> fields)
        {
            if (condition && !fields.Contains(mappingFields[fieldKey]))
            {
                fields.Add(mappingFields[fieldKey]);
            }
        }
    }
}
