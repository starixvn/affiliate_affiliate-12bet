import { combineReducers } from 'redux';

import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';

import createReducer from '../../../../modules/createReducer';
import * as types from '../actions/types';

import { defaultAdjustAmount, defaultAdjustAmountModal, defaultParams } from '../libs/constants';

const now = new Date();
const defaultToday = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
const today = createReducer(defaultToday, {});
const deals = createReducer([], {});

export const params = createReducer(defaultParams, {
    [types.SET_PARAMS](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const isSubmit = createReducer(false, {
    [types.TOGGLE_SUBMIT](prevState, action) {
        return action.data;
    }
})

export const adjustAmountModal = createReducer(defaultAdjustAmountModal, {
    [types.TOGGLE_ADJUST_AMOUNT_MODAL](prevState, action) {
        return action.data;
    }
})

export const adjustAmountParam = createReducer(defaultAdjustAmount, {
    [types.SET_ADJUST_AMOUNT_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export default combineReducers({
    today,
    deals,
    pagingOption,
    isShowLoader,
    params,
    isSubmit,
    adjustAmountModal,
    adjustAmountParam
});
