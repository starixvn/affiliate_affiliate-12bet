import React, { PureComponent, createRef, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Table, Button } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';

import { format, formatDecimal } from '../../../../modules/numberFormat';
import { setPagingOption, setViewLevel, setParam, fetchData } from '../actions';
import { toggleLoader } from '../../../../actions/loaderAction';
import { globalResource } from '../../../../modules/globalResource';
import { getFirstDayOfMonth, getAdjustedDateFromNow, openUrlOnNewWindow } from '../../../../modules/utils';
import { getMaxHeight } from '../../libs/constants';
import { viewLevel, sortByMonthOnMonthView, sortDirectionType, totalText, headerText, reportKey, paymentCPAManagementSetting, DealGroupTypeSettings } from '../libs/constants';
import { AggregateHeaderColumn, HeaderRow } from '../libs/headerConfigs';
import { relativePath } from '../../libs/constants';

export class GridData extends PureComponent {
    constructor(props) {
        super(props);

        this.cachedMainReport = null;
        this.totalItemMainReport = 0;
        this.count = 0;

        this.state = {
            gridData: null,
            total: null
        }

        this.tableRef = createRef();
    }

    componentDidUpdate(prevProps) {
        const { param } = this.props;
        const isMainView = this._isMainView();

        if (param !== prevProps.param && isMainView) {
            if (this.cachedMainReport && this.cachedMainReport.gridData) {
                const { gridData, total, totalItem } = this.cachedMainReport;

                this.setState({ gridData, total }, () => {
                    this.cachedMainReport = null;
                });
                this.props.setPagingOption({ TotalItem: totalItem, PageIndex: param.PageIndex, PageSize: param.PageSize });
            }
            else {
                this.fetchData(param);
            }
        }
        else if (param !== prevProps.param) {
            if (this.cachedMainReport === null) {
                this.cachedMainReport = Object.assign(this.state, { totalItem: prevProps.pagingOption.TotalItem });
            }

            this.fetchData(param);
        }
    }

    _isMainView() {
        return this.props.currentViewLevel === viewLevel.main;
    }

    _isBeforeCutOffDate() {
        const { ToDate } = this.props.param;
        const toDate = new Date(ToDate);
        const reportCutOffDate = new Date(this.props.reportCutOffDate);

        return toDate.getTime() < reportCutOffDate.getTime();
    }

    async fetchData(param) {
        this._resetScroll();
        this.props.toggleLoader(true);
        const isMainView = this._isMainView();
        const data = await this.props.fetchData(param, isMainView);

        if (data) {
            const { MainData, Total, TotalItem } = data;

            this.setState({ gridData: MainData, total: Total });
            this.props.setPagingOption({ TotalItem, PageIndex: param.PageIndex, PageSize: param.PageSize });

            if (isMainView) {
                this.cachedMainReport = null;
            }
        }
        this.props.toggleLoader(false);
    }

    _renderHeader() {
        const { headerRow, isCheckedDatePicker } = this.props;

        if (!(headerRow instanceof HeaderRow)) {
            return [];
        }

        const isMainView = this._isMainView();
        const firstColName = isMainView ? headerText.UserName : headerText.MonthDateString;

        const mainHeader = AggregateHeaderColumn.convertColsToObject(headerRow.getHeaderCols(0));
        const childHeader = AggregateHeaderColumn.convertColsToObject(headerRow.getHeaderCols(1));
        const subChildHeader = isCheckedDatePicker ? null : AggregateHeaderColumn.convertColsToObject(headerRow.getHeaderCols(2));

        return [
            <tr className="freeze-row freeze-row-h1" key="thead-1">
                <th className="freeze-column-header" width={110} rowSpan="3" title={firstColName}>{firstColName}</th>
                {mainHeader[reportKey.Status].isShowable && (<th width={80} rowSpan="3" title={headerText.Status}>{headerText.Status}</th>)}
                {mainHeader[reportKey.PreferredLanguage].isShowable && <th header={true} colWidth={80} rowSpan="3" title={headerText.PreferredLanguage}>{headerText.PreferredLanguage}</th>}
                {mainHeader[reportKey.PaymentCurrency].isShowable && (<th width={70} rowSpan="3" title={headerText.PaymentCurrency}>{headerText.PaymentCurrency}</th>)}
                {mainHeader[reportKey.CommGroupName].isShowable && (<th width={100} rowSpan="3" title={headerText.CommGroupName}>{headerText.CommGroupName}</th>)}
                {mainHeader[reportKey.PaymentFrequency].isShowable && (<th width={100} rowSpan="3" title={headerText.PaymentFrequency}>{headerText.PaymentFrequency}</th>)}
                {mainHeader[reportKey.TotalClick].isShowable && (<th width={60} rowSpan="3" title={headerText.TotalClick}>{headerText.TotalClick}</th>)}
                {mainHeader[reportKey.UniqueClick].isShowable && (<th width={60} rowSpan="3" title={headerText.UniqueClick}>{headerText.UniqueClick}</th>)}
                {mainHeader[reportKey.Signup].isShowable && (<th width={55} rowSpan="3" title={headerText.Signup}>{headerText.Signup}</th>)}
                {mainHeader[reportKey.Fdm].isShowable && (<th width={55} rowSpan="3" title={headerText.Fdm}>{headerText.Fdm}</th>)}
                {mainHeader[reportKey.Fdm_Amount].isShowable && (<th width={65} rowSpan="3" title={headerText.Fdm_Amount}>{headerText.Fdm_Amount}</th>)}
                {mainHeader[reportKey.FDM_TotalDeposit].isShowable && (<th width={65} rowSpan="3" title={headerText.FDM_TotalDeposit}>{headerText.FDM_TotalDeposit}</th>)}
                {mainHeader[reportKey.ActivePlayer].isShowable && (<th width={55} rowSpan="3" title={headerText.ActivePlayer}>{headerText.ActivePlayer}</th>)}
                {mainHeader[reportKey.QualifiedMember].isShowable && (<th width={70} rowSpan="3" title={headerText.QualifiedMember}>{headerText.QualifiedMember}</th>)}
                {mainHeader[reportKey.QualifiedCPAMember].isShowable && (<th width={70} rowSpan="3" title={headerText.QualifiedCPAMember}>{headerText.QualifiedCPAMember}</th>)}
                {mainHeader[reportKey.NoOfSubAff].isShowable && (<th width={65} rowSpan="3" title={headerText.NoOfSubAff}>{headerText.NoOfSubAff}</th>)}
                {mainHeader[reportKey.TotalDeposit].isShowable && (<th width={65} rowSpan="3" title={headerText.TotalDeposit}>{headerText.TotalDeposit}</th>)}
                {mainHeader[reportKey.Deposit].isShowable && (<th width={65} rowSpan="3" title={headerText.Deposit}>{headerText.Deposit}</th>)}
                {mainHeader[reportKey.MemberStatistics].isShowable && (<th colSpan={mainHeader[reportKey.MemberStatistics].totalShowableCol} height={28} title={headerText.MemberStatistics}>{headerText.MemberStatistics}</th>)}
                {mainHeader[reportKey.AffiliateStatistics].isShowable && (<th colSpan={mainHeader[reportKey.AffiliateStatistics].totalShowableCol} title={headerText.AffiliateStatistics}>{headerText.AffiliateStatistics}</th>)}
                {isMainView && !isCheckedDatePicker && (<th width={55} rowSpan="3" title={headerText.MonthOnMonth}>{headerText.MonthOnMonth}</th>)}
                {isMainView && (<th width={55} rowSpan="3" title={headerText.PlayerGgr}>{headerText.PlayerGgr}</th>)}
            </tr>,
            <tr className="freeze-row freeze-row-h2" key="thead-2">
                {childHeader[reportKey.Withdrawal].isShowable && (<th width={75} rowSpan="2" title={headerText.Withdrawal}>{headerText.Withdrawal}</th>)}
                {childHeader[reportKey.Turnover].isShowable && (<th width={75} rowSpan="2" title={headerText.Turnover}>{headerText.Turnover}</th>)}
                {childHeader[reportKey.Ggr].isShowable && (<th width={75} rowSpan="2" title={headerText.Ggr}>{headerText.Ggr}</th>)}
                {childHeader[reportKey.Bonus].isShowable && (<th width={70} rowSpan="2" title={headerText.Bonus}>{headerText.Bonus}</th>)}
                {childHeader[reportKey.Rebate].isShowable && (<th width={70} rowSpan="2" title={headerText.Rebate}>{headerText.Rebate}</th>)}
                {childHeader[reportKey.PlatformFee].isShowable && (<th width={70} rowSpan="2" title={headerText.PlatformFee}>{headerText.PlatformFee}</th>)}
                {childHeader[reportKey.DepositFee].isShowable && (<th width={70} rowSpan="2" title={headerText.DepositFee}>{headerText.DepositFee}</th>)}
                {childHeader[reportKey.WithdrawalFee].isShowable && (<th width={70} rowSpan="2" title={headerText.WithdrawalFee}>{headerText.WithdrawalFee}</th>)}
                {childHeader[reportKey.TotalFee].isShowable && (<th width={70} rowSpan="2" title={headerText.TotalFee}>{headerText.TotalFee}</th>)}

                {childHeader[reportKey.AffiliateEarning].isShowable && (<th width={75} colSpan={childHeader[reportKey.AffiliateEarning].totalShowableCol} title={headerText.Earning}>{headerText.AffiliateEarning}</th>)}
                {childHeader[reportKey.SubAffiliateEarning].isShowable && (<th width={95} colSpan={childHeader[reportKey.SubAffiliateEarning].totalShowableCol} title={headerText.SubAffiliateEarning}>{headerText.SubAffiliateEarning}</th>)}
                {childHeader[reportKey.TotalEarning].isShowable && (<th width={75} rowSpan="2" title={headerText.TotalEarning}>{headerText.TotalEarning}</th>)}
                {childHeader[reportKey.AffWithdrawal].isShowable && (<th width={75} rowSpan="2" title={headerText.AffWithdrawal}>{headerText.AffWithdrawal}</th>)}
                {childHeader[reportKey.AffAdjustment].isShowable && (<th width={75} rowSpan="2" title={headerText.AffAdjustment}>{headerText.AffAdjustment}</th>)}
                {childHeader[reportKey.BalanceBf].isShowable && (<th width={80} rowSpan="2" title={headerText.BalanceBf}>{headerText.BalanceBf}</th>)}
                {childHeader[reportKey.CurrentBBF].isShowable && (<th width={80} rowSpan="2" title={headerText.CurrentBBF}>{headerText.CurrentBBF}</th>)}
            </tr>,
            subChildHeader && <tr className="freeze-row freeze-row-h3" key="thead-3">
                {subChildHeader[reportKey.CommissionRate].isShowable && (<th width={65} title={headerText.CommissionRate}>{headerText.CommissionRate}</th>)}
                {subChildHeader[reportKey.Earning].isShowable && (<th width={75} title={headerText.Earning}>{headerText.Earning}</th>)}
                {subChildHeader[reportKey.ApprovedCPAAmount].isShowable && (<th width={75} title={headerText.ApprovedCPAAmount}>{headerText.ApprovedCPAAmount}</th>)}
                {subChildHeader[reportKey.AdjustedCPAAmount].isShowable && (<th width={75} title={headerText.AdjustedCPAAmount}>{headerText.AdjustedCPAAmount}</th>)}
                {subChildHeader[reportKey.TotalMainEarning].isShowable && (<th width={75} title={headerText.TotalMainEarning}>{headerText.TotalMainEarning}</th>)}
                {subChildHeader[reportKey.SubAffEarning].isShowable && (<th width={95} title={headerText.SubAffEarning}>{headerText.SubAffEarning}</th>)}
            </tr>
        ];
    }

    _renderDataSection(dataList) {
        const dataRows = [];

        if (dataList.length) {
            const { productList } = this.props;
            const isMainView = this._isMainView();
            const isBeforeCutOffDate = this._isBeforeCutOffDate();
            const isSelectedAllProducts = productList.every(p => p.checked);
            const productColumnClassName = isSelectedAllProducts ? 'text-right' : 'text-right highlight';

            for (let i = 0; i < dataList.length; i++) {
                const dataItem = dataList[i];
                dataRows.push(this._buildDataRow(dataItem, productColumnClassName, i, isMainView, isBeforeCutOffDate));
            }
        }
        else {
            const header = AggregateHeaderColumn.convertColsToObject(this.props.headerRow.getHeaderCols(0));
            const singleColumns = Object.keys(header).filter(i => header[i].showable).length;
            const memberStatisticsColumns = header[reportKey.MemberStatistics].totalShowableCol;
            const affStatisticsColumns = header[reportKey.AffiliateStatistics].totalShowableCol;
            const monthOnMonthAndPlayerGgrColumns = this._isMainView() ? !this.props.isCheckedDatePicker + 1 : 0;

            const colSpan = singleColumns + memberStatisticsColumns + affStatisticsColumns + monthOnMonthAndPlayerGgrColumns;

            dataRows.push(<tr key="no-info">
                <td className="text-center" colSpan={colSpan}>{globalResource.NoInfo}</td>
            </tr>);
        }

        return dataRows;
    }

    _buildDataRow(dataItem, productColumnClassName, index, isMainView, isBeforeCutOffDate) {
        const isTotalRow = isMainView ? (dataItem.AffId === 0 && dataItem.UserName === null) : (dataItem.MonthDateString === "");
        const firstColValue = isTotalRow ?
            totalText :
            (isMainView ? dataItem.UserName : this._buildMonthCell(dataItem.MonthDateString, dataItem.Description));

        return (
            <tr key={`dataRow-${index}`}>
                <td className="freeze-column" title={firstColValue}>{firstColValue}</td>
                {this._buildCommonCell(dataItem, productColumnClassName, isTotalRow, isMainView, isBeforeCutOffDate)}
            </tr>
        )
    }

    _buildMonthCell(monthDate, description) {
        return description ? `${monthDate} (${description})` : monthDate;
    }

    _buildCommonCell(dataItem, productColumnClassName, isTotalRow, isMainView, isBeforeCutOffDate) {
        const { headerRow, languageList } = this.props;
        const header = AggregateHeaderColumn.convertColsToObject(headerRow.getCols());

        const isRevenueAff = dataItem.GroupTypeId === DealGroupTypeSettings.RevenueShare;
        const isCPAAff = dataItem.GroupTypeId === DealGroupTypeSettings.CPA;
        const totalClick = format(dataItem.TotalClick);
        const uniqueClick = format(dataItem.UniqueClick);
        const signup = format(dataItem.Signup);
        const fdm = format(dataItem.Fdm);
        const fdmAmt = formatDecimal(dataItem.Fdm_Amount);
        const FDMTotalDeposit = formatDecimal(dataItem.FDM_TotalDeposit);
        const activeMember = format(dataItem.ActivePlayer);
        const qualifiedMember = format(dataItem.QualifiedMember);
        const qualifiedCPAMember = format(dataItem.QualifiedCPAMember);
        const noOfSubAff = format(dataItem.NoOfSubAff);
        const totalDeposit = format(dataItem.TotalDeposit);
        const deposit = formatDecimal(dataItem.Deposit);
        const withdrawal = formatDecimal(dataItem.Withdrawal);
        const turnover = formatDecimal(dataItem.Turnover);
        const ggr = formatDecimal(dataItem.Ggr);
        const bonus = formatDecimal(dataItem.Bonus);
        const rebate = formatDecimal(dataItem.Rebate);
        const platformFee = formatDecimal(dataItem.PlatformFee, !isCPAAff);
        const depositFee = formatDecimal(dataItem.DepositFee, !isCPAAff);
        const withdrawalFee = formatDecimal(dataItem.WithdrawalFee, !isCPAAff)
        const totalFee = formatDecimal(dataItem.TotalFee, !isCPAAff);
        const affWithdrawal = formatDecimal(dataItem.AffWithdrawal);
        const affAdjustment = formatDecimal(dataItem.AffAdjustment);
        const balanceBf = formatDecimal(dataItem.BalanceBf);
        const currentBalanceBf = formatDecimal(dataItem.CurrentBBF);
        const totalEarning = formatDecimal(dataItem.TotalEarning);
        const paymentCurrency = isTotalRow ? '' : dataItem.PaymentCurrency;
        const language = isTotalRow || !isMainView ? '' : languageList[dataItem.PreferredLanguage];
        const status = isTotalRow ? '' : dataItem.Status;
        const commGroupName = isTotalRow ? '' : dataItem.CommGroupName;
        const paymentFrequency = isTotalRow ? '' : dataItem.PaymentFrequency;

        
        const commRate = isTotalRow ? 'N/A' : formatDecimal(dataItem.CommissionRate * 100) + '%';
        const earning = formatDecimal(dataItem.Earning);
        const approvedCpaAmount = formatDecimal(dataItem.ApprovedCPAAmount, !isRevenueAff);
        const adjustedCpaAmount = formatDecimal(dataItem.AdjustedCPAAmount, !isRevenueAff);
        const totalMainEarning = formatDecimal(dataItem.TotalMainEarning);
        const subAffEarning = formatDecimal(dataItem.SubAffEarning);

        return (
            <React.Fragment>
                {header[reportKey.Status].isShowable && <td className="text-center" title={status}>{status}</td>}
                {header[reportKey.PreferredLanguage].isShowable && <td title={language}>{language}</td>}
                {header[reportKey.PaymentCurrency].isShowable && (<td className="text-center" title={paymentCurrency}>{paymentCurrency}</td>)}
                {header[reportKey.CommGroupName].isShowable && (<td title={commGroupName}>{commGroupName}</td>)}
                {header[reportKey.PaymentFrequency].isShowable && (<td title={paymentFrequency}>{paymentFrequency}</td>)}
                {header[reportKey.TotalClick].isShowable && (<td className="text-right" title={totalClick}>{totalClick}</td>)}
                {header[reportKey.UniqueClick].isShowable && (<td className="text-right" title={uniqueClick}>{uniqueClick}</td>)}
                {header[reportKey.Signup].isShowable && (<td className="text-right" title={signup}>{signup}</td>)}
                {header[reportKey.Fdm].isShowable && (<td className="text-right" title={fdm}>{fdm}</td>)}
                {header[reportKey.Fdm_Amount].isShowable && (<td className="text-right" title={fdmAmt}>{fdmAmt}</td>)}
                {header[reportKey.FDM_TotalDeposit].isShowable && (<td className="text-right" title={FDMTotalDeposit}>{FDMTotalDeposit}</td>)}
                {header[reportKey.ActivePlayer].isShowable && (<td className="text-right" title={activeMember}>{activeMember}</td>)}
                {header[reportKey.QualifiedMember].isShowable && (<td className="text-right" title={qualifiedMember}>{qualifiedMember}</td>)}
                {header[reportKey.QualifiedCPAMember].isShowable && (<td className="text-right" title={qualifiedCPAMember}>{qualifiedCPAMember}</td>)}
                {header[reportKey.NoOfSubAff].isShowable && (<td className="text-right" title={noOfSubAff}>{noOfSubAff}</td>)}
                {header[reportKey.TotalDeposit].isShowable && (<td className="text-right" title={totalDeposit}>{totalDeposit}</td>)}
                {header[reportKey.Deposit].isShowable && (<td className="text-right" title={deposit}>{deposit}</td>)}
                {header[reportKey.Withdrawal].isShowable && (<td className="text-right" title={withdrawal}>{withdrawal}</td>)}
                {header[reportKey.Turnover].isShowable && (<td className={productColumnClassName} title={turnover}>{turnover}</td>)}
                {header[reportKey.Ggr].isShowable && (<td className={productColumnClassName} title={ggr}>{ggr}</td>)}
                {header[reportKey.Bonus].isShowable && (<td className="text-right" title={bonus}>{bonus}</td>)}
                {header[reportKey.Rebate].isShowable && (<td className="text-right" title={rebate}>{rebate}</td>)}
                {header[reportKey.PlatformFee].isShowable && (<td className="text-right" title={platformFee}>{platformFee}</td>)}
                {header[reportKey.DepositFee].isShowable && (<td className="text-right" title={depositFee}>{depositFee}</td>)}
                {header[reportKey.WithdrawalFee].isShowable && (<td className="text-right" title={withdrawalFee}>{withdrawalFee}</td>)}
                {header[reportKey.TotalFee].isShowable && (<td className="text-right" title={totalFee}>{totalFee}</td>)}
                {header[reportKey.CommissionRate].isShowable && (
                    dataItem.IsMultiGroupProduct && isMainView ? (
                        <td className="text-right text-danger" title={isBeforeCutOffDate ? "First product group's share% of multiple groups" : "The highest share % of multiple groups"}>{commRate}</td>
                    ) : (
                        <td className="text-right" title={commRate}>{commRate}</td>
                    ))
                }
                {header[reportKey.Earning].isShowable && (<td className="text-right" title={earning}>{earning}</td>)}
                {header[reportKey.ApprovedCPAAmount].isShowable && (
                    <td className="text-right" title={approvedCpaAmount}>
                        {isTotalRow || isRevenueAff ? approvedCpaAmount : (
                            <Button color="link"
                                onClick={() => this.handleViewApprovedCpaReport(dataItem.UserName, dataItem.GroupId, dataItem.MonthDate)}>
                                {approvedCpaAmount}
                            </Button>
                        )}
                    </td>
                )}
                {header[reportKey.AdjustedCPAAmount].isShowable && (
                    <td className="text-right" title={adjustedCpaAmount}>
                        {isTotalRow || isRevenueAff ? adjustedCpaAmount : (
                            <Button color="link"
                                onClick={() => this.handleViewAdjustedCpaReport(dataItem.UserName, dataItem.GroupId, dataItem.MonthDate)}>
                                {adjustedCpaAmount}
                            </Button>
                        )}
                    </td>
                )}
                {header[reportKey.TotalMainEarning].isShowable && (<td className="text-right" title={totalMainEarning}>{totalMainEarning}</td>)}
                {header[reportKey.SubAffEarning].isShowable && (<td className="text-right" title={subAffEarning}>{subAffEarning}</td>)}
                
                {header[reportKey.TotalEarning].isShowable && (<td className="text-right" title={totalEarning}>{totalEarning}</td>)}
                {header[reportKey.AffWithdrawal].isShowable && (<td className="text-right" title={affWithdrawal}>{affWithdrawal}</td>)}
                {header[reportKey.AffAdjustment].isShowable && (<td className="text-right" title={affAdjustment}>{affAdjustment}</td>)}
                {header[reportKey.BalanceBf].isShowable && (<td className="text-right" title={balanceBf}>{balanceBf}</td>)}
                {header[reportKey.CurrentBBF].isShowable && (<td className="text-right" title={currentBalanceBf}>{currentBalanceBf}</td>)}
                {
                    isMainView && !this.props.isCheckedDatePicker && (
                        <td className="text-center">
                            {dataItem.AffId > 0 ? (
                                <Button color="link"
                                    onClick={() => this.handleViewMonthOnMonth(dataItem.UserName)}>View</Button>) : ''}
                        </td>)
                }
                {
                    isMainView && (
                        <td className="text-center">
                            {dataItem.AffId > 0 ? (
                                <Button color="link"
                                    onClick={() => this.handleViewPlayerGgrReport(dataItem.UserName)}>View</Button>) : ''}
                        </td>)
                }
            </React.Fragment>
        )
    }

    handleViewMonthOnMonth = (userName) => {
        const { param, pagingOption } = this.props;

        const postParam = Object.assign({}, param, {
            UserName: userName,
            SortType: sortByMonthOnMonthView.Month,
            SortDirectionType: sortDirectionType.descending,
            PageIndex: 1,
            PageSize: pagingOption.PageSize
        })

        this.props.setViewLevel(viewLevel.monthOnMonth);
        this.props.setParam(postParam);

        this._resetScroll();
    }

    handleViewPlayerGgrReport = (userName) => {
        const { param } = this.props;

        const paramFromAffReport = {
            affName: userName,
            baseCurrencyId: param.BaseCurrencyId,
            fromDate: param.FromDate,
            toDate: param.ToDate,
            productIds: param.ProductIds
        };

        openUrlOnNewWindow(relativePath.playerGgrReport, paramFromAffReport, 'paramFromAffReport');
    }

    handleViewApprovedCpaReport = (userName, groupId, monthDate) => {
        this.handleOpenPaymentCPAManagement(userName, groupId, monthDate, paymentCPAManagementSetting.Approved);
    }

    handleViewAdjustedCpaReport = (userName, groupId, monthDate) => {
        this.handleOpenPaymentCPAManagement(userName, groupId, monthDate, paymentCPAManagementSetting.Adjustment);
    }

    handleOpenPaymentCPAManagement = (userName, groupId, monthDate, cpaSetting) => {
        const paramForPaymentCPAManagement = this._buildPaymentCPAManagementParams(userName, groupId, monthDate, cpaSetting);
        
        openUrlOnNewWindow(relativePath.paymentCpaManagement, paramForPaymentCPAManagement, 'paramForPaymentCPAManagement');
    }

    _buildPaymentCPAManagementParams = (userName, groupId, monthDate, cpaSetting) => {
        const { param, today } = this.props;
        const now = new Date(today);
        const isMainView = this._isMainView();
        const referenceDate = isMainView ? new Date(param.ToDate) : new Date(monthDate);
        
        return {
            affName: isMainView ? userName : param.UserName,
            viewBy: cpaSetting.ViewBy,
            status: cpaSetting.Status,
            dealIds: groupId,
            fromDate: isMainView ? param.FromDate : getFirstDayOfMonth(referenceDate),
            toDate: getAdjustedDateFromNow(referenceDate, now)
        };
    }

    handlePaging = (index, size) => {
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };
        const newParam = Object.assign({}, this.props.param, newPaging);

        this.fetchData(newParam);
    }

    _resetScroll = () => {
        if (!!this.tableRef.current) {
            this.tableRef.current.scrollTop = 0;
            this.tableRef.current.scrollLeft = 0;
        }
    }

    render() {
        const { gridData, total } = this.state;
        const maxHeight = getMaxHeight(true);
        const style = !this.props.isCheckedDatePicker ? { minWidth: '3250px' } : { minWidth: '2250px'};

        return gridData && (
            <Fragment>
                <div className="table-responsive aff-report-table-container" style={{ maxHeight }} ref={this.tableRef}>
                    <Table className="freeze-table" style={style}>
                        <thead>
                            {
                                this._renderHeader()
                            }
                        </thead>
                        <tbody>
                            {
                                this._renderDataSection(gridData)
                            }
                        </tbody>
                        <tfoot>
                            {total && this._renderDataSection([total])}
                        </tfoot>
                    </Table>
                </div>
                <Pager
                    pageOption={this.props.pagingOption}
                    onPaging={this.handlePaging} />
            </Fragment>
        );
    }
}

function mapStateToProps({ pagingOption, param, currentViewLevel, productList, reportCutOffDate, isCheckedDatePicker, languageList, today }) {
    return Object.assign({}, { pagingOption, param, currentViewLevel, productList, reportCutOffDate, isCheckedDatePicker, languageList, today });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setPagingOption, toggleLoader, setViewLevel, setParam, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(GridData);