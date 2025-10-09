import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { Button } from 'reactstrap';

import { htmlDecode } from '@/modules/htmlHelper';
import { formatDecimalWithCurrencySymbol } from '@/modules/numberFormat';
import { getFirstDayOfMonth, getAdjustedDateFromNow, getDayOfMonth, getSixMonthAgoFromNow, openUrlOnNewWindow } from '@/modules/utils';
import { setPagingOption, toggleLoaderUserPanel, fetchData, setTransactionId, redirectToDailyEarning, setExpandMonthDateList, redirectToSubAffiliate } from '../actions';
import { headerText, globalResource, MONTHLY_TOTAL, CALCULATED_MONTH, transTypeSettings, selectedAllProduct, maxWidth, paymentCPAManagementSettings} from '../modules/constants';
import { getScrollTopPosition, setScrollTop } from '../modules/utils';
import { relativePath } from '@/pages/report/libs/constants';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            gridData: null,
            shouldResetScrollPosition: true
        }

        this.transTypeClickHandler = this._getClickHandlerByTransType();
    }

    componentDidUpdate(prevProps) {
        const { pagingOption, param, affId } = this.props;

        if (param !== prevProps.param || affId !== prevProps.affId) {
            const newParam = Object.assign({}, param, { pageIndex: 1, pageSize: pagingOption.PageSize });
            this.fetchData(newParam, affId !== prevProps.affId);
        }
    }

    async fetchData(param, isChangedAffId) {
        this.props.toggleLoaderUserPanel(true);

        const { affId } = this.props;
        const { isGetAll, fromDate, toDate, pageIndex, pageSize } = param;

        const postParam = isGetAll ? { fromDate: null, toDate: null, affId, pageIndex, pageSize } : { fromDate, toDate, affId, pageIndex, pageSize };

        const data = await this.props.fetchData(postParam);

        this.setState({ gridData: data ? data.MainData : null, shouldResetScrollPosition: true });
        this.props.setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: pageIndex, PageSize: pageSize });

        this.props.toggleLoaderUserPanel(false);
        !param.isBack || isChangedAffId ? this.props.setExpandMonthDateList({}) : setScrollTop(param.scrollTop);
    }

    _renderHeader() {
        return (
            <Row key="thead">
                <Cell header={true} colWidth={35} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Date}>{headerText.Date}</Cell>
                <Cell header={true} colWidth={110} title={headerText.Type}>{headerText.Type}</Cell>
                <Cell header={true} colWidth={100} title={headerText.Amount}>{headerText.Amount}</Cell>
                <Cell header={true} colWidth={95} title={headerText.Status}>{headerText.Status}</Cell>
                <Cell header={true} colWidth={110} title={headerText.Creator}>{headerText.Creator}</Cell>
                <Cell header={true} colWidth={450} title={headerText.Description}>{headerText.Description}</Cell>
            </Row>
        );
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList && dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];

                dataRows.push(this._buildDataRow(dataItem, i + startIndex));
            }
        }
        else {
            dataRows.push(<Row key="no-info">
                <Cell className="text-center" colSpan="7">{globalResource.NoInfo}</Cell>
            </Row>);
        }

        return dataRows;
    }

    getRedirectParam = (dataItem) => {
        const { affId, expandMonthDateList, param } = this.props;

        return {
            affId,
            monthDate: dataItem.NormalizeDateText,
            statementHistory: {
                param,
                scrollTop: getScrollTopPosition(),
                expandMonthDateList
            }
        }
    }

    _handleRedirectToDailyEarning = (dataItem) => {
        const dailyEarningParam = {
            ...this.getRedirectParam(dataItem),
            productId: selectedAllProduct
        }

        return this.props.redirectToDailyEarning(dailyEarningParam);
    }

    _handleRedirectToSubAffiliate = (dataItem) => {
        const subAffiliateParam = this.getRedirectParam(dataItem);

        return this.props.redirectToSubAffiliate(subAffiliateParam);
    }

    _buildCpaAdjustmentParams = (itemDate) => {
        const adjustedDate = getDayOfMonth(itemDate);
        const adjustmentSetting = paymentCPAManagementSettings.Adjustment;

        return {
            fromDate: adjustedDate,
            toDate: adjustedDate,
            statusId: adjustmentSetting.Status,
            viewBy: adjustmentSetting.ViewBy
        };
    }

    _buildApprovedCpaParams = (today) => {
        const approvedSetting = paymentCPAManagementSettings.Approved;
        const fromDate = getSixMonthAgoFromNow(today);
        const toDate = getDayOfMonth(new Date(today));

        return {
            fromDate,
            toDate,
            statusId: approvedSetting.Status,
            viewBy: approvedSetting.ViewBy
        };
    }

    _buildTentativeCpaParams = (itemDate, today) => {
        const tentativeSetting = paymentCPAManagementSettings.Tentative;
        const fromDate = getFirstDayOfMonth(itemDate);
        const toDate = getAdjustedDateFromNow(itemDate, new Date(today));

        return {
            fromDate,
            toDate,
            statusId: tentativeSetting.Status,
            viewBy: tentativeSetting.ViewBy
        };
    }

    _isApprovedCpaTypeFromDescription = (description) => {
        return description.includes('Approved');
    }

    _buildPaymentCpaParams = (dataItem, isCpaAdjustment) => {
        const { affName, today } = this.props;
        
        if (!dataItem || !dataItem.MonthDate) {
            alert('Invalid data item: missing required MonthDate property');
        }

        const itemDate = new Date(dataItem.MonthDate);
        const baseParams = { affName };

        if (isCpaAdjustment) {
            return {
                ...baseParams,
                ...this._buildCpaAdjustmentParams(itemDate)
            };
        }

        const isApprovedCpaType = this._isApprovedCpaTypeFromDescription(dataItem.Description);
        
        if (isApprovedCpaType) {
            return {
                ...baseParams,
                ...this._buildApprovedCpaParams(today)
            };
        }

        return {
            ...baseParams,
            ...this._buildTentativeCpaParams(itemDate, today)
        };
    }

    _handleRedirectToPaymentCPAManagement = (dataItem, isCpaAdjustment = false) => {
        const paramForPaymentCPAManagement = this._buildPaymentCpaParams(dataItem, isCpaAdjustment);

        openUrlOnNewWindow(relativePath.paymentCpaManagement, paramForPaymentCPAManagement, 'paramForPaymentCPAManagement');
    }

    _getClickHandlerByTransType() {
        return {
            [transTypeSettings.PaymentRequest]: (dataItem) => () => {
                return this.handleSetTransactionId(dataItem.TransId);
            },
            [transTypeSettings.MonthlyEarning]: (dataItem) => () => this._handleRedirectToDailyEarning(dataItem),
            [transTypeSettings.SubAffiliate]: (dataItem) => () => this._handleRedirectToSubAffiliate(dataItem),
            [transTypeSettings.CpaEarning]: (dataItem) => () => this._handleRedirectToPaymentCPAManagement(dataItem),
            [transTypeSettings.CpaAdjustment]: (dataItem) => () => this._handleRedirectToPaymentCPAManagement(dataItem, true),
        }
    }

    _handleShow = (monthDate) => {
        const { expandMonthDateList } = this.props;
        this.setState({ shouldResetScrollPosition: false });

        this.props.setExpandMonthDateList(Object.assign({}, expandMonthDateList, { [monthDate]: !expandMonthDateList[monthDate] }));
    }

    _buildDataRow(dataItem, index) {
        const { expandMonthDateList } = this.props;
        const isExpand = expandMonthDateList[dataItem.NormalizeDateText];
        const amount = formatDecimalWithCurrencySymbol(dataItem.Amount)
        const transType = dataItem.TransType;
        const clickHandler = this.transTypeClickHandler[transType];
        const status = dataItem.Status;

        const isProcessing = status && status.toLowerCase() === 'processing';

        const creator = htmlDecode(dataItem.Creator);
        const description = htmlDecode(dataItem.DescriptionDisplay);
        const isTotalRow = transType === MONTHLY_TOTAL;
        const transTypeString = isTotalRow && dataItem.CalculatedType == CALCULATED_MONTH ? 'Monthly Total' : dataItem.TransTypeDisplayText;

        return (
            <React.Fragment key={`dataRow-${dataItem.TransId}-${dataItem.DateText}-${dataItem.TransType}`}>
                <Row className={status && status.toLowerCase()}>
                    <Cell title={index} className="text-center">{index}</Cell>
                    <Cell title={dataItem.DateText} className="text-center">{
                        isTotalRow ? (
                            <Button className="p-0 th-wrapper" color="link" onClick={() => this._handleShow(dataItem.NormalizeDateText)}>
                                <div className="icon-container">
                                    <span className={`caret ${isExpand ? 'expand current' : 'collapsed'}`}></span>
                                </div>
                                <span>{dataItem.DateText}</span>
                            </Button>
                        ) : dataItem.DateText
                    }</Cell>
                    <Cell title={transTypeString || MONTHLY_EARNING} className="text-center">{transTypeString || MONTHLY_EARNING}</Cell>
                    <Cell title={amount} className="text-right">
                        {clickHandler ?
                            (<Button className="p-0" color="link" onClick={clickHandler(dataItem)}>
                                {amount}
                            </Button>) :
                            amount}
                    </Cell>
                    <Cell title={status} className="text-center">{isProcessing ?
                        <Button className="p-0" color="link" onClick={() => this.handleSetTransactionId(dataItem.TransId)}>
                            {status}
                        </Button> : status}</Cell>
                    <Cell title={creator} className="text-center">{creator}</Cell>
                    <Cell title={description}>{description}</Cell>
                </Row>
                {
                    isTotalRow && isExpand && dataItem.Children.map(item => {
                        return this._buildDataRow(item);
                    })
                }
            </React.Fragment>
        )
    }

    handleSetTransactionId = (transId) => {
        this.setState({ shouldResetScrollPosition: false });

        this.props.setTransactionId(transId);
    }

    handlePaging = (pageIndex, pageSize) => {
        const newParam = { ...this.props.param, pageIndex, pageSize, isBack: false };

        this.fetchData(newParam);
    };

    render() {
        const { gridData, shouldResetScrollPosition } = this.state;

        return (
            <div className="data-content statement-history">
                <div className="table-responsive table-striped my-2">
                    <Table
                        maxWidth={maxWidth}
                        bodyHeight={300}
                        header={this._renderHeader()}
                        body={this._renderDataSection(gridData)}
                        containerPadding={10}
                        isPaging={true}
                        pageOption={this.props.pagingOption}
                        onPaging={this.handlePaging}
                        shouldResetScrollPosition={shouldResetScrollPosition}
                    />
                </div>
            </div>
        );
    }
}


function mapStateToProps({ today, affCommonInfo, statementHistory }) {
    const { pagingOption, param, expandMonthDateList } = statementHistory;

    const { affId, affName } = affCommonInfo;

    return Object.assign({}, { today, affId, affName, pagingOption, param, expandMonthDateList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setPagingOption,
        toggleLoaderUserPanel,
        fetchData,
        setTransactionId,
        redirectToDailyEarning,
        setExpandMonthDateList,
        redirectToSubAffiliate,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);