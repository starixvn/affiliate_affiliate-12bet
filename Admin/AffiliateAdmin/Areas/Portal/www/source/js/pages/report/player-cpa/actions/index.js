import * as types from './types';
import { setPagingOption } from '../../../../actions/pagingAction';

export { setPagingOption };

export const setReportTitle = (data) => {
    return {
        type: types.SET_REPORT_TITLE,
        data
    }
}

export const setParams = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setMemberCpaId = (data) => {
    return {
        type: types.SET_MEMBER_CPA_ID,
        data
    }
}

export const setDealId = (data) => {
    return {
        type: types.SET_DEAL_ID,
        data
    }
}

export const toggleDealPopup = () => {
    return {
        type: types.TOGGLE_DEAL_POPUP,
    }
}

export const setPlayerCpaData = (data) => {
    return {
        type: types.SET_PLAYER_CPA_DATA,
        data
    }
}

export const setAffName = (data) => {
    return {
        type: types.SET_AFF_NAME,
        data
    }
}