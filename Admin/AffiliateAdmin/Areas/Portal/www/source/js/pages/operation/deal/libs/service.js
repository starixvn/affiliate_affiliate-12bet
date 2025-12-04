import {
    messages,
    mappingFields,
    cpaTierSettingDefault,
    productGroupDefault,
    INFINITY_MONEY,
    INFINITY_NUMBER,
    DEAL_CPA,
    DEAL_REVENUE_SHARE,
    DEAL_HYBRID_CPA_SECTION,
    DEAL_HYBRID_REVENUE_SHARE_SECTION,
    defaultSubAffRate
} from './constants';

import { formatDecimal } from '../../../../modules/numberFormat';
import { buildDefaultRevenueShare, validateRevenueShareInfo } from './revenue-share-service';

const commonDealInfo = {
    GroupId: 0,
    DealName: '',
    DealType: 3,
    VerificationMethods: '',
    Description: '',
    IsSubCommRate: false,
    SubCommRate: 0,
    CountryCodes: '',
    ActiveDays: '',
    IsActivePlayerHoldingPeriod: false,
    HoldingTickets: 0,
    HoldingDays: 0,
    IsQuota: false,
    IsRedeposit: false,
    RedepositRate: 0,
    RedepositDays: 0,
    StartDate: '',
    Quota: 0,
    ScheduleId: 0,
    CheckedMinFdm: false,
    CheckedMinTotalDeposit: false,
    CheckedMinTurnover: false,
    CPATierSetting: [
        {
            ...cpaTierSettingDefault
        }
    ],
    ProductGroup: [
        {
            ...productGroupDefault
        },
    ]
}

export const buildDefaultDealInfo = (targetCountryList, dealName = '', dealType = DEAL_CPA, deductionList = [], productList = []) => {
    const newDealInfo = { ...commonDealInfo };
    newDealInfo.CountryCodes = getAllTargetCountryCodes(targetCountryList);
    newDealInfo.DealType = dealType;
    newDealInfo.DealName = dealName;

    if (dealType !== DEAL_CPA) {
        if (dealType === DEAL_REVENUE_SHARE) {
            newDealInfo.IsSubCommRate = true;
            newDealInfo.SubCommRate = defaultSubAffRate;
        }

        const revenueShareInfo = buildDefaultRevenueShare(deductionList, productList);
        return { ...newDealInfo, ...revenueShareInfo };
    }

    return newDealInfo;
}

export const _buildDetailDealInfo = (dealInfo) => {
    if (!dealInfo) {
        return null;
    }

    const {
        HoldingDays,
        HoldingTickets,
        Quota,
        RedepositRate,
        RedepositDays,
        ProductGroup,
        CPATierSetting,
        DepositFeeSetting,
        WithdrawalFeeSetting,
        ScheduleId,
        StartDate,
        StartDateString,
        ...rest
    } = dealInfo;

    const isActivePlayerHoldingPeriod = HoldingDays > 0 && HoldingTickets > 0;
    const isQuota = Quota > 0;
    const isRedeposit = RedepositRate > 0 && RedepositDays > 0;
    const productGroup = !ProductGroup || ProductGroup.length === 0 ? [productGroupDefault] : ProductGroup;

    const firstGroupProductId = productGroup?.[0]?.GroupProductId;
    const firstTier = CPATierSetting.filter(t => t.GroupProductId === firstGroupProductId);

    if (WithdrawalFeeSetting) {
        WithdrawalFeeSetting.DeductedAmount = WithdrawalFeeSetting.IsDeductedPercent
            ? ''
            : WithdrawalFeeSetting.DeductedAmount;
    }

    if (DepositFeeSetting) {
        DepositFeeSetting.DeductedAmount = DepositFeeSetting.IsDeductedPercent
            ? ''
            : DepositFeeSetting.DeductedAmount;
    }

    return {
        ...rest,
        RedepositRate: RedepositRate === 0 ? 0 : formatDecimal(RedepositRate * 100) || 0,
        RedepositDays: RedepositDays || 0,
        HoldingDays: HoldingDays || 0,
        HoldingTickets: HoldingTickets || 0,
        Quota: Quota || 0,
        ProductGroup: productGroup,
        CPATierSetting,
        DepositFeeSetting,
        WithdrawalFeeSetting,
        IsActivePlayerHoldingPeriod: isActivePlayerHoldingPeriod,
        IsQuota: isQuota,
        IsRedeposit: isRedeposit,
        CheckedMinFdm: isCheckedField(firstTier, 'MinFdm'),
        CheckedMinTotalDeposit: isCheckedField(firstTier, 'MinTotalDeposit'),
        CheckedMinTurnover: isCheckedField(firstTier, 'MinTO'),
        StartDate: StartDateString,
        ScheduleId
    };
};

export const _buildOnlyRevenueDealInfo = (dealInfo) => {
    if (!dealInfo) return null;

    return {
        QmTurnover: dealInfo.QmTurnover,
        IsActivePlayerSum: dealInfo.IsActivePlayerSum,
        RevenueTierSetting: dealInfo.RevenueTierSetting,
        PlatformFeeSetting: dealInfo.PlatformFeeSetting,
        DepositFeeSetting: dealInfo.DepositFeeSetting
            ? {
                ...dealInfo.DepositFeeSetting,
                DeductedAmount: dealInfo.DepositFeeSetting.IsDeductedPercent ? '' : dealInfo.DepositFeeSetting.DeductedAmount
            }
            : null,
        WithdrawalFeeSetting: dealInfo.WithdrawalFeeSetting
            ? {
                ...dealInfo.WithdrawalFeeSetting,
                DeductedAmount: dealInfo.WithdrawalFeeSetting.IsDeductedPercent ? '' : dealInfo.WithdrawalFeeSetting.DeductedAmount
            }
            : null,
    };
};


export const isCheckedField = (list, field) => {
    return list && list.some(item => item[field] !== 0);
}

const convertListWithChecked = (list, selectedIdsCSV, idKey, nameKey, checkedItems = []) => {
    const selectedIds = selectedIdsCSV.split(',').filter(Boolean);
    const isCheckAll = selectedIds.length === list.length;

    const disabledSet = new Set(checkedItems.filter(id => !selectedIds.includes(id)));

    return list.map(item => {
        const itemId = item[idKey].toString();
        const isDisabled = disabledSet.has(itemId);
        const isChecked = !isDisabled && (isCheckAll || selectedIds.includes(itemId));

        return {
            [idKey]: item[idKey],
            [nameKey]: item[nameKey],
            Checked: isChecked,
            IsDisabledItem: isDisabled
        };
    });
};


export const convertProductList = (productList, productIds = '', checkedProducts = []) => {
    return convertListWithChecked(productList, productIds, 'ProductId', 'ProductName', checkedProducts);
}

export const convertTargetCountryList = (targetCountryList, targetCountryCodes = '') => {
    return convertListWithChecked(targetCountryList, targetCountryCodes, 'TargetCountryCode', 'TargetCountryName');
}

export const getAllTargetCountryCodes = (targetCountryList) => {
    return targetCountryList.map(c => c.TargetCountryCode).join(',');
}

export const _handleSaveParam = (dealInfo) => {
    const cloneDealInfo = { ...dealInfo };
    const { IsActivePlayerHoldingPeriod, IsQuota, ActiveDays, IsRedeposit, RedepositRate } = cloneDealInfo;

    cloneDealInfo.ActiveDays = ActiveDays || 0;
    cloneDealInfo.RedepositRate = Number(RedepositRate);

    if (!IsActivePlayerHoldingPeriod) {
        cloneDealInfo.HoldingTickets = 0;
        cloneDealInfo.HoldingDays = 0;
    }

    if (!IsRedeposit) {
        cloneDealInfo.RedepositRate = 0;
        cloneDealInfo.RedepositDays = 0;
    }

    if (!IsQuota) {
        cloneDealInfo.Quota = 0;
    }

    return cloneDealInfo;
}

// Start validate deal info
export const validateDealInfo = (dealInfo, today, isAdd = true) => {
    const { DealType, DealName, IsSubCommRate, SubCommRate } = dealInfo;
    let validateResult = { isValid: false, messageList: [] };

    const groupNameValidation = validateGroupName(DealName);
    const subCommRateValidation = validateSubCommRate(IsSubCommRate, SubCommRate);

    if (DealType === DEAL_CPA) {
        validateResult = validateCPAInfo(dealInfo, today, isAdd);
    } else if (DealType === DEAL_REVENUE_SHARE) {
        validateResult = validateRevenueShareInfo(dealInfo);
    } else {
        validateResult = validateHybridInfo(dealInfo, today, isAdd);
    }

    const isValid = groupNameValidation.isValid && subCommRateValidation.isValid && validateResult.isValid;
    const messageList = [...groupNameValidation.messageList, ...subCommRateValidation.messageList, ...validateResult.messageList];

    return { isValid, messageList };
}

export const validateCPAInfo = (dealInfo, today, isAdd = true) => {
    const { CPATierSetting, CheckedMinFdm, CheckedMinTotalDeposit, CheckedMinTurnover, ProductGroup } = dealInfo;

    const generalDealInfoValidation = validateGeneralDealInfo(dealInfo, today, isAdd);
    const checkBoxValidation = validateCheckBox(CheckedMinFdm, CheckedMinTotalDeposit, CheckedMinTurnover);
    const productGroupValidation = validateProductGroup(ProductGroup, CheckedMinTurnover);
    const tierSettingValidation = validateTierSetting(CPATierSetting, CheckedMinFdm, CheckedMinTotalDeposit, CheckedMinTurnover);

    const isValid = generalDealInfoValidation.isValid && checkBoxValidation.isValid && productGroupValidation.isValid && tierSettingValidation.isValid;
    const messageList = [...generalDealInfoValidation.messageList, ...checkBoxValidation.messageList, ...productGroupValidation.messageList, ...tierSettingValidation.messageList];

    return { isValid, messageList };
}

export const validateHybridInfo = (dealInfo, today, isAdd = true) => {
    const validateCPAInfoResult = validateCPAInfo(dealInfo, today, isAdd);
    const validateRevenueShareInfoResult = validateRevenueShareInfo(dealInfo);

    const isValid = validateCPAInfoResult.isValid && validateRevenueShareInfoResult.isValid;

    const cpaMessageList = validateCPAInfoResult.messageList;
    const revenueShareMessageList = validateRevenueShareInfoResult.messageList;

    const addMessage = (messageList, message) => {
        messageList[0] = `<div style="margin-left: 25px; ${message === DEAL_HYBRID_CPA_SECTION && !validateRevenueShareInfoResult.isValid ? 'margin-bottom: -18px' : ''}">` + messageList[0];
        messageList.unshift(message);
        messageList[messageList.length - 1] = messageList[messageList.length - 1] + '</div>';
    }

    if (!validateCPAInfoResult.isValid) {
        addMessage(cpaMessageList, DEAL_HYBRID_CPA_SECTION);
    }
    if (!validateRevenueShareInfoResult.isValid) {
        addMessage(revenueShareMessageList, DEAL_HYBRID_REVENUE_SHARE_SECTION);
    }

    const messageList = [...cpaMessageList, ...revenueShareMessageList];

    return { isValid, messageList };
}

export const validateGroupName = (groupName) => {
    let isValid = true;
    const messageList = [];

    if (!groupName?.trim()) {
        isValid = false;
        messageList.push(messages.requireGroupName);
    }

    return { isValid, messageList };
}

export const validateSubCommRate = (isSubCommRate, subCommRate) => {
    if (!!isSubCommRate && (subCommRate <= 0 || subCommRate > 0.1)) {
        return { isValid: false, messageList: [messages.requireSubCommRate] };
    }

    return { isValid: true, messageList: [] }
}

export const validateGeneralDealInfo = (dealInfo, today, isAdd = true) => {
    const {
        CountryCodes,
        ActiveDays,
        IsActivePlayerHoldingPeriod,
        HoldingTickets,
        HoldingDays,
        IsRedeposit,
        RedepositRate,
        RedepositDays,
        ScheduleId,
        StartDate,
        IsQuota,
        Quota
    } = dealInfo;

    const messageList = [];

    const addIfInvalid = (condition, message) => {
        if (condition) {
            messageList.push(message);
        }
    };

    addIfInvalid(!CountryCodes, messages.requireCountryCodes);

    addIfInvalid(!ActiveDays || ActiveDays < 1 || ActiveDays > INFINITY_NUMBER, messages.requireActiveDays);

    if (IsActivePlayerHoldingPeriod) {
        addIfInvalid((!HoldingTickets || HoldingTickets < 1 || HoldingTickets > INFINITY_NUMBER)
            || (!HoldingDays || HoldingDays < 1 || HoldingDays > INFINITY_NUMBER),
            messages.requireHoldingTicketsAndHoldingDays);
    }

    if (IsRedeposit) {
        const depositRate = Number(RedepositRate);

        addIfInvalid(Number.isNaN(depositRate) || depositRate < 1 || depositRate > 100, messages.requireRedepositRate);
        addIfInvalid(!RedepositDays || RedepositDays < 1 || RedepositDays > INFINITY_NUMBER, messages.requireRedepositPeriod);
    }

    if (IsQuota) {
        addIfInvalid(!Quota || Quota < 1 || Quota > INFINITY_NUMBER, messages.requireQuota);
    }

    addIfInvalid(ScheduleId === 0, messages.requirePaymentFrequency);

    const startDate = new Date(StartDate);
    const todayDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    addIfInvalid(isAdd && ((!startDate instanceof Date || isNaN(startDate.getTime())) || startDate < todayDate), messages.requireStartDate);

    const isValid = messageList.length === 0;

    return { isValid, messageList };
};

export const validateCheckBox = (checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover) => {
    let isValid = true;
    const messageList = [];

    if (!checkedMinFdm && !checkedMinTotalDeposit && !checkedMinTurnover) {
        isValid = false;
        messageList.push(messages.requireCheckBox);
    }

    return { isValid, messageList };
}

export const validateProductGroup = (productGroup, checkedMinTurnover) => {
    let isValid = true;
    const messageList = [];

    if (!checkedMinTurnover) {
        return { isValid, messageList };
    }

    if (ensureProductGroupAtLeastOne(productGroup)) {
        isValid = false;
        messageList.push(messages.requireProductGroup);

        return { isValid, messageList };
    }

    const productGroupHasSelectedProductValidation = ensureProductGroupHasSelectedProduct(productGroup);
    if (!ensureProductGroupHasSelectedProduct(productGroup).isValid) {
        isValid = false;
        messageList.push(...productGroupHasSelectedProductValidation.messageList);
    }

    const duplicateProductsInGroupsValidation = checkDuplicateProductsInGroups(productGroup);
    if (!duplicateProductsInGroupsValidation.isValid) {
        isValid = false;
        messageList.push(...duplicateProductsInGroupsValidation.messageList);
    }

    return { isValid, messageList };
}

const ensureProductGroupAtLeastOne = (productGroup) => {
    return !productGroup || productGroup.length === 0;
}

const ensureProductGroupHasSelectedProduct = (productGroup) => {
    let isValid = true;
    const messageList = [];

    productGroup.forEach((item, index) => {
        if (!item.ProductIds) {
            isValid = false;
            messageList.push(messages.requireProductGroupHasSelectedProduct.replace('{0}', index + 1));
        }
    });

    return { isValid, messageList };
}

const checkDuplicateProductsInGroups = (productGroups) => {
    const seen = new Set();
    const messageList = [];
    let isValid = true;

    productGroups.forEach((group, index) => {
        const productIds = group.ProductIds.split(',').filter(p => !!p);

        for (const id of productIds) {
            if (seen.has(id)) {
                isValid = false;
                messageList.push(`Product Group ${index + 1} - ${messages.requireDuplicateProductsInGroups}`);
                break;
            }
            seen.add(id);
        }
    });

    return { isValid, messageList };
};

export const validateTierSetting = (tierSetting, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover) => {
    let isValid = true;
    const messageList = [];

    // Validate tier setting at least one
    if (ensureTierSettingAtLeastOne(tierSetting)) {
        isValid = false;
        messageList.push(messages.requireTierSetting);

        return { isValid, messageList };
    }

    const groupedTierSetting = groupTierSettingByGroupProductId(tierSetting);
    const firstGroupTiers = groupedTierSetting[1];
    Object.keys(groupedTierSetting).forEach((groupProductId, index) => {
        const groupTiers = groupedTierSetting[groupProductId];

        // Validate that all tier settings of all product groups must match the tier settings of product group 1
        const allTierSettingsMatchGroupProduct1Validation = validateAllTierSettingsMatchGroupProduct1(index, groupTiers, firstGroupTiers, checkedMinFdm, checkedMinTotalDeposit);

        // Validate increasing by field
        const increasingTiersValidation = validateIncreasingTiers(index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover);

        // Validate value field of tier setting
        const valueFieldValidation = validateValueFieldOfTierSetting(index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover);

        if (!allTierSettingsMatchGroupProduct1Validation.isValid) {
            isValid = false;
            messageList.push(...allTierSettingsMatchGroupProduct1Validation.messageList);
        }

        if (!increasingTiersValidation.isValid) {
            isValid = false;
            messageList.push(...increasingTiersValidation.messageList);
        }

        if (!valueFieldValidation.isValid) {
            isValid = false;
            messageList.push(...valueFieldValidation.messageList);
        }
    });

    return { isValid, messageList };
}

const ensureTierSettingAtLeastOne = (tierSetting) => {
    return !tierSetting || tierSetting.length === 0;
}

const validateIncreasingTiers = (index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover) => {
    let isValid = true;
    const messageList = [];
    const groupProduct = `Product Group ${index + 1}`;
    const fields = [];

    const validations = [
        { fn: minFdmValidationIncreasing, isChecked: checkedMinFdm && index === 0 },
        { fn: minTotalDepositValidationIncreasing, isChecked: checkedMinTotalDeposit && index === 0 },
        { fn: minTurnoverValidationIncreasing, isChecked: checkedMinTurnover },
        { fn: cpaAmountValidationIncreasing, isChecked: true }
    ];

    for (const { fn, isChecked } of validations) {
        const result = fn(groupTiers, isChecked);
        if (!result.isValid) {
            isValid = false;
            fields.push(mappingFields[result.field]);
        }
    }

    if (!isValid) {
        messageList.push(`${groupProduct} - ${messages.requireIncreasing.replace('{0}', fields.join('/'))}`);
    }

    return { isValid, messageList };
}

// Start validate increasing by field
const validateIncreasingByField = (tiers, field, isChecked) => {

    if (isChecked) {
        for (let i = 1; i < tiers.length; i++) {
            if (tiers[i][field] <= tiers[i - 1][field]) {
                return { isValid: false, field };
            }
        }
    }

    return { isValid: true, field };
};

const minFdmValidationIncreasing = (tiers, isChecked) => {
    return validateIncreasingByField(tiers, 'MinFdm', isChecked);
}

const minTotalDepositValidationIncreasing = (tiers, isChecked) => {
    return validateIncreasingByField(tiers, 'MinTotalDeposit', isChecked);
}

const minTurnoverValidationIncreasing = (tiers, isChecked) => {
    return validateIncreasingByField(tiers, 'MinTO', isChecked);
}

const cpaAmountValidationIncreasing = (tiers, isChecked) => {
    return validateIncreasingByField(tiers, 'CpaAmount', isChecked);
}
// End validate increasing by field

// Start validate all tier settings match group product 1
const validateAllTierSettingsMatchGroupProduct1 = (index, groupTiers, firstGroupTiers, checkedMinFdm, checkedMinTotalDeposit) => {
    let isValid = true;
    const messageList = [];

    if (index !== 0 && !isGroup2MatchGroup1(groupTiers, firstGroupTiers, checkedMinFdm, checkedMinTotalDeposit)) {
        isValid = false;
        messageList.push(messages.requireAllTierSettingsMatchGroupProduct1.replace('{0}', index + 1));
    }

    return { isValid, messageList };
}

const isGroup2MatchGroup1 = (group2, group1, checkedMinFdm, checkedMinTotalDeposit) => {
    if (group2.length > group1.length) return false;

    let group1Index = 0;

    for (const item2 of group2) {
        let found = false;

        while (group1Index < group1.length) {
            const item1 = group1[group1Index++];

            const isFdmMatch = !checkedMinFdm || item1.MinFdm === item2.MinFdm;
            const isDepositMatch = !checkedMinTotalDeposit || item1.MinTotalDeposit === item2.MinTotalDeposit;

            if (isFdmMatch && isDepositMatch) {
                found = true;
                break;
            }
        }

        if (!found) return false;
    }

    return true;
};

// End validate all tier settings match group product 1

// Start validate value field of tier setting
const validateValueFieldOfTierSetting = (index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover) => {
    const messageList = [];
    const { minFields, maxFields } = validateValueField(index, groupTiers, checkedMinFdm, checkedMinTotalDeposit, checkedMinTurnover);

    if (minFields.size > 0) {
        const fieldNames = [...minFields].filter(field => field !== mappingFields.CpaAmount).join('/');

        if (fieldNames) {
            messageList.push(`Product Group ${index + 1} - ${messages.requireMinValue.replace('{0}', fieldNames)}`);
        }

        if (minFields.has(mappingFields.CpaAmount)) {
            messageList.push(`Product Group ${index + 1} - ${messages.requireMinCpaAmount}`);
        }
    }

    if (maxFields.size > 0) {
        const fieldNames = [...maxFields].join('/');
        messageList.push(`Product Group ${index + 1} - ${messages.requireMaxValue.replace('{0}', fieldNames)}`);
    }

    const isValid = messageList.length === 0;

    return { isValid, messageList };
};

const validateValueField = (
    index,
    groupTiers,
    checkedMinFdm,
    checkedMinTotalDeposit,
    checkedMinTurnover
) => {
    const minFields = new Set();
    const maxFields = new Set();

    const validateField = (condition, fieldKey, fields) => {
        if (condition && !fields.has(mappingFields[fieldKey])) {
            fields.add(mappingFields[fieldKey]);
        }
    };

    groupTiers.forEach((tier) => {
        const { MinFdm, MinTotalDeposit, MinTO, CpaAmount } = tier;

        const fdmMinInvalid = Number.isNaN(MinFdm) || MinFdm < 1;
        const fdmMaxInvalid = MinFdm >= INFINITY_MONEY;

        const depositMinInvalid = Number.isNaN(MinTotalDeposit) || MinTotalDeposit < 1;
        const depositMaxInvalid = MinTotalDeposit >= INFINITY_MONEY;

        const turnoverMinInvalid = Number.isNaN(MinTO) || MinTO < 1;
        const turnoverMaxInvalid = MinTO >= INFINITY_MONEY;

        const cpaMinInvalid = Number.isNaN(CpaAmount) || CpaAmount < 0;
        const cpaMaxInvalid = CpaAmount >= INFINITY_MONEY;

        if (index === 0) {
            validateField(checkedMinFdm && fdmMinInvalid, 'MinFdm', minFields);
            validateField(checkedMinFdm && fdmMaxInvalid, 'MinFdm', maxFields);

            validateField(checkedMinTotalDeposit && depositMinInvalid, 'MinTotalDeposit', minFields);
            validateField(checkedMinTotalDeposit && depositMaxInvalid, 'MinTotalDeposit', maxFields);
        }

        validateField(checkedMinTurnover && turnoverMinInvalid, 'MinTO', minFields);
        validateField(checkedMinTurnover && turnoverMaxInvalid, 'MinTO', maxFields);

        validateField(cpaMinInvalid, 'CpaAmount', minFields);
        validateField(cpaMaxInvalid, 'CpaAmount', maxFields);
    });

    return { minFields, maxFields };
};

const groupTierSettingByGroupProductId = (tierSetting) => {
    const groupedTierSetting = {};

    tierSetting.forEach(item => {
        if (!groupedTierSetting[item.GroupProductId]) {
            groupedTierSetting[item.GroupProductId] = [];
        }
        groupedTierSetting[item.GroupProductId].push(item);
    });

    return groupedTierSetting;
}
// End validate deal info