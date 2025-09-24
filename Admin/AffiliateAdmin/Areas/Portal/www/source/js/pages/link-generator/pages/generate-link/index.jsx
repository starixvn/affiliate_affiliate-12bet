import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '@/modules/store';
import { convertListToMutilpleSelected } from '@/modules/utils';
import ClaimPrincipal from '@/modules/claim';

const App = () => {
    const { 
        targetCountryList, 
        allLanguagesInSystem,
    } = window.initialState;

    const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;

    // Convert lists to proper format for dropdowns

    const store = configureStore({
        targetCountryList,
        languageList: allLanguagesInSystem,
        claimsPrincipal
    }, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;