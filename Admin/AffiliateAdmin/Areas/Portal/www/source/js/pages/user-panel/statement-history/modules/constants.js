import { globalResource } from '@/modules/globalResource';
import { selectedAllProduct, maxWidth, minDate, CPAViewBySettings } from '@/modules/constants';

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

export const CALCULATED_MONTH = 2;
export const MONTHLY_TOTAL = 0;

export const transTypeSettings = {
    MonthlyEarning: 201,
    PaymentRequest: 202,    
    Adjustment: 203,
    SubAffiliate: 204,
    CpaEarning: 206,
    SubCpaEarning: 207,
    CpaAdjustment: 208,
}

export const paymentCPAManagementSettings = {
    Tentative: {
        ViewBy: CPAViewBySettings.HoldingQualifiedDate,
        Status: "Monitoring"
    },
    Approved: {
        ViewBy: CPAViewBySettings.AutoApprovedDate,
        Status: "Qualified"
    },
    Adjustment: {
        ViewBy: CPAViewBySettings.AdjustmentDate,
        Status: "NotQualified"
    }
}

