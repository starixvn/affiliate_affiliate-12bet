import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader } from '../../../../actions/loaderAction';
import ReportTitle from '../../../../components/ReportTitle';
import GridData from './GridData';
import ExportExcel from '../libs/exportExcel';
import { sortBy } from '../libs/service';

const Title = ({ reportTitle, params, toggleLoader, playerCpaData }) => {

    const handleExportExcel = async () => {
        toggleLoader(true);
        try {
            const sortedData = sortBy(playerCpaData?.mainData, params.sortColumn, params.isAscending);
            const exportExcel = new ExportExcel(sortedData, reportTitle, playerCpaData?.total);
            exportExcel.export();
        }
        catch (err) {
            console.log('err', err);
        }
        finally {
            toggleLoader(false);
        }
    }

    return (
        <div className="d-flex align-items-center">
            {reportTitle}
            <button type="button" className="ml-auto btn btn-link btn-excel" onClick={handleExportExcel} title="Export Excel">
                <span className="oi icon-excel"></span>
            </button>
        </div>
    )
}

export const Content = ({ reportTitle, toggleLoader, params, playerCpaData }) => {
    return (
        <div className='data-content my-2 report-player-cpa-content-container'>
            {
                reportTitle && (
                    <ReportTitle content={<Title reportTitle={reportTitle} params={params} toggleLoader={toggleLoader} playerCpaData={playerCpaData} />} />
                )
            }
            <GridData />
        </div>
    )
}

const mapStateToProps = ({ params, reportTitle, playerCpaData }) => {
    return {
        params,
        reportTitle,
        playerCpaData
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ toggleLoader }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));