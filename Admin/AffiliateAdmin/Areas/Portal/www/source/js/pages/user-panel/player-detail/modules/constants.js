import { selectedAllProduct, defaultBaseCurrency, shortedMonthNames, minMonthDate, maxWidth } from '../../../../modules/constants';
import { globalResource } from '../../../../modules/globalResource';

export { globalResource, maxWidth, selectedAllProduct, shortedMonthNames, minMonthDate, defaultBaseCurrency };

export const headerText = {
    Index: '#',
    UserName: 'User Name',
    IbcUserName: globalResource.SystemUserName,
    RegisteredDateText: 'Registration Date',
    FirstDepositDateText: 'FTD Date',
    FirstDepositAmount: 'FTD Amt',
    Turnover: 'Turnover',
    Ggr: 'GGR',
    Deposit: 'Deposit Amt',
    Withdrawal: 'Withdrawal',
    Bonus: 'Bonus',
    Rebate: 'Rebate',
    DepositFee: 'Deposit Fee',
    WithdrawalFee: 'Withdrawal Fee',
    DepositCount: 'Deposit Count',
}

export const resource = {
    Month: 'Month'
}

export const SortByIdList = {
    Username: 1,
    RegisteredDate: 2,
    Deposit: 3,
    Withdrawal: 4,
    Turnover: 5,
    Ggr: 6,
    Bonus: 7,
    Rebate: 8,
    DepositFee: 9,
    WithdrawalFee: 10,
    IbcUsername: 11,
    FirstDepositDate: 12,
    FirstDepositAmount: 13,
    DepositCount: 14,
};

export const SortingColumnDefault = {
    IsSortAsc: false,
    ColumnName: 'Turnover'
}