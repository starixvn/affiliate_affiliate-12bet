import { bodyCellStyle } from '@/modules/excelStyleConstant';

export const getPaymentCPAStatusStyle = (status) => {
    const baseStyle = { ...bodyCellStyle.center };

    switch (status?.toLowerCase()) {
        case 'monitoring':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: 'f57c00' } } // Orange/Amber
            };
        case 'not qualified':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: 'd32f2f' } } // Red
            };
        case 'qualified':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '2e7d32' } } // Green
            };
        case 'empty':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '7030a0' } } // Purple
            };
        default:
            return baseStyle;
    }
}

export const getPlayerCPAStatusStyle = (status) => {
    const baseStyle = { ...bodyCellStyle.center };

    switch (status?.toLowerCase()) {
        case 'eligibled':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '7030a0' } } // Orange/Amber
            };
        case 'ineligibled':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: 'f57c00' } } // Red
            };
        case 'settled':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '2e7d32' } } // Green
            };
        case 'rejected':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: 'd32f2f' } } // Red
            };
        case 'quota exceeded':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '3b82f6' } } // Blue
            };
        case 'pending':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '596666' } } // Gray
            };
        case 'redeposit-failed':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '000000' } } // Black
            };
        default:
            return baseStyle;
    }
}

export const getPaymentFrequencyStyle = (frequency) => {
    const baseStyle = { ...bodyCellStyle.center };
    switch (frequency?.toLowerCase()) {
        case 'daily':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '596666' } } // Gray
            };
        case 'every 7 days':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '2b9230' } } // Green
            };
        case 'every 10 days':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: 'f57c00' } } // Orange/Amber
            };
        case 'every 15 days':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '7030a0' } } // Purple
            };
        case 'monthly':
            return {
                ...baseStyle,
                font: { ...baseStyle.font, color: { rgb: '000000' } } // Black
            };
        default:
            return baseStyle;
    }
}