import { globalResource } from '../../../../modules/globalResource';
import { selectedAllProduct, maxWidth, minDate } from '../../../../modules/constants';

export { globalResource, selectedAllProduct, maxWidth, minDate }

export const headerText = {
    Index: '#',
    Date: 'Date',
    Type: 'Type',
    Amount: 'Amount',
    Status: 'Status',
    Creator: 'Creator',
    Description: 'Description',
}

export const CalculatedMonth = 2;
export const MONTHLY_TOTAL = 0;
export const MONTHLY_EARNING = 201;
export const PAYMENT_REQUEST = 202;
export const ADJUSTMENT = 203;
export const SUBAFFILIATE = 204;
export const CPA_EARNING = 206;

export const monthlyEarning = 'Monthly Earning'

export const transTypeList = {
    [MONTHLY_TOTAL]: 'Transaction',
    [MONTHLY_EARNING]: monthlyEarning,
    [PAYMENT_REQUEST]: 'Payment Request',
    [ADJUSTMENT]: 'Adjustment',
    [SUBAFFILIATE]: 'Sub-Affiliate',
    [CPA_EARNING]: 'CPA Earning',
}