export const defaultPagingOption = {
    PageIndex: 1,
    PageSize: 20,
    TotalItem: 0,
    PageList: [10, 20, 50, 100, 200, 500]
};

export const minMonthDate = { month: 1, year: 2020 };

export const shortedMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const money = {
    AllowedMaxValue: 100000000000,
    AllowedMinValue: -100000000000
}

export const selectedAllProduct = 0;
export const defaultBaseCurrency = 0;
export const defaultInsertId = 0;

export const maxWidth = window.innerWidth - 282;

const maxUserPanelHeight = window.innerHeight - 234;

export const spinnerLoaderWidth = (maxWidth / 2) - 32
export const spinnerLoaderUserPanelHeight = (maxUserPanelHeight / 2) - 32

export const sixMonth = 6;
export const minDate = new Date(2019, 12, 31);

export const submitFail = {
    IsSuccessful: false,
    Message: 'An error occurred while processing your request, please try again later!'
}

export const pcLaptop = 'PC / Laptop';
export const mobile = 'Mobile';

export const deviceTypes = {
    [pcLaptop]: 0,
    [mobile]: 1
}

export const deviceTypesHasAll = {
    'All': -1,
    [pcLaptop]: 0,
    [mobile]: 1
}

export const targetCountryStatus = {
    Normal: 0,
    Blocked: 1
}

export const CPAViewBySettings = {
    ActiveQualifiedDate: 1,
    HoldingQualifiedDate: 2,
    AutoApprovedDate: 3,
    AdjustmentDate: 4,
}