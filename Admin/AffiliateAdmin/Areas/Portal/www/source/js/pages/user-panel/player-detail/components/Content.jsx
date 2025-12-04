import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';

import { formatDecimal } from '../../../../modules/numberFormat';
import { headerText, globalResource, selectedAllProduct, maxWidth, SortByIdList } from '../modules/constants';
import { setPagingOption, toggleLoaderUserPanel, fetchData, setSortingColumn } from '../actions';
import SortingCell from './SortingCell';

export class Content extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            total: null,
            isCPADealOnly: false
        }
    }

    componentDidUpdate(prevProps) {
        const { param, pagingOption } = this.props;
        const isDifferent = param !== prevProps.param;

        if (isDifferent) {
            const postParam = { ...param, pageIndex: 1, pageSize: pagingOption.PageSize };
            this._fetchData(postParam);
        }

        if (param.isClickLink || isDifferent) {
            this.setState({ isSortAsc: false, sortingColumn: 'Turnover' });
        }
    }

    async _fetchData(param) {
        this.props.toggleLoaderUserPanel(true);

        const { affId } = this.props;
        const postData = { ...param, affId };
        const data = await this.props.fetchData(postData);

        if (data) {
            this.setState({ data: data.Data.MainData, total: data.Data.Total, isCPADealOnly: data.IsCPADealOnly });
            this.props.setPagingOption({ TotalItem: data.Data.TotalItem, PageIndex: param.pageIndex, PageSize: param.pageSize });
        } else {
            this.setState({ data: null, isCPADealOnly: false });
            this.props.setPagingOption({ TotalItem: 0, PageIndex: param.pageIndex, PageSize: param.pageSize });
        }

        this.props.toggleLoaderUserPanel(false);
    }

    handleClickHeader = (selectedColumn) => {
        const { param, pagingOption, sortingColumn } = this.props;
        const postParam = { ...param, pageIndex: pagingOption.PageIndex, pageSize: pagingOption.PageSize, sortById: SortByIdList[sortingColumn.ColumnName] };

        if (sortingColumn.ColumnName === selectedColumn) {
            const newSortingColumn = Object.assign({}, sortingColumn, { IsSortAsc: !sortingColumn.IsSortAsc });
            this.props.setSortingColumn(newSortingColumn);
            this._fetchData({ ...postParam, isSortAsc: !sortingColumn.IsSortAsc });

        } else {
            this.props.setSortingColumn({ IsSortAsc: false, ColumnName: selectedColumn });
            this._fetchData({ ...postParam, isSortAsc: false, sortById: SortByIdList[selectedColumn] });
        }
    }
    _renderHeader() {
        const { isCPADealOnly } = this.state;
        const { sortingColumn } = this.props;
        const isDepositFeePercent = !isCPADealOnly && this.props.isDepositFeePercent;
        const isWithdrawalFeePercent = !isCPADealOnly && this.props.isWithdrawalFeePercent;

        return (
            <tr>
                <th width={35}>#</th>
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Username'} title={headerText.UserName} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'IbcUsername'} title={headerText.IbcUserName} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={80} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'RegisteredDate'} title={headerText.RegisteredDateText} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Channel'} title={headerText.ChannelName} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={80} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'FirstDepositDate'} title={headerText.FirstDepositDateText} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={90} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'FirstDepositAmount'} title={headerText.FirstDepositAmount} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Turnover'} title={headerText.Turnover} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Ggr'} title={headerText.Ggr} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={70} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'DepositCount'} title={headerText.DepositCount} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Deposit'} title={headerText.Deposit} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Withdrawal'} title={headerText.Withdrawal} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={90} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Bonus'} title={headerText.Bonus} handleClickHeader={this.handleClickHeader} />
                <SortingCell width={90} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'Rebate'} title={headerText.Rebate} handleClickHeader={this.handleClickHeader} />
                {isDepositFeePercent && <SortingCell width={90} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'DepositFee'} title={headerText.DepositFee} handleClickHeader={this.handleClickHeader} />}
                {isWithdrawalFeePercent && <SortingCell width={100} isSortAsc={sortingColumn.IsSortAsc} sortingColumn={sortingColumn.ColumnName} columnName={'WithdrawalFee'} title={headerText.WithdrawalFee} handleClickHeader={this.handleClickHeader} />}
            </tr>
        )
    }

    _renderDataSection(dataList, isTotalRow = false) {
        const { param, isDepositFeePercent, isWithdrawalFeePercent } = this.props;
        const { isCPADealOnly } = this.state;
        const productColumnClassName = param.productId === selectedAllProduct ? 'text-right' : 'text-right highlight';
        const dataRows = [];

        if (dataList.length) {
            const { pagingOption } = this.props;
            const startIndex = (pagingOption.PageIndex - 1) * pagingOption.PageSize + 1;

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];

                dataRows.push(this._buildDataRow(dataItem, startIndex + i, productColumnClassName, !isCPADealOnly && isDepositFeePercent, !isCPADealOnly && isWithdrawalFeePercent, isTotalRow));
            }
        }
        else {
            const colSpan = 14 + (!isCPADealOnly && isDepositFeePercent ? 1 : 0) + (!isCPADealOnly && isWithdrawalFeePercent ? 1 : 0)
            dataRows.push(<tr key="no-info">
                <td className="text-center" colSpan={colSpan}>{globalResource.NoInfo}</td>
            </tr>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, rowNumber, productColumnClassName, isDepositFeePercent, isWithdrawalFeePercent, isTotalRow) {
        const turnover = formatDecimal(dataItem.Turnover);
        const ggr = formatDecimal(dataItem.Ggr);
        const bonus = formatDecimal(dataItem.Bonus);
        const rebate = formatDecimal(dataItem.Rebate);
        const deposit = formatDecimal(dataItem.Deposit);
        const withdrawal = formatDecimal(dataItem.Withdrawal);
        const depositFee = formatDecimal(dataItem.DepositFee);
        const withdrawalFee = formatDecimal(dataItem.WithdrawalFee);
        const userName = dataItem.UserName;
        const firstDepositAmount = dataItem.FirstDepositAmount == null ? '' : formatDecimal(dataItem.FirstDepositAmount);

        return (
            <tr key={`raw-data-${rowNumber}`}>
                {
                    isTotalRow ? (
                        <Fragment>
                            <td className="text-right" colSpan={5} title={headerText.TotalAllPage}>{headerText.TotalAllPage}</td>
                            <td></td>
                        </Fragment>
                        ): (
                        <Fragment>
                            <td className="text-center" title={rowNumber}>{rowNumber}</td>
                            <td title={userName}>{userName}</td>
                            <td title={dataItem.IbcUserName}>{dataItem.IbcUserName}</td>
                            <td className="text-center" title={dataItem.RegisteredDateText}>{dataItem.RegisteredDateText}</td>
                            <td className="text-center" title={dataItem.ChannelName}>{dataItem.ChannelName}</td>
                            <td className="text-center" title={dataItem.FirstDepositDateText}>{dataItem.FirstDepositDateText}</td>
                        </Fragment>
                    )
                }
                <td className="text-right" title={firstDepositAmount}>{firstDepositAmount}</td>
                <td className={productColumnClassName} title={turnover}>{turnover}</td>
                <td className={productColumnClassName} title={ggr}>{ggr}</td>
                <td className="text-right" title={dataItem.DepositCount}>{dataItem.DepositCount}</td>
                <td className="text-right" title={deposit}>{deposit}</td>
                <td className="text-right" title={withdrawal}>{withdrawal}</td>
                <td className="text-right" title={bonus}>{bonus}</td>
                <td className="text-right" title={rebate}>{rebate}</td>
                {isDepositFeePercent && <td className="text-right" title={depositFee}>{depositFee}</td>}
                {isWithdrawalFeePercent && <td className="text-right" title={withdrawalFee}>{withdrawalFee}</td>}
            </tr>
        )
    }

    handlePaging = (pageIndex, pageSize) => {
        const { param, sortingColumn } = this.props;

        const newParam = Object.assign({}, param, { pageIndex, pageSize, sortById: SortByIdList[sortingColumn.ColumnName], isSortAsc: sortingColumn.IsSortAsc });
        this._fetchData(newParam);
    }

    render() {
        const { pagingOption } = this.props;
        const { data, total } = this.state;

        return data && (
            <Fragment>
                <div className="table-responsive table-striped my-2 player-detail">
                    <Table>
                        <thead>
                            {
                                this._renderHeader()
                            }
                        </thead>
                        <tbody>
                            {
                                this._renderDataSection(data)
                            }
                        </tbody>
                        <tfoot>
                            {!!data.length && total && this._renderDataSection([total], true)}
                        </tfoot>
                    </Table>
                </div>
                <Pager
                    pageOption={pagingOption}
                    onPaging={this.handlePaging} />
            </Fragment>
        );
    }
}

function mapStateToProps({ affCommonInfo, playerDetail }) {
    const { param, pagingOption, sortingColumn } = playerDetail;
    const { affId, isDepositFeePercent, isWithdrawalFeePercent } = affCommonInfo;

    return Object.assign({}, { param, pagingOption, affId, sortingColumn, isDepositFeePercent, isWithdrawalFeePercent });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, toggleLoaderUserPanel, fetchData, setSortingColumn }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);