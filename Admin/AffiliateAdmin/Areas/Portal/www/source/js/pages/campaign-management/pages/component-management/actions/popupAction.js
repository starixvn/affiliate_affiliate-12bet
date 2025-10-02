import * as types from './types';
import { post, postWithoutAlert } from '@/modules/ajaxRequest';
import { toggleLoader } from '@/actions/loaderAction';
import { showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';
import { apiUrl } from '../constants/api';

export const openComponentPopup = (isAdd = true, selectedItem = null) => {
    return {
        type: types.OPEN_COMPONENT_POPUP,
        data: {
            isOpen: true,
            isAdd,
            selectedItem
        }
    };
};

export const closeComponentPopup = () => {
    return {
        type: types.CLOSE_COMPONENT_POPUP,
        data: {
            isOpen: false,
            isAdd: true,
            selectedItem: null
        }
    };
};

export const setDealNameList = (data) => {
    return {
        type: types.SET_DEAL_NAME_LIST,
        data
    };
};

export const fetchDealNameList = (groupTypeId) => async (dispatch) => {
    try {
        const params = {
            GroupTypeId: groupTypeId || 0
        };
        const response = await post(apiUrl.getAssignDealList, params);
        
        if (response && response.status === 200 && response.data) {
            dispatch(setDealNameList(response.data));
        } else {
            dispatch(setDealNameList([]));
        }
    } catch (error) {
        console.error('Error fetching deal name list:', error);
        dispatch(setDealNameList([]));
    }
};

export const insertComponent = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.insertComponent, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Insert Success!", `Component "${param.componentName}" has been created successfully.`);
            return { IsSuccessful: true, Message: "Component created successfully" };
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to create component "${param.componentName}". Please try again.`;
            showErrorToast("Insert Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Insert Failed!", `An error occurred while create component "${param.componentName}".`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}

export const insertDeal = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.insertDeal, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Insert Success!", `Deal "${param.dealName}" has been created successfully.`);
            return { IsSuccessful: true, Message: "Deal created successfully" };
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to create deal "${param.dealName}". Please try again.`;
            showErrorToast("Insert Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Insert Failed!", `An error occurred while create deal "${param.dealName}".`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}