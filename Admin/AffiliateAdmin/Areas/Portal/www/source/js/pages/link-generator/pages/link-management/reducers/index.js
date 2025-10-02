import { combineReducers } from 'redux';

import createReducer from '@/modules/createReducer';
import { pagingOption } from '@/reducers/pagingReducer';
import { isShowLoader } from '@/reducers/loaderReducer';
import * as types from '../actions/types';

export const isModifyInLinkManagement = createReducer(false, {});

export const today = createReducer(null, {});

export const targetCountryList = createReducer([], {});
export const languageList = createReducer([], {});
export const eventList = createReducer([], {});
export const groupList = createReducer([], {});
export const channelList = createReducer([], {});
export const agencyList = createReducer([], {});
export const typeList = createReducer([], {});

export const param = createReducer(null, {
    [types.SET_PARAM](prevState, action) {
        return Object.assign({}, prevState, action.data);
    }
})

export const selectedLink = createReducer(null, {
    [types.SET_SELECTED_LINK](prevState, action) {
        return action.data;
    }
})

export const shouldResetScrollPosition = createReducer(true, {
    [types.SHOULD_RESET_SCROLL_POSITION](prevState, action) {
        return action.data;
    }
})

export const gridData = createReducer(null, {
    [types.SET_GRID_DATA](prevState, action) {
        return action.data;
    }
})

export default combineReducers({
    isModifyInLinkManagement,
    today,
    targetCountryList,
    languageList,
    eventList,
    groupList,
    channelList,
    agencyList,
    typeList,
    param,
    gridData,
    pagingOption,
    isShowLoader,
    shouldResetScrollPosition,
});