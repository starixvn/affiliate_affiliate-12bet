import * as types from './types';
import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';

export { setPagingOption };

export const setReportTitle = (data) => {
    return {
        type: types.SET_REPORT_TITLE,
        data
    }
}

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setViewLevel = (data) => {
    return {
        type: types.SET_VIEW_LEVEL,
        data
    }
}

export const setProductList = (data) => {
    return {
        type: types.SET_PRODUCT_LIST,
        data
    }
}

export const setCurrencyList = (data) => {
    return {
        type: types.SET_CURRENCY_LIST,
        data
    }
}

export const setPaymentCurrencyList = (data) => {
    return {
        type: types.SET_PAYMENT_CURRENCY_LIST,
        data
    }
}

export const setIsCheckedDatePicker = (data) => {
    return {
        type: types.SET_IS_CHECKED_DATE_PICKER,
        data
    }
}

export const fetchData = (param, isMainView) => async () => {
    const url = `Portal/Report/${isMainView ? 'GetMainData' : 'GetDetailData'}`;
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}