import * as types from './types';

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
