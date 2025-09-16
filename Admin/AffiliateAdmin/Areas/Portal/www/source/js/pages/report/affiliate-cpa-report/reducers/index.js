import { combineReducers } from 'redux';

import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';

import createReducer from '../../../../modules/createReducer';
import * as types from '../actions/types';
import { defaultParams } from '../libs/constants';

const now = new Date();
const defaultToday = `${now.getMonth()}/${now.getDate()}/${now.getFullYear()}`;
const today = createReducer(defaultToday, {});
const deals = createReducer([], {});

export const reportTitle = createReducer('', {
    [types.SET_REPORT_TITLE](prevState, action) {
        return action.data;
    }
})

export const params = createReducer(defaultParams, {
    [types.SET_PARAMS](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const isSubmit = createReducer(false, {
    [types.TOGGLE_SUBMIT](prevState) {
        return !prevState;
    }
})

export const dealId = createReducer(null, {
    [types.SET_DEAL_ID](prevState, action) {
        return action.data;
    }
})

export const isShowDealPopup = createReducer(false, {
    [types.TOGGLE_DEAL_POPUP](prevState) {
        return !prevState;
    }
})

export const affName = createReducer('', {
    [types.SET_AFF_NAME](prevState, action) {
        return action.data;
    }
})

export const triggerSubmit = createReducer(false, {
    [types.SHOULD_TRIGGER_SUBMIT](prevState) {
        return !prevState;
    }
})

export default combineReducers({
    params,
    today,
    deals,
    reportTitle,
    isShowLoader,
    pagingOption,
    isSubmit,
    dealId,
    isShowDealPopup,
    affName,
    triggerSubmit
});