import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { useLocation } from "react-router-dom";

import reducer from './reducers';
import { configureStore } from '../../../modules/store';
import AppContainer from "./components/AppContainer";
import { convertListToMutilpleSelected, handleChangeMultipleSelected } from '../../../modules/utils';
import { defaultParams, viewByOptions } from './libs/constants';
import { shouldTriggerSubmit } from './actions';

const App = () => {
    const { today, deals } = window.initialState;
    let newDeals = convertListToMutilpleSelected(deals, 'GroupId', 'GroupName');

    let params = {};
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.size > 0) {
        const username = searchParams.get('userName') || '';
        const dealName = searchParams.get('dealName') || '';
        const viewBy = searchParams.get('viewBy') || '';
        const fromDateQuery = searchParams.get('fromDate');
        const toDateQuery = searchParams.get('toDate');

        const now = new Date(today);
        const fromDateParsed = new Date(fromDateQuery);
        const toDateParsed = new Date(toDateQuery);

        const hasValidDates = !isNaN(fromDateParsed) && !isNaN(toDateParsed) && fromDateParsed <= toDateParsed;

        const fromDate = hasValidDates && fromDateParsed <= now
            ? fromDateQuery
            : defaultParams.fromDate;

        const toDate = hasValidDates && toDateParsed <= now
            ? toDateQuery
            : defaultParams.toDate;

        newDeals = dealName ? handleChangeMultipleSelected(newDeals, dealName) : newDeals;

        params = {
            ...defaultParams,
            username,
            dealName,
            viewBy: viewByOptions.find((option) => option.value === parseInt(viewBy))?.value || defaultParams.viewBy,
            fromDate,
            toDate,
        };
    }

    const store = configureStore({
        ...window.initialState,
        deals: newDeals,
        params
    }, reducer);

    useEffect(() => {
        if (searchParams.size > 0) {
            store.dispatch(shouldTriggerSubmit());
        }
    }, []);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}

export default App;