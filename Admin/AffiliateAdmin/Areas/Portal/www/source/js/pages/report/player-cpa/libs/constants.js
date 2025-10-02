export const reportName = 'PLAYER CPA REPORT';

export const statusOptions = [
    { value: -1, label: 'All Statuses' },
    { value: 2, label: 'Eligible' },
    { value: 3, label: 'Settled' },
    { value: 1, label: 'Ineligible' },
    { value: 4, label: 'Rejected' },
    { value: 5, label: 'Quota Exceeded' },
    { value: 0, label: 'Pending' },
]

export const viewByOptions = [
    { value: '1', label: 'Active Qualified Date' },
    { value: '2', label: 'Holding Qualified Date' }
]

export const DATE_FORMAT = 'MM/DD/YYYY';

export const defaultParams = {
    userName: '',
    custName: '',
    dealName: '',
    statusId: -1,
    viewBy: '1',
    fromDate: '',
    toDate: '',
    sortColumn: 'affUserName',
    isAscending: true
}

export const defaultGeneralData = {
    totalPlayers: 0,
    totalAffiliates: 0,
    totalDeals: 0,
    totalCpaStatus: 0,
    totalStatus: 0,
}

export const TotalText = "Total (all pages)"


export const headerText = {
    No: '#',
    Affiliate: 'Affiliate',
    Player: 'Player',
    RegistrationDate: 'Registration Date',
    DealName: 'Deal Name',
    PaymentFrequency: 'Payment Frequency',
    FTD: 'FTD',
    TotalDeposit: 'Total Deposit',
    Turnover: 'Turnover',
    ActiveQualifiedDate: 'Active Qualified Date',
    CPAAmount: 'CPA Amount',
    BetTicket: 'Bet Ticket',
    HoldingQualifiedDate: 'Holding Qualified Date',
    HoldingExpiredDate: 'Holding Expired Date',
    EstimatedCPAAmount: 'Estimated CPA Amount',
    FirstDepositDate: 'First Deposit Date',
    ReDepositDays: 'Re-check days',
    ExpiredRedepositDate: 'Expired Date',
    IsRedeposit: 'Is Redeposit',
    CPAStatus: 'CPA Status'
};

export const dataKey = {
    No: 'no',
    Affiliate: 'affUserName',
    Player: 'custUserName',
    RegistrationDate: 'registeredDateStr',
    DealName: 'dealName',
    PaymentFrequency: 'scheduleName',
    FTD: 'ftd',
    TotalDeposit: 'totalDeposit',
    Turnover: 'isTO',
    ActiveQualifiedDate: 'aqdStr',
    CPAAmount: 'cpaAmount',
    BetTicket: 'betTicket',
    HoldingQualifiedDate: 'hqdStr',
    HoldingExpiredDate: 'hedStr',
    EstimatedCPAAmount: 'estimatedCPAAmount',
    FirstDepositDate: 'firstDepositDateStr',
    ReDepositDays: 'reDepositDays',
    ExpiredRedepositDate: 'expiredRedepositDateStr',
    IsRedeposit: 'isRedeposit',
    CPAStatus: 'cpaStatus',
    HoldingTickets: 'holdingTickets'
};

export const row1 = [
    {
        title: headerText.No,
        width: 60,
        sortable: false,
        rowSpan: 2,
        startCol: 0,
        field: dataKey.No
    },
    {
        title: headerText.Affiliate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.Affiliate,
        rowSpan: 2,
        startCol: 1,
        field: dataKey.Affiliate
    },
    {
        title: headerText.Player,
        width: 150,
        sortable: true,
        sortColumn: dataKey.Player,
        rowSpan: 2,
        startCol: 2,
        field: dataKey.Player
    },
    {
        title: headerText.RegistrationDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.RegistrationDate,
        rowSpan: 2,
        startCol: 3,
        field: dataKey.RegistrationDate
    },
    {
        title: headerText.DealName,
        width: 150,
        sortable: true,
        sortColumn: dataKey.DealName,
        rowSpan: 2,
        startCol: 4,
        field: dataKey.DealName
    },
    {
        title: headerText.PaymentFrequency,
        width: 120,
        sortable: true,
        sortColumn: dataKey.PaymentFrequency,
        rowSpan: 2,
        startCol: 5,
        field: dataKey.PaymentFrequency
    },
    {
        title: "Active Period",
        sortable: false,
        columnSpan: 5,
        width: 150 * 5,
        startCol: 6,
    },
    {
        title: "Holding Period",
        sortable: false,
        columnSpan: 4,
        width: 150 * 4,
        startCol: 11,
    },
    {
        title: "Redeposit Qualified Period",
        sortable: false,
        columnSpan: 4,
        width: 150 * 4,
        startCol: 15,
    },
    {
        title: headerText.CPAStatus,
        width: 120,
        sortable: true,
        sortColumn: dataKey.CPAStatus,
        rowSpan: 2,
        startCol: 19,
        field: dataKey.CPAStatus
    },
];

export const row2 = [
    {
        title: headerText.FTD,
        width: 100,
        sortable: true,
        sortColumn: dataKey.FTD,
        field: dataKey.FTD
    },
    {
        title: headerText.TotalDeposit,
        width: 150,
        sortable: true,
        sortColumn: dataKey.TotalDeposit,
        field: dataKey.TotalDeposit
    },
    {
        title: headerText.Turnover,
        width: 150,
        sortable: true,
        sortColumn: dataKey.Turnover,
        field: dataKey.Turnover
    },
    {
        title: headerText.ActiveQualifiedDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.ActiveQualifiedDate,
        field: dataKey.ActiveQualifiedDate,
        tooltipTitle: 'Date when player meets required actions (e.g., Min FTD, Deposit, or Turnover).'
    },
    {
        title: headerText.CPAAmount,
        width: 150,
        sortable: true,
        sortColumn: dataKey.CPAAmount,
        field: dataKey.CPAAmount,
        tooltipTitle: 'Click to view Turnover CPA Detail.'
    },
    {
        title: headerText.BetTicket,
        width: 150,
        sortable: true,
        sortColumn: dataKey.HoldingTickets,
        field: dataKey.BetTicket,
        tooltipTitle: 'Total bet tickets placed during holding period.'
    },
    {
        title: headerText.HoldingQualifiedDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.HoldingQualifiedDate,
        field: dataKey.HoldingQualifiedDate,
        tooltipTitle: 'Date when minimum bet tickets are met.'
    },
    {
        title: headerText.HoldingExpiredDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.HoldingExpiredDate,
        field: dataKey.HoldingExpiredDate,
        tooltipTitle: 'End date of the holding period.'
    },
    {
        title: headerText.EstimatedCPAAmount,
        width: 150,
        sortable: true,
        sortColumn: dataKey.EstimatedCPAAmount,
        field: dataKey.EstimatedCPAAmount,
    },
    {
        title: headerText.FirstDepositDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.FirstDepositDate,
        field: dataKey.FirstDepositDate
    },
    {
        title: headerText.ReDepositDays,
        width: 150,
        sortable: true,
        sortColumn: dataKey.ReDepositDays,
        field: dataKey.ReDepositDays
    },
    {
        title: headerText.ExpiredRedepositDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.ExpiredRedepositDate,
        field: dataKey.ExpiredRedepositDate,
        tooltipTitle: 'Last day for player to redeposit.'
    },
    {
        title: headerText.IsRedeposit,
        width: 150,
        sortable: true,
        sortColumn: dataKey.IsRedeposit,
        field: dataKey.IsRedeposit,
        tooltipTitle: 'Shows if the player has redeposited.'
    }
]

export const headerRows = [row1, row2]

export const decimalFields = [
    dataKey.FTD,
    dataKey.TotalDeposit,
    dataKey.CPAAmount,
    dataKey.EstimatedCPAAmount
]

export const dateFields = [
    dataKey.RegistrationDate,
    dataKey.ActiveQualifiedDate,
    dataKey.HoldingQualifiedDate,
    dataKey.HoldingExpiredDate,
    dataKey.FirstDepositDate,
    dataKey.ExpiredRedepositDate
]