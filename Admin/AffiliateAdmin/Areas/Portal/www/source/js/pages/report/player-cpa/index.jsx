import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { configureStore } from '../../../modules/store';
import reducer from './reducers';
import AppContainer from './components/AppContainer'
import { convertListToMutilpleSelected, handleChangeMultipleSelected } from '../../../modules/utils';
import { triggerSearch } from './actions';
import { defaultParams } from './libs/constants';

export default function App() {
    const { deals } = window.initialState;
    let newDeals = convertListToMutilpleSelected(deals, 'GroupId', 'GroupName');

    const urlParams = new URLSearchParams(window.location.search);
    let initialParams = { ...defaultParams };

    if (urlParams.toString()) {
        for (const [key, value] of urlParams.entries()) {
            initialParams[key] = value;
        }

        if (initialParams.statusId) {
            initialParams.statusId = parseInt(initialParams.statusId, 10);
        }
        if (initialParams.isAscending) {
            initialParams.isAscending = initialParams.isAscending === 'true';
        }

        if (initialParams.dealName && newDeals) {
            newDeals = handleChangeMultipleSelected(newDeals, initialParams.dealName);
        }
    }

    const store = configureStore({
        ...window.initialState,
        deals: newDeals,
        params: initialParams
    }, reducer);

    useEffect(() => {
        if (urlParams.toString()) {
            store.dispatch(triggerSearch());
        }
    }, []);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}