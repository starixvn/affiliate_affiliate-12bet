import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '@/modules/store';
import { convertListToMutilpleSelected } from '@/modules/utils';
import ClaimPrincipal from '@/modules/claim';
import { claimResource } from '@/modules/claim';

const App = () => {
    const { targetCountryList } = window.initialState;
    const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
    const isModifyInLinkManagement = claimsPrincipal.hasWriteClaim(claimResource.LinkManagement);

    // Convert lists to proper format for MultipleSelect components
    const newTargetCountryList = convertListToMutilpleSelected(targetCountryList, 'TargetCountryCode', 'TargetCountryName');

    const store = configureStore({
        targetCountryList: newTargetCountryList,
        isModifyInLinkManagement
    }, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;