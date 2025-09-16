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
        type: types.SET_PARAMS,
        data
    }
}

export const toggleSubmit = () => {
    return {
        type: types.TOGGLE_SUBMIT
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
        type: types.TOGGLE_DEAL_POPUP
    }
}

export const setAffName = (data) => {
    return {
        type: types.SET_AFF_NAME,
        data
    }
}

export const shouldTriggerSubmit = () => {
    return {
        type: types.SHOULD_TRIGGER_SUBMIT,
    }
}