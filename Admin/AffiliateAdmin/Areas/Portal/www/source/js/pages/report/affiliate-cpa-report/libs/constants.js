export const reportName = 'AFFILIATE CPA REPORT';

export const MAX_MONTH_DIFF = 5;

export const DATE_FORMAT = 'MM/DD/YYYY';

export const defaultParams = {
    username: '',
    dealName: '',
    viewBy: 1,
    fromDate: '',
    toDate: '',
    sortType: 1,
    sortDirectionType: false,
    pageIndex: 1,
    pageSize: 20,
    isExportExcel: false
}

export const viewByOptions = [
    {
        label: 'Active Qualified Date',
        value: 1
    },
    {
        label: 'Holding Qualified Date',
        value: 2
    },
    {
        label: 'Auto Approved Date',
        value: 3
    },
    {
        label: 'Adjustment Date',
        value: 4
    }
]

export const totalText = 'Total (all pages)';

export const headerText = {
    No: '#',
    Month: 'Month',
    Affiliate: 'Affiliate',
    DealName: 'Deal Name',
    DealType: 'Deal Type',
    PaymentFrequency: 'Payment Frequency',
    Quota: 'Quota',
    CpaAmount: 'CPA Amount',
    EstimatedCpaAmount: 'Estimated CPA Amount',
    ApprovedCpaAmount: 'Approved CPA Amount',
};

export const headers = [
    {
        title: headerText.No,
        width: 40,
        sortable: false,
        field: 'index'
    },
    {
        title: headerText.Month,
        width: 100,
        sortable: true,
        sortType: 1,
        field: 'month'
    },
    {
        title: headerText.Affiliate,
        width: 120,
        sortable: true,
        sortType: 2,
        field: 'affiliate'
    },
    {
        title: headerText.DealName,
        width: 250,
        sortable: true,
        sortType: 3,
        field: 'dealName'
    },
    {
        title: headerText.DealType,
        width: 150,
        sortable: true,
        sortType: 4,
        field: 'dealType'
    },
    {
        title: headerText.PaymentFrequency,
        width: 120,
        sortable: true,
        sortType: 5,
        field: 'paymentFrequency'
    },
    {
        title: headerText.Quota,
        width: 100,
        sortable: true,
        sortType: 6,
        field: 'quota'
    },
    {
        title: headerText.CpaAmount,
        width: 180,
        sortable: true,
        sortType: 7,
        field: 'cpaAmount'
    },
    {
        title: headerText.EstimatedCpaAmount,
        width: 180,
        sortable: true,
        sortType: 8,
        field: 'estimatedCPAAmount'
    },
    {
        title: headerText.ApprovedCpaAmount,
        width: 180,
        sortable: true,
        sortType: 9,
        field: 'approvedCPAAmount'
    }
]