import React from "react";
import { Provider } from "react-redux";

import reducer from './reducers';
import AppContainer from "./components/AppContainer";
import { configureStore } from '../../../modules/store';
import { convertListToMutilpleSelected, convertListToHierarchicalFilterDropdown } from '../../../modules/utils';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        const { productList, languageList, currencyList, baseCurrencyList, paymentCurrencyList, isProduction, today, dealTypeList, dealList, reportCutOffDate } = window.initialState;

        const language = {};
        for (let languageItem of languageList) {
            language[languageItem.LanguageCode] = languageItem.LanguageName;
        }

        const newProductList = convertListToMutilpleSelected(productList, 'ProductId', 'ProductName')
        const newCurrencyList = convertListToMutilpleSelected(currencyList, 'ExchangeId', 'Code')
        const newPaymentCurrencyList = convertListToMutilpleSelected(paymentCurrencyList, 'ExchangeId', 'Code')
        const hierarchicalDealList = convertListToHierarchicalFilterDropdown(dealTypeList, dealList, 'GroupTypeId')

        this.store = configureStore({
            productList: newProductList,
            dealList,
            hierarchicalDealList,
            languageList: language,
            today,
            currencyList: newCurrencyList,
            baseCurrencyList,
            paymentCurrencyList: newPaymentCurrencyList,
            isProduction,
            reportCutOffDate
        }, reducer);

    }

    render() {
        return (
            <Provider store={this.store}>
                <AppContainer />
            </Provider>
        );
    }
}