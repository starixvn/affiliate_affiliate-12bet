import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { globalResource, selectedAllProduct, SortByIdList, SortingColumnDefault, defaultBaseCurrency } from '../modules/constants';
import { setParam, fetchData, setSortingColumn, getChannels } from '../actions';
import ReportExcel from '../modules/reportExcel';
import { htmlDecode } from '../../../../modules/htmlHelper';
import Select from '../../../../components/select';
import MultipleSelect from '../../../../components/multiple-select';
import { handleChangeMultipleSelected, handleAfterChangeFromDate, handleAfterChangeToDate, convertListToMutilpleSelected } from '../../../../modules/utils';
import { minDate, sixMonth } from '../../../../modules/constants';

export class Filter extends PureComponent {
    constructor(props) {
        super(props);

        const { today, baseCurrencyList, currencyList } = this.props;
        const now = new Date(today);
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        this.nowString = `${currentMonth}/${now.getDate()}/${currentYear}`;

        this.state = {
            selectedProduct: selectedAllProduct,
            fromDate: `${currentMonth}/01/${currentYear}`,
            toDate: this.nowString,
            isIncludeRemovedPlayer: false,
            selectedBaseCurrency: baseCurrencyList && baseCurrencyList.length && baseCurrencyList[0].ExchangeId || defaultBaseCurrency,
            selectedCurrencyList: currencyList && currencyList.filter(item => item.checked).map(item => item.key).join(',') || '',
            selectedChannelList: '',
            channelList: null,
            currencyList
        }
    }

    componentDidMount() {
        if (!this.state.channelList) {
            this.handleGetChannelList();
        }
    }

    handleGetChannelList = async () => {
        const channelList = await this.props.getChannels();
        const convertedChannelList = convertListToMutilpleSelected(channelList, "ChannelCode", "ChannelName", true);

        this.setState({ channelList: convertedChannelList, selectedChannelList: convertedChannelList.map(item => item.key).join(',') });
    }

    handleChangeFromDate = (momentDate) => {
        this.setState(prevState => handleAfterChangeFromDate(momentDate, prevState.toDate, sixMonth));
    }

    handleChangeToDate = (momentDate) => {
        this.setState(prevState => handleAfterChangeToDate(momentDate, prevState.fromDate, sixMonth));
    }

    handleChangeProduct = (selectedProduct) => {
        this.setState({
            selectedProduct
        })
    }

    handleCheckIncludeRemovedPlayers = (isIncludeRemovedPlayer) => {
        this.setState({
            isIncludeRemovedPlayer
        })
    }

    handleChangeBaseCurrency = (event) => {
        const selectedBaseCurrency = Number(event.target.value);
        this.setState({
            selectedBaseCurrency
        })
    }

    handleChangeCurrency = (item, selectedCurrencyList) => {
        const currencyList = handleChangeMultipleSelected(this.state.currencyList, selectedCurrencyList);

        this.setState({ selectedCurrencyList, currencyList });
    }

    handleChangeChannel = (item, selectedChannelList) => {
        const channelList = handleChangeMultipleSelected(this.state.channelList, selectedChannelList);

        this.setState({ selectedChannelList, channelList });
    }

    handleSearch = () => {
        const { selectedProduct, selectedBaseCurrency, selectedCurrencyList, selectedChannelList, isIncludeRemovedPlayer, fromDate, toDate } = this.state;

        const param = {
            productId: selectedProduct,
            baseCurrencyId: selectedBaseCurrency,
            currencyIds: selectedCurrencyList,
            channelCodes: selectedChannelList,
            isIncludeRemovedPlayer,
            fromDate,
            toDate,
        }
        this.props.setParam(param);
        this.props.setSortingColumn(SortingColumnDefault);
    }

    handleExportExcel = async () => {
        const { selectedProduct, fromDate, toDate, selectedBaseCurrency, selectedCurrencyList, selectedChannelList, isIncludeRemovedPlayer } = this.state;
        const { affId, sortingColumn, isDepositFeePercent, isWithdrawalFeePercent } = this.props;

        const param = {
            IsExportExcel: true,
            productId: selectedProduct,
            baseCurrencyId: selectedBaseCurrency,
            currencyIds: selectedCurrencyList,
            currencyIds: selectedCurrencyList,
            isIncludeRemovedPlayer,
            fromDate,
            toDate,
            affId,
            sortById: SortByIdList[sortingColumn.ColumnName],
            isSortAsc: sortingColumn.IsSortAsc
        }

        const data = await this.props.fetchData(param);

        if (data) {
            const title = this._getReportTitle();
            const reportExcel = new ReportExcel(data.Data, title, !data.IsCPADealOnly && isDepositFeePercent, !data.IsCPADealOnly && isWithdrawalFeePercent);
            reportExcel.export();
        }
    }

    _getReportTitle() {
        const { baseCurrencyList } = this.props;
        const { selectedProduct, fromDate, toDate, selectedBaseCurrency } = this.state;
        const productTitle = selectedProduct === 0 ? 'All Products' : this._getSelectedProductName(selectedProduct);
        const fromToTitle = `FROM ${fromDate} TO ${toDate}`;
        const currency = baseCurrencyList ? baseCurrencyList.filter(x => x.ExchangeId == selectedBaseCurrency) : [];

        return `Player Detail - ${currency[0] && `Base Currency ${currency[0].Code} - ` || ''}${productTitle} - ${fromToTitle}`;
    }

    _getSelectedProductName(productId) {
        const selectedProduct = this.props.productList.find(p => p.ProductId === productId);

        return selectedProduct ? selectedProduct.ProductName : '';
    }

    render() {
        const { selectedProduct, selectedBaseCurrency, fromDate, toDate, currencyList, channelList, isIncludeRemovedPlayer } = this.state;
        const { productList, baseCurrencyList, isProduction } = this.props;
        const dataSource = [{ ProductId: selectedAllProduct, ProductName: globalResource.All }].concat(productList);

        return (
            <div className="filter-container">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-2">{globalResource.Product}</Label>
                        <Select
                            dataSource={dataSource}
                            keyField="ProductId"
                            valueField="ProductName"
                            hasInputOption={true}
                            selectedKey={selectedProduct}
                            onChange={this.handleChangeProduct} />
                    </FormGroup>
                    {
                        baseCurrencyList && baseCurrencyList.length !== 0 &&
                        <FormGroup className="mr-sm-2">
                            <Label className="mr-2">{globalResource.BaseCurrency}</Label>
                            <Input type="select" name="BaseCurrency" id="BaseCurrency" value={selectedBaseCurrency} onChange={this.handleChangeBaseCurrency}>
                                {
                                    baseCurrencyList.map(c => {
                                        return (<option key={c.ExchangeId} value={c.ExchangeId}>{htmlDecode(c.Code)}</option>)
                                    })
                                }
                                {
                                    !isProduction && <option value="20">UUS</option>
                                }
                            </Input>
                        </FormGroup>
                    }
                    {
                        !isProduction && currencyList && currencyList.length !== 0 &&
                        <FormGroup className="mr-sm-2 multiple-currency-filter">
                            <Label htmlFor="Currency" className="mr-2">{globalResource.Currency}</Label>
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

                    <FormGroup className="mr-sm-2 multiple-currency-filter">
                        <Label htmlFor="Channel" className="mr-2">Channel</Label>
                        <MultipleSelect
                            dataSource={channelList || []}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            selectedAllLabel="All"
                            onChange={this.handleChangeChannel} />
                    </FormGroup>

                    <FormGroup className="mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.From}</Label>
                        <DatePicker minDate={minDate} maxDate={this.nowString} date={fromDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeFromDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                        <Label className="mr-sm-2">{globalResource.To}</Label>
                        <DatePicker minDate={fromDate} maxDate={this.nowString} date={toDate}
                            iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                            onChange={this.handleChangeToDate} />
                    </FormGroup>
                    <FormGroup className="mr-sm-3">
                        <Label checked>
                            Include removed Players
                            <Input className="ml-2 mt-1" type="checkbox" id="isIncludeRemovedPlayer" name="isIncludeRemovedPlayer" checked={isIncludeRemovedPlayer} onChange={(e) => this.handleCheckIncludeRemovedPlayers(!isIncludeRemovedPlayer)} />
                        </Label>
                    </FormGroup>
                    <Button outline color="primary" type="button" onClick={this.handleSearch}>
                        <span className="oi oi-magnifying-glass"></span> {globalResource.Search}
                    </Button>

                    <Button color="link" type="button" className="ml-auto btn-excel" onClick={this.handleExportExcel} title="Export Excel">
                        <span className="oi icon-excel"></span>
                    </Button>
                </Form>
            </div>
        );
    }
}

function mapStateToProps({ today, affCommonInfo, playerDetail, productList, currencyList, baseCurrencyList, isProduction }) {
    const { param, sortingColumn, isCPADealOnly } = playerDetail;
    const { affId, isDepositFeePercent, isWithdrawalFeePercent } = affCommonInfo;

    return Object.assign({}, {
        param,
        affId,
        today,
        sortingColumn,
        productList, currencyList, baseCurrencyList, isProduction,
        isDepositFeePercent: !isCPADealOnly && isDepositFeePercent, isWithdrawalFeePercent: !isCPADealOnly && isWithdrawalFeePercent
    });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParam, fetchData, setSortingColumn, getChannels }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);