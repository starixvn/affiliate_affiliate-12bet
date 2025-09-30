import * as types from '../actions/types';

import createReducer from '@/modules/createReducer';

export const selectedComponentType = createReducer(1, {
    [types.SET_SELECTED_COMPONENT_TYPE]: (state, action) => action.data,
});

export const componentTypesList = createReducer([], {
    [types.SET_COMPONENT_TYPES_LIST]: (state, action) => action.data,
});

export const selectedStatus = createReducer('', {
    [types.SET_SELECTED_STATUS]: (state, action) => action.data,
});

export const searchComponent = createReducer('', {
    [types.SET_SEARCH_COMPONENT]: (state, action) => action.data,
});

export const statusList = createReducer([], {
    [types.SET_STATUS_LIST]: (state, action) => action.data,
});

export const param = createReducer(null, {
    [types.SET_PARAM]: (state, action) => action.data,
});
