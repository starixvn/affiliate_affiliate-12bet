import { combineReducers } from 'redux';

import createReducer from '../../../../modules/createReducer';
import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';
import { claimsPrincipal } from '../../../../reducers/claimReducer';

import { copyRevenueDealDefault } from '../libs/constants';

import * as types from '../actions/types';

const dealTypeList = createReducer([], []);
const targetCountryList = createReducer([], []);
const productList = createReducer([], []);
const deductionList = createReducer([], []);
const isModifiable = createReducer(false, {});
const defaultCurrency = createReducer(null, {});
const paymentFrequencyList = createReducer([], []);
const today = createReducer(null, {});

const param = createReducer(null, {
    [types.SET_PARAM]: (prevState, action) => {
        return action.data;
    }
});

const dealInfo = createReducer(null, {
    [types.SET_DEAL_INFO]: (prevState, action) => {
        return !action.data ? null : { ...prevState, ...action.data };
    }
});

const gridData = createReducer(null, {
    [types.SET_GRID_DATA]: (prevState, action) => {
        return action.data;
    }
});

const isSubmitted = createReducer(false, {
    [types.SET_IS_SUBMITTED]: (prevState, action) => {
        return action.data;
    }
});

const isEdit = createReducer(false, {
    [types.SET_IS_EDIT]: (prevState, action) => {
        return action.data;
    }
});

const copyRevenueDeal = createReducer(copyRevenueDealDefault, {
    [types.SET_COPY_REVENUE_DEAL]: (prevState, action) => {
        return { ...prevState, ...action.data };
    }
});

export default combineReducers({
    pagingOption,
    isShowLoader,
    claimsPrincipal,
    param,
    dealTypeList,
    deductionList,
    targetCountryList,
    productList,
    dealInfo,
    gridData,
    isSubmitted,
    isEdit,
    isModifiable,
    defaultCurrency,
    paymentFrequencyList,
    today,
    copyRevenueDeal
});
