import { combineReducers } from 'redux';

import createReducer from '@/modules/createReducer';
import { isShowLoader } from '@/reducers/loaderReducer';
import * as types from '../actions/types';
import { claimsPrincipal } from '@/reducers/claimReducer';

export const targetCountryList = createReducer([], {});
export const languageList = createReducer([], {});

export default combineReducers({
    isShowLoader,
    targetCountryList,
    languageList,
    claimsPrincipal
});