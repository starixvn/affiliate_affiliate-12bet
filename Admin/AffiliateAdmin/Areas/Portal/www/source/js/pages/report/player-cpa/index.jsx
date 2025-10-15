import React from "react";
import { Provider } from "react-redux";
import { configureStore } from '../../../modules/store';
import reducer from './reducers';
import AppContainer from './components/AppContainer'
import { convertListToMutilpleSelected } from '../../../modules/utils';

export default function App() {
    const { deals } = window.initialState;
    let newDeals = convertListToMutilpleSelected(deals, 'GroupId', 'GroupName');

    const store = configureStore({
        ...window.initialState,
        deals: newDeals
    }, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
}