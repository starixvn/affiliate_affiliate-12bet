
export const NA = 'N/A';
export const totalText = 'Total (all pages)';

export const NOT_QUALIFIED = 2;
export const QUALIFIED = 3;

export const statusOptions = [
    { key: 'Monitoring', name: 'Monitoring', checked: true },
    { key: 'Not Qualified', name: 'Not Qualified', checked: true },
    { key: 'Qualified', name: 'Qualified', checked: true },
    { key: 'Empty', name: 'Empty', checked: true },
]

export const viewByOptions = {
    1: 'Schedule End Date',
    2: 'Auto Approved Date',
    3: 'Adjustment Date',
}

export const defaultParams = {
    userName: '',
    dealIds: '',
    fromDate: '',
    toDate: '',
    status: '',
    viewBy: 1,
    pageIndex: 1,
    pageSize: 20,
    isExportExcel: false
}

export const defaultAdjustAmountModal = {
    title: '',
    isOpen: false
}

export const defaultAdjustAmount = {
    affId: 0,
    affName: '',
    paymentId: 0,
    estimatedAmount: 0,
    approvedAmount: 0,
    adjustAmount: 0,
    newAmount: '',
    transDesc: ''
}

export const reportKey = {
    RowIdx: 'RowIdx',
    AffUserName: 'AffUserName',
    DealName: 'DealName',
    PaymentFrequency: 'PaymentFrequency',
    CpaPaymentSchedule: 'CpaPaymentSchedule',
    StartScheduleStr: 'StartScheduleStr',
    EndScheduleStr: 'EndScheduleStr',
    RedepositDays: 'RedepositDays',
    RedepositRate: 'RedepositRate',
    ExpiredRedepositDateStr: 'ExpiredRedepositDateStr',
    RedepositStatistics: 'RedepositStatistics',
    TotalEligiblePlayers: 'TotalEligiblePlayers',
    NoOfRedepositPlayers: 'NoOfRedepositPlayers',
    EstimateAmount: 'EstimateAmount',
    Status: 'Status',
    AutomaticallyApprovedCpa: 'AutomaticallyApprovedCpa',
    ApprovedAmount: 'ApprovedAmount',
    ApprovedDateStr: 'ApprovedDateStr',
    ManuallyApproved: 'ManuallyApproved',
    ManuallyApprovedAmount: 'ManuallyApprovedAmount',
    ManuallyApprovedDateStr: 'ManuallyApprovedDateStr',
    Description: 'Description',
    Action: 'Action',
    AdjustedAmount: 'AdjustedAmount',
    FinalCpaAmount: 'FinalCpaAmount',
}

export const headerText = {
    [reportKey.RowIdx]: '#',
    [reportKey.AffUserName]: 'Affiliate',
    [reportKey.DealName]: 'Deal Name',
    [reportKey.PaymentFrequency]: 'Payment Frequency',
    [reportKey.CpaPaymentSchedule]: 'Payment Schedule',
    [reportKey.StartScheduleStr]: 'Start Date',
    [reportKey.EndScheduleStr]: 'End Date',
    [reportKey.TotalEligiblePlayers]: 'Eligible Player',
    [reportKey.RedepositStatistics]: 'Redeposit Statistics',
    [reportKey.RedepositDays]: 'Re-check Days',
    [reportKey.ExpiredRedepositDateStr]: 'Expired Redeposit Date',
    [reportKey.RedepositRate]: 'Redeposit %',
    [reportKey.NoOfRedepositPlayers]: 'No. of Player Redeposit',
    [reportKey.EstimateAmount]: 'Estimated Amount',
    [reportKey.Status]: 'Status',
    [reportKey.AutomaticallyApprovedCpa]: 'Automatically Approved',
    [reportKey.ApprovedAmount]: 'Amount',
    [reportKey.ApprovedDateStr]: 'Date',
    [reportKey.ManuallyApproved]: 'Manually Approved',
    [reportKey.ManuallyApprovedAmount]: 'Amount',
    [reportKey.ManuallyApprovedDateStr]: 'Date',
    [reportKey.Description]: 'Description',
    [reportKey.Action]: 'Action',
    [reportKey.AdjustedAmount]: 'Adjustment Amount',
    [reportKey.FinalCpaAmount]: 'Final Amount',
}

export const headerConfigs = {
    [reportKey.RowIdx]: { label: headerText[reportKey.RowIdx], width: 50 },
    [reportKey.AffUserName]: { label: headerText[reportKey.AffUserName], width: 120 },
    [reportKey.DealName]: { label: headerText[reportKey.DealName], width: 200 },
    [reportKey.CpaPaymentSchedule]: {
        label: headerText[reportKey.CpaPaymentSchedule],
        cols: {
            [reportKey.PaymentFrequency]: { label: headerText[reportKey.PaymentFrequency], width: 80 },
            [reportKey.StartScheduleStr]: { label: headerText[reportKey.StartScheduleStr], width: 80 },
            [reportKey.EndScheduleStr]: { label: headerText[reportKey.EndScheduleStr], width: 80 },
            [reportKey.TotalEligiblePlayers]: { label: headerText[reportKey.TotalEligiblePlayers], width: 80 }
        },
        width: 320
    },
    [reportKey.RedepositStatistics]: {
        label: headerText[reportKey.RedepositStatistics],
        cols: {
            [reportKey.RedepositDays]: { label: headerText[reportKey.RedepositDays], width: 80 },
            [reportKey.ExpiredRedepositDateStr]: { label: headerText[reportKey.ExpiredRedepositDateStr], width: 80 },
            [reportKey.RedepositRate]: { label: headerText[reportKey.RedepositRate], width: 80 },
            [reportKey.NoOfRedepositPlayers]: { label: headerText[reportKey.NoOfRedepositPlayers], width: 80 },
        },
        width: 320
    },
    [reportKey.EstimateAmount]: { label: headerText[reportKey.EstimateAmount], width: 80 },
    [reportKey.Status]: { label: headerText[reportKey.Status], width: 90 },
    [reportKey.AutomaticallyApprovedCpa]: {
        label: headerText[reportKey.AutomaticallyApprovedCpa],
        cols: {
            [reportKey.ApprovedAmount]: { label: headerText[reportKey.ApprovedAmount], width: 85 },
            [reportKey.ApprovedDateStr]: { label: headerText[reportKey.ApprovedDateStr], width: 85 },
        },
        width: 170
    },
    [reportKey.ManuallyApproved]: {
        label: headerText[reportKey.ManuallyApproved],
        cols: {
            [reportKey.ManuallyApprovedAmount]: { label: headerText[reportKey.ManuallyApprovedAmount], width: 85 },
            [reportKey.ManuallyApprovedDateStr]: { label: headerText[reportKey.ManuallyApprovedDateStr], width: 85 },
            [reportKey.Description]: { label: headerText[reportKey.Description], width: 85 },
        },
        width: 275
    },
    [reportKey.Action]: { label: headerText[reportKey.Action], width: 80, isShowable: (isExportExcel, isAdjustable) => !isExportExcel && isAdjustable },
    [reportKey.AdjustedAmount]: { label: headerText[reportKey.AdjustedAmount], width: 85 },
    [reportKey.FinalCpaAmount]: { label: headerText[reportKey.FinalCpaAmount], width: 85 },
}

export const resource = {
    reportName: 'PAYMENT CPA MANAGEMENT',
    space: ' - '
}