import * as types from '../actions/types';

import createReducer from '@/modules/createReducer';

export const gridData = createReducer(null, {
    [types.SET_GRID_DATA]: (state, action) => action.data,
});

export const shouldResetScrollPosition = createReducer(false, {
    [types.SHOULD_RESET_SCROLL_POSITION]: (state, action) => action.data,
});
