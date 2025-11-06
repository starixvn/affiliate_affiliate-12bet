import { post } from '../../../../modules/ajaxRequest';
import { setPagingOption } from '../../../../actions/pagingAction';
import { toggleLoaderUserPanel } from '../../../customer/user-panel/actions';
import * as types from './types';

export { setPagingOption, toggleLoaderUserPanel }


export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    }
}

export const setSortingColumn = (data) => {
    return {
        type: types.SET_SORTING_COLUMN,
        data
    }
}

export const fetchData = (param) => async () => {
    const url = 'Portal/UserPanel/PlayerDetail/GetPlayerDetailList';
    const response = await post(url, param);

    return response && response.status === 200 ? response.data : null;
}