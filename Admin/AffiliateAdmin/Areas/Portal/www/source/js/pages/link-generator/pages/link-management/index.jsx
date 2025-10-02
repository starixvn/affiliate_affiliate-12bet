import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './components/AppContainer';

import reducer from './reducers';
import { configureStore } from '@/modules/store';
import { convertListToMutilpleSelected } from '@/modules/utils';
import ClaimPrincipal from '@/modules/claim';
import { claimResource } from '@/modules/claim';

const App = () => {
    const { 
        today,
        targetCountryList, 
        languageList, 
        eventList, 
        groupList, 
        channelList, 
        agencyList, 
        typeList 
    } = window.initialState || {};
    const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
    const isModifyInLinkManagement = claimsPrincipal.hasWriteClaim(claimResource.LinkManagement);

    // Convert lists to proper format for MultipleSelect components
    const newTargetCountryList = convertListToMutilpleSelected(targetCountryList, 'TargetCountryCode', 'TargetCountryName');
    const newLanguageList = convertListToMutilpleSelected(languageList, 'LanguageCode', 'LanguageName');
    const newEventList = convertListToMutilpleSelected(eventList, 'EventId', 'EventName');
    const newGroupList = convertListToMutilpleSelected(groupList, 'GroupId', 'GroupName');
    const newChannelList = convertListToMutilpleSelected(channelList, 'ChannelId', 'ChannelName');
    const newAgencyList = convertListToMutilpleSelected(agencyList, 'AgencyId', 'AgencyName');
    const newTypeList = convertListToMutilpleSelected(typeList, 'TypeId', 'TypeName');

    const store = configureStore({
        today: today || new Date().toISOString(),
        targetCountryList: newTargetCountryList,
        languageList: newLanguageList,
        eventList: newEventList,
        groupList: newGroupList,
        channelList: newChannelList,
        agencyList: newAgencyList,
        typeList: newTypeList,
        isModifyInLinkManagement
    }, reducer);

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;