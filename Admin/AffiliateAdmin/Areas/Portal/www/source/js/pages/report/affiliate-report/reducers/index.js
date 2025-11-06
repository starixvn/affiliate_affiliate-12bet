import { combineReducers } from 'redux';

import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';

import createReducer from '../../../../modules/createReducer';
import * as types from '../actions/types';
import { viewLevel } from '../libs/constants';

const languageList = createReducer({}, {});
const baseCurrencyList = createReducer([], {});
const isProduction = createReducer(false, {});
const reportCutOffDate = createReducer('06/01/2023', {});

const now = new Date();
const defaultToday = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
const today = createReducer(defaultToday, {});

export const dealList = createReducer([], {});
export const hierarchicalDealList = createReducer([], {});

export const productList = createReducer([], {
    [types.SET_PRODUCT_LIST](prevState, action) {
        return action.data;
    }
});

export const currencyList = createReducer([], {
    [types.SET_CURRENCY_LIST](prevState, action) {
        return action.data;
    }
});

export const paymentCurrencyList = createReducer([], {
    [types.SET_PAYMENT_CURRENCY_LIST](prevState, action) {
        return action.data;
    }
});

export const reportTitle = createReducer('', {
    [types.SET_REPORT_TITLE](prevState, action) {
        return action.data;
    }
})

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const currentViewLevel = createReducer(viewLevel.main, {
    [types.SET_VIEW_LEVEL](prevState, action) {
        return action.data;
    }
})

export const isCheckedDatePicker = createReducer(false, {
    [types.SET_IS_CHECKED_DATE_PICKER](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    param,
    reportTitle,
    isShowLoader,
    reportCutOffDate,
    productList,
    dealList,
    hierarchicalDealList,
    pagingOption,
    languageList,
    currencyList,
    baseCurrencyList,
    paymentCurrencyList,
    isProduction,
    today,
    isCheckedDatePicker,
    currentViewLevel
});