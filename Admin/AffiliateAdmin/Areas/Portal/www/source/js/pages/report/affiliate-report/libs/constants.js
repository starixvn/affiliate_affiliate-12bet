import { defaultBaseCurrency, minMonthDate } from '../../../../modules/constants';

export { defaultBaseCurrency, minMonthDate };

const sortByCommon = {
    Turnover: 2,
    GGR: 3,
    Earning: 4
}

export const defaultSortBy = 1;

export const REVENUE_SHARE_GROUP_TYPE_ID = 1;

export const sortByMainView = {
    Affiliate: 1,
    ...sortByCommon,
    Signup: 5,
    FTD: 6,
    "FTD Amt": 7,
    "Active players": 8,
    "Qualified active players": 9
};

export const sortByMonthOnMonthView = Object.assign({}, {
    Month: 1
}, sortByCommon);

export const viewLevel = {
    main: 1,
    monthOnMonth: 2
}

export const sortDirectionType = {
    ascending: 0,
    descending: 1
}

export const totalText = 'Total (all pages)';

export const resource = {
    reportName: 'AFFILIATE REPORT',
    reportDetailName: 'MONTH ON MONTH',
    space: ' - '
}

export const allStatuses = 'Approved, Suspended';

export const statusFilter = {
    [allStatuses]: 'All Statuses',
    Approved: 'Approved',
    Suspended: 'Suspended'
}

export const reportKey = {
    UserName: 'UserName',
    MonthDateString: 'MonthDateString',
    Status: 'Status',
    PreferredLanguage: 'PreferredLanguage',
    PaymentCurrency: 'PaymentCurrency',
    CommGroupName: 'CommGroupName',
    PaymentFrequency: 'PaymentFrequency',
    TotalClick: 'TotalClick',
    UniqueClick: 'UniqueClick',
    Signup: 'Signup',
    Fdm: 'Fdm',
    Fdm_Amount: 'Fdm_Amount',
    FDM_TotalDeposit: 'FDM_TotalDeposit',
    ActivePlayer: 'ActivePlayer',
    QualifiedMember: 'QualifiedMember',
    NoOfSubAff: 'NoOfSubAff',
    TotalDeposit: 'TotalDeposit',
    Deposit: 'Deposit',
    Withdrawal: 'Withdrawal',
    Turnover: 'Turnover',
    Ggr: 'Ggr',
    Bonus: 'Bonus',
    Rebate: 'Rebate',
    PlatformFee: 'PlatformFee',
    DepositFee: 'DepositFee',
    WithdrawalFee: 'WithdrawalFee',
    TotalFee: 'TotalFee',
    EarningTitle: 'EarningTitle',
    Earning: 'Earning',
    CommissionRate: 'CommissionRate',
    CpaAmount: 'CpaAmount',
    TotalMainEarning: 'TotalMainEarning',
    SubAffEarningTitle: 'SubAffEarningTitle',
    SubAffEarning: 'SubAffEarning',
    SubCpaAmount: 'SubCpaAmount',
    TotalSubEarning: 'TotalSubEarning',
    TotalEarning: 'TotalEarning',
    AffWithdrawal: 'AffWithdrawal',
    AffAdjustment: 'AffAdjustment',
    BalanceBf: 'BalanceBf',
    CurrentBBF: 'CurrentBBF',
    MemberStatistics: 'MemberStatistics',
    AffiliateStatistics: 'AffiliateStatistics',
    MonthOnMonth: 'MonthOnMonth',
    PlayerGgr: 'PlayerGgr'
}

export const headerText = {
    [reportKey.UserName]: 'Affiliate',
    [reportKey.Status]: 'Status',
    [reportKey.PreferredLanguage]: 'Language',
    [reportKey.MonthDateString]: 'Month',
    [reportKey.PaymentCurrency]: 'Linked Account Currency',
    [reportKey.CommGroupName]: 'Deal Name',
    [reportKey.PaymentFrequency]: 'Payment Frequency',
    [reportKey.TotalClick]: 'Total Click',
    [reportKey.UniqueClick]: 'Unique Click',
    [reportKey.Signup]: 'Signup',
    [reportKey.Fdm]: 'FTD Count',
    [reportKey.Fdm_Amount]: 'FTD Amount',
    [reportKey.FDM_TotalDeposit]: "FTD's Total Deposit",
    [reportKey.ActivePlayer]: 'Active Player',
    [reportKey.QualifiedMember]: 'Qualified Player',
    [reportKey.NoOfSubAff]: 'Sub-Affiliate',
    [reportKey.TotalDeposit]: 'Total Deposit Count',
    [reportKey.Deposit]: 'Total Deposit Amount',
    [reportKey.Withdrawal]: 'Withdrawal',
    [reportKey.Turnover]: 'Turnover',
    [reportKey.Ggr]: 'GGR',
    [reportKey.Bonus]: 'Bonus',
    [reportKey.Rebate]: 'Rebate',
    [reportKey.PlatformFee]: 'Royalty Fee',
    [reportKey.DepositFee]: 'Deposit Fee',
    [reportKey.WithdrawalFee]: 'Withdrawal Fee',
    [reportKey.TotalFee]: 'Total Fee',
    [reportKey.EarningTitle]: 'Earning',
    [reportKey.CommissionRate]: 'Revenue Share%',
    [reportKey.Earning]: 'Revenue Share',
    [reportKey.CpaAmount]: 'Approved CPA Amount',
    [reportKey.TotalMainEarning]: 'Total',
    [reportKey.SubAffEarningTitle]: 'Sub-Affiliate Earning',
    [reportKey.SubAffEarning]: 'Revenue Share',
    [reportKey.SubCpaAmount]: 'Approved CPA Amount',
    [reportKey.TotalSubEarning]: 'Total',
    [reportKey.TotalEarning]: 'Total Earning',
    [reportKey.AffWithdrawal]: 'Withdrawal',
    [reportKey.AffAdjustment]: 'Adjustment',
    [reportKey.BalanceBf]: 'Balance B/F',
    [reportKey.CurrentBBF]: 'Current Balance B/F',
    [reportKey.MemberStatistics]: 'Player Statistics',
    [reportKey.AffiliateStatistics]: 'Affiliate Statistics',
    [reportKey.MonthOnMonth]: 'Month on Month',
    [reportKey.PlayerGgr]: 'Player GGR'
}

export const headerConfig = {
    [reportKey.UserName]: { label: headerText[reportKey.UserName], isShowable: (claimPrincipal, isMainView) => isMainView },
    [reportKey.Status]: { label: headerText[reportKey.Status], isShowable: (claimPrincipal, isMainView) => isMainView },
    [reportKey.PreferredLanguage]: { label: headerText[reportKey.PreferredLanguage], isShowable: (claimPrincipal, isMainView) => isMainView },
    [reportKey.MonthDateString]: { label: headerText[reportKey.MonthDateString], isShowable: (claimPrincipal, isMainView) => !isMainView },
    [reportKey.PaymentCurrency]: { label: headerText[reportKey.PaymentCurrency], isShowable: (claimPrincipal, isMainView) => isMainView },
    [reportKey.CommGroupName]: { label: headerText[reportKey.CommGroupName] },
    [reportKey.PaymentFrequency]: { label: headerText[reportKey.PaymentFrequency] },
    [reportKey.TotalClick]: { label: headerText[reportKey.TotalClick] },
    [reportKey.UniqueClick]: { label: headerText[reportKey.UniqueClick] },
    [reportKey.Signup]: { label: headerText[reportKey.Signup] },
    [reportKey.Fdm]: { label: headerText[reportKey.Fdm] },
    [reportKey.Fdm_Amount]: { label: headerText[reportKey.Fdm_Amount] },
    [reportKey.FDM_TotalDeposit]: { label: headerText[reportKey.FDM_TotalDeposit], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
    [reportKey.ActivePlayer]: { label: headerText[reportKey.ActivePlayer] },
    [reportKey.QualifiedMember]: { label: headerText[reportKey.QualifiedMember] },
    [reportKey.NoOfSubAff]: { label: headerText[reportKey.NoOfSubAff] },
    [reportKey.TotalDeposit]: { label: headerText[reportKey.TotalDeposit] },
    [reportKey.MemberStatistics]: {
        label: headerText[reportKey.MemberStatistics],
        cols: {
            [reportKey.Deposit]: { label: headerText[reportKey.Deposit] },
            [reportKey.Withdrawal]: { label: headerText[reportKey.Withdrawal] },
            [reportKey.Turnover]: { label: headerText[reportKey.Turnover] },
            [reportKey.Ggr]: { label: headerText[reportKey.Ggr] },
            [reportKey.Bonus]: { label: headerText[reportKey.Bonus] },
            [reportKey.Rebate]: { label: headerText[reportKey.Rebate] },
            [reportKey.PlatformFee]: { label: headerText[reportKey.PlatformFee], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
            [reportKey.DepositFee]: { label: headerText[reportKey.DepositFee], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
            [reportKey.WithdrawalFee]: { label: headerText[reportKey.WithdrawalFee], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
            [reportKey.TotalFee]: { label: headerText[reportKey.TotalFee], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker }
        }
    },
    [reportKey.AffiliateStatistics]: {
        label: headerText[reportKey.AffiliateStatistics],
        cols: {
            [reportKey.EarningTitle]: {
                label: headerText[reportKey.EarningTitle],
                cols: {
                    [reportKey.CommissionRate]: { label: headerText[reportKey.CommissionRate], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
                    [reportKey.Earning]: { label: headerText[reportKey.Earning], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
                    [reportKey.CpaAmount]: { label: headerText[reportKey.CpaAmount], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
                    [reportKey.TotalMainEarning]: { label: headerText[reportKey.TotalMainEarning], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker }
                }
            },
            [reportKey.SubAffEarningTitle]: {
                label: headerText[reportKey.SubAffEarningTitle],
                cols: {
                    [reportKey.SubAffEarning]: { label: headerText[reportKey.SubAffEarning], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
                    [reportKey.SubCpaAmount]: { label: headerText[reportKey.SubCpaAmount], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
                    [reportKey.TotalSubEarning]: { label: headerText[reportKey.TotalSubEarning], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker }
                }
            },
            [reportKey.TotalEarning]: { label: headerText[reportKey.TotalEarning], isShowable: (claimPrincipal, isMainView, isCheckedDatePicker) => !isCheckedDatePicker },
            [reportKey.AffWithdrawal]: { label: headerText[reportKey.AffWithdrawal] },
            [reportKey.AffAdjustment]: { label: headerText[reportKey.AffAdjustment] },
            [reportKey.BalanceBf]: { label: headerText[reportKey.BalanceBf] },
            [reportKey.CurrentBBF]: { label: headerText[reportKey.CurrentBBF], isShowable: (claimPrincipal, isMainView) => isMainView }
        }
    },
}