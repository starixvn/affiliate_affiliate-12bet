import * as types from './types';
import { setPagingOption } from '../../../../actions/pagingAction';
import { toggleLoader } from '../../../../actions/loaderAction';
import { post } from '../../../../modules/ajaxRequest';
import { showSuccessToast, showErrorToast } from '../../../../pages/common/components/Toast';
import { defaultAdjustAmount } from '../libs/constants';

export { setPagingOption };

export const setParams = (data) => {
    return {
        type: types.SET_PARAMS,
        data
    }
}

export const toggleSubmit = (data) => {
    return {
        type: types.TOGGLE_SUBMIT,
        data
    }
}

export const toggleAdjustAmountModal = (data) => {
    return {
        type: types.TOGGLE_ADJUST_AMOUNT_MODAL,
        data
    }
}

export const setAdjustAmountParam = (data) => {
    return {
        type: types.SET_ADJUST_AMOUNT_PARAM,
        data
    }
}

export const updateCpaAmount = (param) => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));

        const url = 'Portal/PaymentCpaManagement/AdjustmentAmount';

        const response = await post(url, param);

        const isSuccess = response && response.status === 200 && response.data && response.data.Code === 0;
        if (isSuccess) {
            showSuccessToast("Adjust Success!", `Affiliate balance adjusted successfully.`);
            dispatch(toggleAdjustAmountModal({ isOpen: false, title: '' }));
            dispatch(setAdjustAmountParam(defaultAdjustAmount));
            dispatch(toggleSubmit(true));
        }
        else {
            const errorMessage = response?.data?.Message || `Failed to adjust Affiliate Balance. Please try again.`;
            showErrorToast("Adjust Failed!", errorMessage);
        }
    } catch (error) {
        console.error(error);
        showErrorToast("Adjust Failed!", `An error occurred while adjusting the Affiliate Balance.`);
    } finally {
        dispatch(toggleLoader(false));
    }
}