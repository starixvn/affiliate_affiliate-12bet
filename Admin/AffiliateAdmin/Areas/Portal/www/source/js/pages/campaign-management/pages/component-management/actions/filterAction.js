import * as types from './types';

import { post } from '@/modules/ajaxRequest';
import { toggleLoader } from '@/actions/loaderAction';
import { apiUrl } from '../constants/api';

export const setSelectedComponentType = (item) => {
    return {
        type: types.SET_SELECTED_COMPONENT_TYPE,
        data: item,
    };
};

export const setComponentTypesList = (item) => {
    return {
        type: types.SET_COMPONENT_TYPES_LIST,
        data: item,
    };
};

export const setSelectedStatus = (item) => {
    return {
        type: types.SET_SELECTED_STATUS,
        data: item,
    };
};

export const setStatusList = (item) => {
    return {
        type: types.SET_STATUS_LIST,
        data: item,
    };
};

export const setSearchComponent = (item) => {
    return {
        type: types.SET_SEARCH_COMPONENT,
        data: item,
    };
};

export const setParam = (item) => {
    return {
        type: types.SET_PARAM,
        data: item,
    }
}

export const fetchSettings = () => async (dispatch) => {
    try {
        dispatch(toggleLoader(true));
        const response = await post(apiUrl.getSettings, {});
        
        if (response && response.status === 200 && response.data) {
            const { StatusList, ComponentTypes } = response.data;
            
            // Process Component Types
            if (ComponentTypes && ComponentTypes.length > 0) {
                // Map API response to expected format
                const componentTypes = ComponentTypes.map(ct => ({
                    id: ct.ComponentTypeId,
                    name: ct.ComponentTypeName
                }));
                
                // Add Deal as the last item since it's specific
                componentTypes.push({
                    id: Math.max(...componentTypes.map(ct => ct.id)) + 1,
                    name: 'Deal'
                });
                
                dispatch(setSelectedComponentType(componentTypes[0].id));
                dispatch(setComponentTypesList(componentTypes));
            }
            
            // Process Status List
            if (StatusList && StatusList.length > 0) {
                // Map API response to expected format (no need to add "All" option here since it's hardcoded in JSX)
                const statusOptions = StatusList.map(status => ({
                    key: status.StatusId.toString(),
                    name: status.Status,
                    value: status.StatusId.toString()
                }));
                
                // Set the first status (All) as default for filter
                dispatch(setSelectedStatus(''));
                dispatch(setStatusList(statusOptions));
            }
        }
    }
    catch (error) {
        console.error('Error fetching settings:', error);
    }
    finally {
        dispatch(toggleLoader(false));
    }
}
