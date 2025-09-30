import * as types from './types';
import { post, postWithoutAlert } from '@/modules/ajaxRequest';
import { toggleLoader } from '@/actions/loaderAction';
import { apiUrl } from '../constants/api';
import { showSuccessToast, showErrorToast } from '@/pages/common/components/Toast';

export const setGridData = (item) => {
    return {
        type: types.SET_GRID_DATA,
        data: item,
    };
};

export const setShouldResetScrollPosition = (data) => {
    return {
        type: types.SHOULD_RESET_SCROLL_POSITION,
        data
    }
}

export const fetchData = (param) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await post(apiUrl.getComponentList, param);

        const data = response && response.status === 200 ? response.data : null;

        dispatch(setGridData(data ? data : []));
        dispatch(setShouldResetScrollPosition(true));
    } catch (error) {
        console.error(error);
    } finally {
        dispatch(toggleLoader(false));
    }
}


export const updateComponent = (param, callback) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await postWithoutAlert(apiUrl.updateComponent, param);
        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Update Success!", `Component "${param.componentName}" has been updated successfully.`);
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to update component "${param.componentName}". Please try again.`;
            showErrorToast("Update Failed!", errorMessage);
        }
    }
    catch (error) {
        console.error(error);
        showErrorToast("Update Failed!", `An error occurred while updating component "${param.componentName}".`);
    } finally {
        dispatch(toggleLoader(false));
        callback && callback();
    }
}

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
