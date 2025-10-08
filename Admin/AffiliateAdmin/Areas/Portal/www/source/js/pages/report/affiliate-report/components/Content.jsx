import React, { Component, createRef } from "react";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GridData from './GridData';
import ReportTitle from '../../../../components/ReportTitle';

import { setViewLevel, fetchData } from '../actions';
import { toggleLoader } from '../../../../actions/loaderAction';
import { headerConfig, viewLevel } from '../libs/constants';
import ReportExcel from '../libs/reportExcel';
import { AggregateHeaderColumn, HeaderRow, SingleHeaderColumn } from "../libs/headerConfigs";

export class Content extends Component {
    constructor(props) {
        super(props);

        this.gridDataRef = createRef();
    }

    shouldComponentUpdate(nextProps) {
        const { reportTitle } = this.props;

        return nextProps.reportTitle !== reportTitle;
    }

    handleClickBreadcrumb = () => {
        this.gridDataRef.current._resetScroll();
        this.props.setViewLevel(viewLevel.main);
    }

    handleExportExcel = async () => {
        this.props.toggleLoader(true);
        const { param, reportTitle, currentViewLevel, languageList, isCheckedDatePicker } = this.props;
        const isMainView = currentViewLevel === viewLevel.main;
        const newParam = Object.assign({}, param, { IsExportExcel: true });
        const data = await this.props.fetchData(newParam, isMainView);
        const header = this._buildHeader();

        if (data) {
            const reportExcel = new ReportExcel(data, reportTitle, isMainView, header, languageList, isCheckedDatePicker);
            reportExcel.export();
        }
        this.props.toggleLoader(false);
    }

    _buildReportTitle() {
        const { currentViewLevel, reportTitle } = this.props;
        const isMainView = currentViewLevel === viewLevel.main;

        return isMainView ? (
            <div className="d-flex align-items-center">
                {reportTitle}
                <button type="button" className="ml-auto btn btn-link btn-excel" onClick={this.handleExportExcel} title="Export Excel">
                    <span className="oi icon-excel"></span>
                </button>
            </div>
        ) : (
            <div className="d-flex align-items-center">
                <a href="javascript:;" className="btn-link font-weight-bold" onClick={this.handleClickBreadcrumb}>AFFILIATE REPORT</a>&nbsp;&gt; {reportTitle}
                <button type="button" className="ml-auto btn btn-link btn-excel" onClick={this.handleExportExcel} title="Export Excel">
                    <span className="oi icon-excel"></span>
                </button>
            </div>
        )
    }

    _buildHeader() {
        const headerKeys = Object.keys(headerConfig);
        const cols = [];

        headerKeys.forEach(key => {
            if (!!headerConfig[key].cols) {
                cols.push(this._buildAggregateHeaderCol(key, headerConfig[key]));
            } else {
                cols.push(this._buildSingleHeaderCol(key, headerConfig[key]));
            }
        });

        return new HeaderRow(cols);
    }

    _buildSingleHeaderCol(key, item) {
        const { currentViewLevel, isCheckedDatePicker } = this.props;
        const isMainView = currentViewLevel === viewLevel.main;

        if (!!item.isShowable && typeof item.isShowable === 'function') {
            return new SingleHeaderColumn(key, item.label, item.isShowable(null, isMainView, isCheckedDatePicker));
        } else {
            return new SingleHeaderColumn(key, item.label, true);
        }
    }

    _buildAggregateHeaderCol(key, header) {
        const cols = [];
        const headerCols = header.cols;
        const headerKeys = Object.keys(headerCols);

        headerKeys.forEach(key => {
            if (!!headerCols[key].cols) {
                cols.push(this._buildAggregateHeaderCol(key, headerCols[key]));
            } else {
                cols.push(this._buildSingleHeaderCol(key, headerCols[key]));
            }
        });

        return new AggregateHeaderColumn(key, header.label, cols);
    }

    render() {
        const { reportTitle } = this.props;
        const headerRow = this._buildHeader();

        return (
            <div className="data-content my-2 report-content-container">
                {
                    reportTitle && (
                        <React.Fragment>
                            <ReportTitle content={this._buildReportTitle()} />
                        </React.Fragment>
                    )
                }
                <GridData headerRow={headerRow} ref={this.gridDataRef} />
            </div>
        );
    }
}

function mapStateToProps({ reportTitle, currentViewLevel, param, isCheckedDatePicker, languageList }) {
    return Object.assign({}, { reportTitle, currentViewLevel, param, isCheckedDatePicker, languageList });
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setViewLevel, toggleLoader, fetchData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);