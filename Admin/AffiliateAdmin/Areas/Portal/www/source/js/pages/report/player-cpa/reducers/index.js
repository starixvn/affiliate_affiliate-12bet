import { combineReducers } from 'redux';

import { pagingOption } from '../../../../reducers/pagingReducer';
import { isShowLoader } from '../../../../reducers/loaderReducer';

import createReducer from '../../../../modules/createReducer';
import * as types from '../actions/types.js';
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
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const memberCpaId = createReducer(null, {
    [types.SET_MEMBER_CPA_ID](prevState, action) {
        return action.data;
    }
})

export const dealId = createReducer(0, {
    [types.SET_DEAL_ID](prevState, action) {
        return action.data;
    }
})


export const isShowDealPopup = createReducer(false, {
    [types.TOGGLE_DEAL_POPUP](prevState, action) {
        return !prevState;
    }
})

export const playerCpaData = createReducer(null, {
    [types.SET_PLAYER_CPA_DATA](prevState, action) {
        return action.data;
    }
})

export const affName = createReducer('', {
    [types.SET_AFF_NAME](prevState, action) {
        return action.data;
    }
})

export const shouldTriggerSearch = createReducer(false, {
    [types.TRIGGER_SEARCH](prevState, action) {
        return true;
    },
    [types.SET_PLAYER_CPA_DATA](prevState, action) {
        return false;
    }
})

export default combineReducers({
    params,
    reportTitle,
    memberCpaId,
    isShowLoader,
    pagingOption,
    dealId,
    isShowDealPopup,
    today,
    deals,
    playerCpaData,
    affName,
    shouldTriggerSearch
});