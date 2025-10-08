import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import GridData from './GridData';
import ReportExcel from '../libs/reportExcel';
import { getPaymentCpaManagementData } from '../libs/service';

import { toggleLoader } from '../../../../actions/loaderAction';
import { resource, viewByList } from '../libs/constants';

const Title = ({ params, isSubmit, toggleLoader }) => {
    const [reportTitle, setReportTitle] = useState('');

    useEffect(() => {
        if (isSubmit) {
            let title = resource.reportName;

            title += `${resource.space}View By ${viewByList[params.viewBy]}`
            title += `${resource.space}From ${params.fromDate} To ${params.toDate}`;

            setReportTitle(title);
        }
    }, [isSubmit]);

    const handleExportExcel = async () => {
        toggleLoader(true);
        try {
            const exportData = await getPaymentCpaManagementData(params, true);

            if (exportData) {
                const reportExcel = new ReportExcel(exportData, reportTitle, {
                    showTotal: exportData.TotalItem > 0
                });
                reportExcel.export();
            }
        }
        catch (err) {
            console.log('err', err);
        }
        finally {
            toggleLoader(false);
        }
    }

    return reportTitle && (
        <div className="report-title-container">
            <div className="report-title">
                <div className="d-flex align-items-center">
                    {reportTitle}
                    <button type="button" className="ml-auto btn btn-link btn-excel" onClick={handleExportExcel} title="Export Excel">
                        <span className="oi icon-excel"></span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export const Content = ({ params, isSubmit, toggleLoader }) => {
    return (
        <React.Fragment>
            <div className='data-content my-2 payment-cpa-management-content-container'>
                <Title params={params} isSubmit={isSubmit} toggleLoader={toggleLoader} />
                <GridData />
            </div>
        </React.Fragment>
    )
};

const mapStateToProps = ({ params, isSubmit }) => {
    return {
        params,
        isSubmit,
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleLoader
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));