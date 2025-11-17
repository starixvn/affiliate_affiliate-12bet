import { format } from "../../../../modules/numberFormat";
import { money } from "../../../../modules/constants";

export const FIRST_ITEM_INDEX = 0;
export const INFINITY_MONEY = money.AllowedMaxValue;
export const INFINITY_NUMBER = 30000;
export const PERCENTAGE_MAX_VALUE = 100;
export const DEAL_REVENUE_SHARE = 1;
export const DEAL_CPA = 3;
export const DEAL_HYBRID = 4;
export const DEAL_HYBRID_CPA_SECTION = 'CPA:';
export const DEAL_HYBRID_REVENUE_SHARE_SECTION = 'Revenue Share:';

const _subAffRateValueList = () => {
    let min = 1.0,
        max = 10.0;

    const subAffRateList = {};

    while (min <= max) {
        subAffRateList[format(min / 100, 3)] = format(min, 1) + '%';
        min = min + 1;
    }

    return subAffRateList;
}

export const subAffRateValueList = _subAffRateValueList();

export const defaultSubAffRate = 0.05;

export const mappingFields = {
    MinFdm: 'Min FTD',
    MinTotalDeposit: 'Min Total Deposit',
    MinTO: 'Min Turnover',
    CpaAmount: 'CPA Amount'
}

export const gridHeader = {
    RowNum: '#',
    DealName: 'Deal Name',
    DealType: 'Deal Type',
    NoAff: 'No.Aff',
    Description: 'Description',
    UpdatedBy: 'Updated By',
    UpdatedDate: 'Updated Date',
    Action: 'Action'
}

export const cpaTierSettingTitle = {
    ...mappingFields,
    Action: 'Action'
}

export const messages = {
    addDealSuccessfully: 'Add Deal Successfully.',
    updateDealSuccessfully: 'Update Deal Successfully.',
    requireGroupName: 'Deal name cannot be empty.',
    requireSubCommRate: 'Sub-Affiliate Rate must be selected.',
    requireMinValue: `{0} must be greater than 0.`,
    requireMaxValue: `{0} must be less than ${format(INFINITY_MONEY)}.`,
    requireCountryCodes: 'At least one Target Country must be selected.',
    requireActiveDays: `Activity Period must be between 1 and ${format(INFINITY_NUMBER)}.`,
    requireHoldingTicketsAndHoldingDays: `Holding tickets and Holding days must both be between 1 and ${format(INFINITY_NUMBER)}.`,
    requireQuota: `Quota must be between 1 and ${format(INFINITY_NUMBER)}.`,
    requireTierSetting: 'Missing or invalid Tier Setting. Please contact your system administrator to resolve this issue.',
    requireProductGroup: 'Missing or invalid Product List. Please contact your system administrator to resolve this issue.',
    requireProductGroupHasSelectedProduct: 'Product Group {0} - At least one product must be selected.',
    requireDuplicateProductsInGroups: 'You\'ve selected the same Product in more than one Product Group. Please correct it.',
    requireIncreasing: 'The values in the {0} columns must increase sequentially.',
    requireAllTierSettingsMatchGroupProduct1: 'Product Group {0} has different Min FTD or Min Total Deposit values in some tiers compared to Product Group 1.',
    requireCheckBox: 'Please select at least one condition: Min FTD, Min Total Deposit or Min Turnover.',
    requireMinCpaAmount: 'CPA Amount cannot be negative.',
    requireRedepositRate: `Redeposit Percentage must be between 1 and ${format(PERCENTAGE_MAX_VALUE)}.`,
    requireRedepositPeriod: `Redeposit Period must be between 1 and ${format(INFINITY_NUMBER)}.`,
    requirePaymentFrequency: 'Payment Frequency must be selected.',
    requireStartDate: 'Start date must be later than today.',
    choseAnotherDeal: 'Please choose another deal (not old deal)!',
    confirmChangeDeal: 'Are you sure you want to change the Deal for affiliate: {0}',
    assignDealSuccessfully: 'Assign affiliate to Deal successfully',
}

export const popupEventNames = {
    assignDealSuccessfully: 'assignDealSuccessfully',
}

export const cpaTierSettingDefault = {
    TierId: 1,
    GroupProductId: 1,
    MinFdm: 0,
    MinTotalDeposit: 0,
    MinTO: 0,
    CpaAmount: 1,
}

export const productGroupDefault = {
    ProductIds: '',
    GroupProductId: 1,
}

export const copyRevenueDealDefault = {
    RsDealId: 0,
    RsDealList: [],
}

export const verificationMethodOptions = [
    { key: '1', name: 'OTP', checked: false },
]