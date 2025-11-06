export const reportName = 'PLAYER CPA REPORT';

export const statusOptions = [
    { key: 2, name: 'Eligible', checked: true },
    { key: 3, name: 'Settled', checked: true },
    { key: 1, name: 'Ineligible', checked: true },
    { key: 4, name: 'Rejected', checked: true },
    { key: 5, name: 'Quota Exceeded', checked: true },
    { key: 0, name: 'Pending', checked: true },
    { key: 6, name: 'Redeposit Failed', checked: true },
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
    statusId: '',
    viewBy: '1',
    fromDate: '',
    toDate: '',
    pageIndex: 1,
    pageSize: 20,
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
    HoldingTickets: 'holdingTickets',
    HoldingBetTickets: 'holdingBetTickets'
};

const DefaultColor = '#FFEDE1';
const ActivePeriodColor = '#ECFDF5';
const HoldingPeriodColor = '#F5F3FF';
const RedipositPeriodColor = '#ECFEFF';

export const row1 = [
    {
        title: headerText.No,
        width: 50,
        sortable: false,
        rowSpan: 2,
        startCol: 0,
        field: dataKey.No,
        color: DefaultColor
    },
    {
        title: headerText.Affiliate,
        width: 115,
        sortable: true,
        sortColumn: dataKey.Affiliate,
        rowSpan: 2,
        startCol: 1,
        field: dataKey.Affiliate,
        color: DefaultColor
    },
    {
        title: headerText.Player,
        width: 150,
        sortable: true,
        sortColumn: dataKey.Player,
        rowSpan: 2,
        startCol: 2,
        field: dataKey.Player,
        color: DefaultColor
    },
    {
        title: headerText.RegistrationDate,
        width: 105,
        sortable: true,
        sortColumn: dataKey.RegistrationDate,
        rowSpan: 2,
        startCol: 3,
        field: dataKey.RegistrationDate,
        color: DefaultColor
    },
    {
        title: headerText.DealName,
        width: 150,
        sortable: true,
        sortColumn: dataKey.DealName,
        rowSpan: 2,
        startCol: 4,
        field: dataKey.DealName,
        color: DefaultColor
    },
    {
        title: headerText.PaymentFrequency,
        width: 95,
        sortable: true,
        sortColumn: dataKey.PaymentFrequency,
        rowSpan: 2,
        startCol: 5,
        field: dataKey.PaymentFrequency,
        color: DefaultColor
    },
    {
        title: "Active Period",
        sortable: false,
        columnSpan: 5,
        width: 86 * 5,
        startCol: 6,
        color: ActivePeriodColor
    },
    {
        title: "Holding Period",
        sortable: false,
        columnSpan: 4,
        width: 85 * 4,
        startCol: 11,
        color: HoldingPeriodColor
    },
    {
        title: "Redeposit Qualified Period",
        sortable: false,
        columnSpan: 4,
        width: 91 * 4,
        startCol: 15,
        color: RedipositPeriodColor
    },
    {
        title: headerText.CPAStatus,
        width: 80,
        sortable: true,
        sortColumn: dataKey.CPAStatus,
        rowSpan: 2,
        startCol: 19,
        field: dataKey.CPAStatus,
        color: DefaultColor
    },
];

export const row2 = [
    {
        title: headerText.FTD,
        width: 100,
        sortable: true,
        sortColumn: dataKey.FTD,
        field: dataKey.FTD,
        color: ActivePeriodColor
    },
    {
        title: headerText.TotalDeposit,
        width: 150,
        sortable: true,
        sortColumn: dataKey.TotalDeposit,
        field: dataKey.TotalDeposit,
        color: ActivePeriodColor
    },
    {
        title: headerText.Turnover,
        width: 150,
        sortable: true,
        sortColumn: dataKey.Turnover,
        field: dataKey.Turnover,
        color: ActivePeriodColor
    },
    {
        title: headerText.ActiveQualifiedDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.ActiveQualifiedDate,
        field: dataKey.ActiveQualifiedDate,
        tooltipTitle: 'Date when player meets required actions (e.g., Min FTD, Deposit, or Turnover).',
        color: ActivePeriodColor
    },
    {
        title: headerText.CPAAmount,
        width: 150,
        sortable: true,
        sortColumn: dataKey.CPAAmount,
        field: dataKey.CPAAmount,
        tooltipTitle: 'Click to view Turnover CPA Detail.',
        color: ActivePeriodColor
    },
    {
        title: headerText.BetTicket,
        width: 150,
        sortable: true,
        sortColumn: dataKey.HoldingTickets,
        field: dataKey.BetTicket,
        tooltipTitle: 'Total bet tickets placed during holding period.',
        color: HoldingPeriodColor
    },
    {
        title: headerText.HoldingQualifiedDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.HoldingQualifiedDate,
        field: dataKey.HoldingQualifiedDate,
        tooltipTitle: 'Date when minimum bet tickets are met.',
        color: HoldingPeriodColor
    },
    {
        title: headerText.HoldingExpiredDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.HoldingExpiredDate,
        field: dataKey.HoldingExpiredDate,
        tooltipTitle: 'End date of the holding period.',
        color: HoldingPeriodColor
    },
    {
        title: headerText.EstimatedCPAAmount,
        width: 150,
        sortable: true,
        sortColumn: dataKey.EstimatedCPAAmount,
        field: dataKey.EstimatedCPAAmount,
        color: HoldingPeriodColor
    },
    {
        title: headerText.FirstDepositDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.FirstDepositDate,
        field: dataKey.FirstDepositDate,
        color: RedipositPeriodColor
    },
    {
        title: headerText.ReDepositDays,
        width: 150,
        sortable: true,
        sortColumn: dataKey.ReDepositDays,
        field: dataKey.ReDepositDays,
        color: RedipositPeriodColor
    },
    {
        title: headerText.ExpiredRedepositDate,
        width: 150,
        sortable: true,
        sortColumn: dataKey.ExpiredRedepositDate,
        field: dataKey.ExpiredRedepositDate,
        tooltipTitle: 'Last day for player to redeposit.',
        color: RedipositPeriodColor
    },
    {
        title: headerText.IsRedeposit,
        width: 150,
        sortable: true,
        sortColumn: dataKey.IsRedeposit,
        field: dataKey.IsRedeposit,
        tooltipTitle: 'Shows if the player has redeposited.',
        color: RedipositPeriodColor
    }
]

export const headerRows = [row1, row2]

export const decimalNullableFields = [
    dataKey.FTD,
    dataKey.TotalDeposit,
    dataKey.CPAAmount,
    dataKey.EstimatedCPAAmount
]

export const dateNullableFields = [
    dataKey.RegistrationDate,
    dataKey.ActiveQualifiedDate,
    dataKey.HoldingQualifiedDate,
    dataKey.HoldingExpiredDate,
    dataKey.FirstDepositDate,
    dataKey.ExpiredRedepositDate
]

export const numberNullableFields = [
    dataKey.HoldingTickets,
    dataKey.ReDepositDays
]


export const booleanNullableFields = [
    dataKey.IsRedeposit
]