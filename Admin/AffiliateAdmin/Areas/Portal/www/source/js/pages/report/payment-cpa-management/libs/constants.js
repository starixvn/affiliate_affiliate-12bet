
export const NA = 'N/A';
export const totalText = 'Total (all pages)';

export const MONITORING = 1;
export const NOT_QUALIFIED = 2;
export const QUALIFIED = 3;

export const statusList = [
    { key: 'Monitoring', name: 'Monitoring', checked: true },
    { key: 'Not Qualified', name: 'Not Qualified', checked: true },
    { key: 'Qualified', name: 'Qualified', checked: true },
]

export const viewByList = {
    1: 'Schedule End Date',
    2: 'Auto Approved CPA',
    3: 'Adjustment Date',
}

export const defaultParams = {
    username: '',
    dealIds: '',
    fromDate: '',
    toDate: '',
    statusIds: '',
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
    newAmount: 0,
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
    ManualAdjustedCpa: 'ManualAdjustedCpa',
    AdjustedAmount: 'AdjustedAmount',
    AdjustedDateStr: 'AdjustedDateStr',
    Description: 'Description',
    Action: 'Action',
    FinalCpaAmount: 'FinalCpaAmount',
}

export const headerText = {
    [reportKey.RowIdx]: '#',
    [reportKey.AffUserName]: 'Affiliate',
    [reportKey.DealName]: 'Deal Name',
    [reportKey.PaymentFrequency]: 'Payment Frequency',
    [reportKey.CpaPaymentSchedule]: 'CPA Payment Schedule',
    [reportKey.StartScheduleStr]: 'Schedule Start Date',
    [reportKey.EndScheduleStr]: 'Schedule End Date',
    [reportKey.TotalEligiblePlayers]: 'Eligible CPA Players',
    [reportKey.RedepositStatistics]: 'Redeposit Statistics',
    [reportKey.RedepositDays]: 'Re-check Days',
    [reportKey.ExpiredRedepositDateStr]: 'Expired Redeposit Date',
    [reportKey.RedepositRate]: 'Redeposit %',
    [reportKey.NoOfRedepositPlayers]: 'No. of Player Redeposit',
    [reportKey.EstimateAmount]: 'Estimated CPA Amount',
    [reportKey.Status]: 'Status',
    [reportKey.AutomaticallyApprovedCpa]: 'Automatically Approved CPA',
    [reportKey.ApprovedAmount]: 'Amount',
    [reportKey.ApprovedDateStr]: 'Date',
    [reportKey.ManualAdjustedCpa]: 'Manual Adjusted CPA',
    [reportKey.AdjustedAmount]: 'Amount',
    [reportKey.AdjustedDateStr]: 'Date',
    [reportKey.Description]: 'Description',
    [reportKey.Action]: 'Action',
    [reportKey.FinalCpaAmount]: 'Final CPA Amount',
}

export const headerConfigs = {
    [reportKey.RowIdx]: { label: headerText[reportKey.RowIdx], width: 50 },
    [reportKey.AffUserName]: { label: headerText[reportKey.AffUserName], width: 150 },
    [reportKey.DealName]: { label: headerText[reportKey.DealName], width: 250 },
    [reportKey.CpaPaymentSchedule]: {
        label: headerText[reportKey.CpaPaymentSchedule],
        cols: {
            [reportKey.PaymentFrequency]: { label: headerText[reportKey.PaymentFrequency], width: 150 },
            [reportKey.StartScheduleStr]: { label: headerText[reportKey.StartScheduleStr], width: 120 },
            [reportKey.EndScheduleStr]: { label: headerText[reportKey.EndScheduleStr], width: 120 },
            [reportKey.TotalEligiblePlayers]: { label: headerText[reportKey.TotalEligiblePlayers], width: 120 }
        }
    },
    [reportKey.RedepositStatistics]: {
        label: headerText[reportKey.RedepositStatistics],
        cols: {
            [reportKey.RedepositDays]: { label: headerText[reportKey.RedepositDays], width: 120 },
            [reportKey.ExpiredRedepositDateStr]: { label: headerText[reportKey.ExpiredRedepositDateStr], width: 120 },
            [reportKey.RedepositRate]: { label: headerText[reportKey.RedepositRate], width: 120 },
            [reportKey.NoOfRedepositPlayers]: { label: headerText[reportKey.NoOfRedepositPlayers], width: 120 },
        }
    },
    [reportKey.EstimateAmount]: { label: headerText[reportKey.EstimateAmount], width: 120 },
    [reportKey.Status]: { label: headerText[reportKey.Status], width: 150 },
    [reportKey.AutomaticallyApprovedCpa]: {
        label: headerText[reportKey.AutomaticallyApprovedCpa],
        cols: {
            [reportKey.ApprovedAmount]: { label: headerText[reportKey.ApprovedAmount], width: 120 },
            [reportKey.ApprovedDateStr]: { label: headerText[reportKey.ApprovedDateStr], width: 120 },
        }
    },
    [reportKey.ManualAdjustedCpa]: {
        label: headerText[reportKey.ManualAdjustedCpa],
        cols: {
            [reportKey.AdjustedAmount]: { label: headerText[reportKey.AdjustedAmount], width: 120 },
            [reportKey.AdjustedDateStr]: { label: headerText[reportKey.AdjustedDateStr], width: 120 },
            [reportKey.Description]: { label: headerText[reportKey.Description], width: 120 },
        }
    },
    [reportKey.Action]: { label: headerText[reportKey.Action], width: 120, isShowable: (isExportExcel, isAdjustable) => !isExportExcel && isAdjustable },
    [reportKey.FinalCpaAmount]: { label: headerText[reportKey.FinalCpaAmount], width: 120 },
}

export const resource = {
    reportName: 'PAYMENT CPA MANAGEMENT',
    space: ' - '
}