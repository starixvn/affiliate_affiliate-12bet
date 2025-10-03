import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MultipleSelect from '@/components/multiple-select';
import MonthPicker from '@9softstudio/react-monthpicker';
import { defaultSortBy, sortByMainView, sortByMonthOnMonthView, viewLevel, sortDirectionType, defaultBaseCurrency, minMonthDate, resource, statusFilter, allStatuses, dealFilterData } from '../libs/constants';
import { setReportTitle, setParam, setCurrencyList, setProductList, setPaymentCurrencyList, setIsCheckedDatePicker } from '../actions';
import { formatUnit, handleAfterChangeFromDate, handleAfterChangeToDate, handleChangeMultipleSelected } from '@/modules/utils';
import { globalResource } from '@/modules/globalResource';
import { minDate, sixMonth } from '@/modules/constants';
import { DatePicker } from '@9softstudio/react-datepicker';
import HierarchicalFilterDropdown from '@/components/HierarchicalFilterDropdown';   

export class Filter extends Component {
    constructor(props) {
        super(props);

        const { today, productList, baseCurrencyList, currencyList, dealList } = this.props;
        this.now = new Date(today);
        const currentMonth = this.now.getMonth() + 1;
        const currentMonthString = formatUnit(currentMonth);
        const currentYear = this.now.getFullYear();
        this.nowString = `${currentMonthString}/${formatUnit(this.now.getDate())}/${currentYear}`;

        const defaultMonth = { month: currentMonth, year: currentYear };

        this.state = {
            userName: '',
            selectedLanguage: '',
            fromMonth: defaultMonth,
            toMonth: defaultMonth,
            sortBy: defaultSortBy,
            isSortAscending: true,
            selectedProductList: productList.filter(item => item.checked).map(item => item.key).join(',') || '',
            selectedDealIds: dealList.map(item => item.GroupId),
            isGetAll: false,
            isExcludeNegvBBF: false,
            isExcludeNegvCurrentBBF: false,
            selectedBaseCurrency: baseCurrencyList.length && baseCurrencyList[0].ExchangeId || defaultBaseCurrency,
            selectedCurrencyList: currencyList.filter(item => item.checked).map(item => item.key).join(',') || '',
            selectedPaymentCurrencyList: 'all',
            isCheckedDatePicker: false,
            fromDate: `${currentMonthString}/01/${currentYear}`,
            toDate: this.nowString,
            selectedStatus: statusFilter.Approved
        }

        this.cachedMainReportParam = null;
    }

    componentDidUpdate(prevProps) {
        const { param, currentViewLevel, pagingOption } = this.props;

        if (currentViewLevel !== prevProps.currentViewLevel) {
            const callback = () => {
                this._updateReportTitle();
            }

            if (this._isMainView()) {
                const { UserName, GroupIds, PreferredLanguage, FromDate, ToDate, SortType, SortDirectionType, ProductIds, CurrencyIds, PaymentCurrencyIds, BaseCurrencyId, Statuses } = this.cachedMainReportParam;
                const from = new Date(FromDate);
                const to = new Date(ToDate);

                this.setState({
                    userName: UserName,
                    selectedLanguage: PreferredLanguage,
                    selectedDealIds: GroupIds.split(','),
                    fromMonth: { month: from.getMonth() + 1, year: from.getFullYear() },
                    toMonth: { month: to.getMonth() + 1, year: to.getFullYear() },
                    sortBy: SortType,
                    isSortAscending: SortDirectionType === sortDirectionType.ascending,
                    selectedProductList: ProductIds,
                    selectedBaseCurrency: BaseCurrencyId,
                    selectedCurrencyList: CurrencyIds,
                    selectedPaymentCurrencyList: PaymentCurrencyIds,
                    isGetAll: false,
                    isExcludeNegvBBF: false,
                    isExcludeNegvCurrentBBF: false,
                    isCheckedDatePicker: false,
                    selectedStatus: Statuses
                }, callback);

                this.props.setParam(this.cachedMainReportParam);
            }
            else {
                this.cachedMainReportParam = Object.assign({}, this.cachedMainReportParam, {
                    PageIndex: pagingOption.PageIndex,
                    PageSize: pagingOption.PageSize
                });

                this.setState({
                    userName: param.UserName,
                    sortBy: sortByMonthOnMonthView.Month,
                    isSortAscending: false,
                    isCheckedDatePicker: false
                }, callback);
            }
        }
    }

    isSelectedAllDealIds = (selectedDeals) => {
        return selectedDeals.length === this.props.hierarchicalDealList.flatMap(group => 
            group.items?.map(item => item.GroupId) || []
        ).length;
    }

    _isMainView() {
        return this.props.currentViewLevel === viewLevel.main;
    }

    handlePressEnter = (event) => {
        if (event.charCode === 13) {
            event.preventDefault();

            this.handleClickSearch();
        }
    }

    handleSelectFromMonth = (month, year) => {
        const fromMonth = { month, year };
        if (!this._isMainView()) {
            this.setState({ fromMonth });
            return;
        }

        const toMonthRange = this._getToMonthRange(fromMonth);

        const { min, max } = toMonthRange;
        const { toMonth } = this.state;

        const isInRange = min.month <= toMonth.month && min.year <= toMonth.year &&
            max.month >= toMonth.month && max.year >= toMonth.year;

        const newState = isInRange ? {
            fromMonth: { month, year }
        } :
            {
                fromMonth: { month, year },
                toMonth: { month, year }
            }

        this.setState(newState);
    }

    handleSelectToMonth = (month, year) => {
        this.setState({ toMonth: { month, year } });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(prevState => handleAfterChangeFromDate(momentDate, prevState.toDate, sixMonth));
    }

    handleChangeToDate = (momentDate) => {
        this.setState(prevState => handleAfterChangeToDate(momentDate, prevState.fromDate, sixMonth));
    }

    handleChangeCurrency = (item, selectedCurrencyList) => {
        this.setState({ selectedCurrencyList });

        this.props.setCurrencyList(handleChangeMultipleSelected(this.props.currencyList, selectedCurrencyList));
    }

    handleChangePaymentCurrency = (item, selectedPaymentCurrencyList) => {
        this.setState({ selectedPaymentCurrencyList });

        this.props.setPaymentCurrencyList(handleChangeMultipleSelected(this.props.paymentCurrencyList, selectedPaymentCurrencyList));
    }

    handleChangeDeals = (newSelection) => {
        console.log('handleChangeDeals called', newSelection);
        this.setState({ selectedDealIds: newSelection });
    };

    handleChangeProduct = (item, selectedProductList) => {
        this.setState({ selectedProductList });

        this.props.setProductList(handleChangeMultipleSelected(this.props.productList, selectedProductList));
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    handleCheck = (e) => {
        const { name } = e.target;
        this.setState((prevState) => ({
            [name]: !prevState[name]
        }))
    }

    handleClickSearch = () => {
        const { selectedProductList } = this.state;

        if (selectedProductList === '') {
            return;
        }

        this._updateReportTitle();
        const {
            selectedLanguage,
            selectedDealIds,
            selectedBaseCurrency,
            selectedCurrencyList,
            selectedPaymentCurrencyList,
            fromMonth,
            toMonth,
            sortBy,
            isSortAscending,
            userName,
            isGetAll,
            isExcludeNegvBBF,
            isExcludeNegvCurrentBBF,
            fromDate,
            toDate,
            isCheckedDatePicker,
            selectedStatus
        } = this.state;
        const { pagingOption } = this.props;

        const isSelectAllDealIds = this.isSelectedAllDealIds(selectedDealIds);
        const isSelectAllPaymentCurrency = this.props.paymentCurrencyList.every(c => c.checked);

        const param = {
            UserName: userName,
            IsGetMonthly: !isCheckedDatePicker,
            FromDate: isCheckedDatePicker ? fromDate : `${fromMonth.month}/1/${fromMonth.year}`,
            ToDate: isCheckedDatePicker ? toDate : `${toMonth.month}/1/${toMonth.year}`,
            PreferredLanguage: selectedLanguage,
            BaseCurrencyId: Number(selectedBaseCurrency),
            GroupIds: isSelectAllDealIds ? 'all' : selectedDealIds.join(','),
            CurrencyIds: selectedCurrencyList,
            PaymentCurrencyIds: isSelectAllPaymentCurrency ? 'all' : selectedPaymentCurrencyList,
            ProductIds: selectedProductList,
            SortType: Number(sortBy),
            SortDirectionType: isSortAscending ? sortDirectionType.ascending : sortDirectionType.descending,
            PageIndex: 1,
            PageSize: pagingOption.PageSize,
            IsGetAll: isGetAll,
            IsExcludeNegvBBF: isExcludeNegvBBF,
            IsExcludeNegvCurrentBBF: isExcludeNegvCurrentBBF,
            Statuses: selectedStatus
        }

        if (this._isMainView()) {
            this.props.setIsCheckedDatePicker(isCheckedDatePicker);
            this.cachedMainReportParam = Object.assign({}, param, { GroupIds: selectedDealIds.join(',') });
        }

        this.props.setParam(param);
    }

    _updateReportTitle() {
        const { productList } = this.props;
        const isCheckedAllProduct = productList.every(p => p.checked);

        const reportTitle = this._isMainView() ? this._buildMainReportTitle(isCheckedAllProduct) : this._buildMonthOnMonthReportTile(isCheckedAllProduct);

        this.props.setReportTitle(reportTitle);
    }

    _buildMainReportTitle(isCheckedAllProduct) {
        const { productList, languageList, baseCurrencyList, dealList, paymentCurrencyList } = this.props;
        const { selectedLanguage, fromMonth, toMonth, userName, selectedDealIds, selectedBaseCurrency, fromDate, toDate, isCheckedDatePicker, selectedStatus } = this.state;

        const userNameTitle = `${userName && ' - Affiliate contains \'' + userName + '\''}`;
        const language = languageList[selectedLanguage] || 'All languages';
        const deal = this.isSelectedAllDealIds(selectedDealIds) ? 'All Deals' : dealList.filter(d => selectedDealIds.includes(d.GroupId)).map(d => d.GroupName).join(',');
        const paymentCurrency = paymentCurrencyList.every(c => c.checked) ? 'All Linked Acc. Currencies' : paymentCurrencyList.filter(c => c.checked).map(c => c.name).join(',');

        const productName = isCheckedAllProduct ? 'All Products' : productList.filter(p => p.checked).map(p => p.name).join(',');

        const fromToTitle = isCheckedDatePicker ? `FROM ${fromDate} TO ${toDate}` : `FROM ${formatUnit(fromMonth.month)}/${fromMonth.year} TO ${formatUnit(toMonth.month)}/${toMonth.year}`;
        const baseCurrency = baseCurrencyList.filter(x => x.ExchangeId == selectedBaseCurrency).map(b => b.Code).join(',');
        const status = statusFilter[selectedStatus];

        return `${resource.reportName}${userNameTitle} - Base Currency ${baseCurrency} - ${paymentCurrency} - ${language} - ${productName} - ${deal} - ${status} - ${fromToTitle}`;
    }

    _buildMonthOnMonthReportTile(isCheckedAllProduct) {
        const { productList } = this.props;
        const { fromMonth, toMonth, userName, isGetAll, selectedBaseCurrency } = this.state;

        const userNameTitle = userName && resource.space + userName;
        const productName = isCheckedAllProduct ? 'All Products' : productList.filter(p => p.checked).map(p => p.name).join(',');

        const fromToTitle = isGetAll ? 'Get All Dates' :
            `FROM ${formatUnit(fromMonth.month)}/${fromMonth.year} TO ${formatUnit(toMonth.month)}/${toMonth.year}`;
        const baseCurrency = this.props.baseCurrencyList.filter(x => x.ExchangeId == selectedBaseCurrency).map(b => b.Code).join(',');

        return `${resource.reportDetailName}${userNameTitle} - Base Currency ${baseCurrency} - ${productName} - ${fromToTitle}`;
    }

    _getToMonthRange(from) {
        if (!this._isMainView()) {
            return {
                min: Object.assign({}, from),
                max: { month: this.now.getMonth() + 1, year: this.now.getFullYear() }
            };
        }

        let min = Object.assign({}, from);
        let maxToMonth = from.month + 5;
        let maxToYear = maxToMonth > 12 ? from.year + 1 : from.year;

        let actualMaxMonth = maxToMonth % 12;

        const nowMonth = this.now.getMonth() + 1;
        const nowYear = this.now.getFullYear();

        if (maxToYear > nowYear) {
            actualMaxMonth = nowMonth;
            maxToYear = nowYear;
        }

        if (maxToMonth > nowMonth && maxToYear === nowYear) {
            actualMaxMonth = min.year < nowYear ? actualMaxMonth : nowMonth;
            maxToYear = nowYear;
        }

        return {
            min,
            max: { month: actualMaxMonth || 12, year: maxToYear }
        };
    }

    render() {
        const {
            selectedLanguage,
            selectedDealIds,
            selectedBaseCurrency,
            fromMonth, toMonth,
            sortBy, isSortAscending,
            selectedProductList,
            userName, isGetAll,
            isExcludeNegvBBF,
            isExcludeNegvCurrentBBF,
            fromDate,
            toDate,
            isCheckedDatePicker,
            selectedStatus
        } = this.state;

        const {
            productList,
            languageList,
            currencyList,
            baseCurrencyList,
            paymentCurrencyList,
            isProduction,
            hierarchicalDealList
        } = this.props;

        const isValidSelectedProduct = !!selectedProductList;
        const isValidSelectedDeal = !!selectedDealIds.length;

        const toMonthRange = this._getToMonthRange(fromMonth);
        const isMainView = this._isMainView();
        const sortByData = isMainView ? sortByMainView : sortByMonthOnMonthView;

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label htmlFor="Affiliate" className="mr-sm-2">Affiliate</Label>
                        <Input type="text" name="userName" id="Affiliate" maxLength="30"
                            onKeyPress={this.handlePressEnter}
                            onChange={this.handleChange}
                            value={userName} />
                    </FormGroup>
                    <FormGroup className="my-sm-1 mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.BaseCurrency}</Label>
                        <Input type="select" name="selectedBaseCurrency" id="BaseCurrency" value={selectedBaseCurrency} onChange={this.handleChange}>
                            {
                                baseCurrencyList.map(c => {
                                    return (<option key={c.ExchangeId} value={c.ExchangeId}>{c.Code}</option>)
                                })
                            }
                            {
                                !isProduction && <option value="20">UUS</option>
                            }
                        </Input>
                    </FormGroup>
                    {
                        isMainView && <FormGroup className="my-sm-1 mr-sm-2 multiple-currency-filter">
                            <Label className="mr-sm-2">Linked Acc. Currency</Label>
                            <MultipleSelect
                                dataSource={paymentCurrencyList}
                                keyField="key"
                                valueField="name"
                                statusField="checked"
                                maxDisplayItemCount={1}
                                selectedAllLabel="All"
                                onChange={this.handleChangePaymentCurrency} />
                        </FormGroup>
                    }
                    {
                        !isProduction &&
                        <FormGroup className="my-sm-1 mr-sm-2 multiple-currency-filter">
                            <Label className="mr-sm-2">{globalResource.Currency}</Label>
                            <MultipleSelect
                                dataSource={currencyList}
                                keyField="key"
                                valueField="name"
                                statusField="checked"
                                maxDisplayItemCount={1}
                                selectedAllLabel="All"
                                onChange={this.handleChangeCurrency} />
                        </FormGroup>
                    }
                    {
                        isMainView &&
                        <FormGroup className="my-sm-1 mr-sm-2">
                            <Input type="select" name="selectedLanguage" value={selectedLanguage} onChange={this.handleChange}>
                                <option key="lang-all" value="">All Language</option>
                                {
                                    Object.keys(languageList).map(lang => {
                                        return (<option key={'lang-' + lang} value={lang}>{languageList[lang]}</option>)
                                    })
                                }
                            </Input>
                        </FormGroup>
                    }
                    <FormGroup className={"my-sm-1 mr-sm-2" + `${isValidSelectedProduct ? '' : ' multiple-select-wrapper is-invalid'}`}
                        style={{ width: 200 }}>
                        <MultipleSelect
                            dataSource={productList}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please Select"
                            selectedAllLabel="All Products"
                            onChange={this.handleChangeProduct} />
                        <div className="mx-1 rounded-circle note-info" title="Filtering product affects only to Turnover and GGR columns. Others always show value for all products">
                            <span className="oi oi-info"></span>
                        </div>
                    </FormGroup>
                    {
                        isMainView &&
                        <FormGroup className="my-sm-1 mr-sm-2">
                            <HierarchicalFilterDropdown
                                value={selectedDealIds}
                                onSelectionChange={this.handleChangeDeals}
                                data={{ groups: hierarchicalDealList }}
                                placeholder="Please Select"
                                searchPlaceholder="Search Data"
                                showSelectAll={true}
                                showGroupCounts={true}
                                allLabel="All Deals"
                                maxHeight={350}
                                className="deal-filter"
                                allowGroupCollapse={true}
                                defaultExpanded={true}
                                defaultSelectAll={true}
                                groupKeyField="GroupTypeId"
                                groupLabelField="GroupTypeName"
                                itemKeyField="GroupId"
                                itemLabelField="GroupName" />
                        </FormGroup>
                    }
                    {
                        isMainView ? (
                            <FormGroup check>
                                <Label check>
                                    Date Picker
                                    <Input name="isCheckedDatePicker" className="ml-1 mr-2" type="checkbox" checked={isCheckedDatePicker} onChange={this.handleCheck} />
                                </Label>
                            </FormGroup>
                        ) : null
                    }
                    {
                        isCheckedDatePicker ? (
                            <Fragment>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label className="mr-sm-2">{globalResource.From}</Label>
                                    <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate}
                                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                                        onChange={this.handleChangeFromDate} />
                                </FormGroup>
                                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                    <Label className="mr-sm-2">{globalResource.To}</Label>
                                    <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate}
                                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                                        onChange={this.handleChangeToDate} />
                                </FormGroup>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <FormGroup className="my-sm-1 mr-sm-2">
                                    <Label className="mr-sm-2">From</Label>
                                    <MonthPicker minMonth={minMonthDate.month} minYear={minMonthDate.year}
                                        selectedDropdownYear={fromMonth.year}
                                        selectedMonth={fromMonth.month}
                                        onSelect={this.handleSelectFromMonth}
                                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                                        enable={!isGetAll} />
                                </FormGroup>
                                <FormGroup className="my-sm-1 mr-sm-2">
                                    <Label className="mr-sm-2">To</Label>
                                    <MonthPicker minMonth={toMonthRange.min.month} minYear={toMonthRange.min.year}
                                        maxMonth={toMonthRange.max.month} maxYear={toMonthRange.max.year}
                                        selectedDropdownYear={toMonth.year}
                                        selectedYear={toMonth.year}
                                        selectedMonth={toMonth.month}
                                        onSelect={this.handleSelectToMonth}
                                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                                        enable={!isGetAll} />
                                </FormGroup>
                            </Fragment>
                        )
                    }
                    {
                        isMainView && (
                            <FormGroup className="my-sm-1 mr-sm-2">
                                <Label htmlFor="selectedStatus" className="mr-sm-2">Status</Label>
                                <Input type="select" name="selectedStatus" value={selectedStatus} onChange={this.handleChange}>
                                    {Object.entries(statusFilter).map(([key, value]) => (
                                        <option key={`status-${key === allStatuses ? 'all' : key}`} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        )
                    }
                    {
                        !isMainView && (
                            <FormGroup check>
                                <Label check>
                                    Get All
                                    <Input name="isGetAll" className="ml-1 mr-2" type="checkbox" checked={isGetAll} onChange={this.handleCheck} />
                                </Label>
                            </FormGroup>
                        )
                    }
                    <FormGroup>
                        <FormGroup className="my-sm-1 mr-sm-2">
                            <Label htmlFor="SortBy" className="mr-sm-2">Sort By</Label>
                            <Input type="select" name="sortBy" id="SortBy" value={sortBy} onChange={this.handleChange}>
                                {
                                    Object.keys(sortByData).map(k => {
                                        return (<option key={'sortBy-' + k} value={sortByData[k]}>{k}</option>);
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup className="my-sm-1 mr-sm-2">
                            <Label check>
                                A-Z
                                <Input name="isSortAscending" className="ml-1" type="checkbox" checked={isSortAscending} onChange={this.handleCheck} />
                            </Label>
                        </FormGroup>
                    </FormGroup>
                    {
                        isMainView && (
                            <FormGroup className="my-sm-1 mr-sm-2">
                                <Label check>
                                    Exclude affiliate with negative Balance B/F
                                    <Input name="isExcludeNegvBBF" className="ml-1" type="checkbox" checked={isExcludeNegvBBF} onChange={this.handleCheck} />
                                </Label>
                            </FormGroup>
                        )
                    }
                    {
                        isMainView && (
                            <FormGroup className="my-sm-1 mr-sm-2">
                                <Label check>
                                    Exclude affiliate with negative Current Balance B/F
                                    <Input name="isExcludeNegvCurrentBBF" className="ml-1" type="checkbox" checked={isExcludeNegvCurrentBBF} onChange={this.handleCheck} />
                                </Label>
                            </FormGroup>
                        )
                    }
                    <Button outline color="primary" type="button" onClick={this.handleClickSearch} disabled={!isValidSelectedProduct || !isValidSelectedDeal}>
                        <span className="oi oi-magnifying-glass"></span> Search
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return Object.assign({}, {
        productList: state.productList,
        pagingOption: state.pagingOption,
        languageList: state.languageList,
        currencyList: state.currencyList,
        baseCurrencyList: state.baseCurrencyList,
        paymentCurrencyList: state.paymentCurrencyList,
        isProduction: state.isProduction,
        today: state.today,
        currentViewLevel: state.currentViewLevel,
        param: state.param,
        dealList: state.dealList,
        hierarchicalDealList: state.hierarchicalDealList
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setReportTitle, setParam, setCurrencyList, setProductList, setPaymentCurrencyList, setIsCheckedDatePicker }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);