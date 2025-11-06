import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Fragment } from 'react';
import { Table } from 'reactstrap';
import TableHeader from './table/TableHeader';
import { Pager } from '@9softstudio/react-fixed-table-header';
import TableFooter from './table/TableFooter';
import TableBody from './table/TableBody';

import { getMaxHeight } from '../../libs/constants';
import { setParams, setPagingOption } from '../actions';
import { paginate, sortBy } from '../libs/service';
import { toggleLoader } from '../../../../actions/loaderAction';

export const GridData = ({ params, pagingOption, playerCpaData, setParams, setPagingOption, toggleLoader }) => {
    const [gridData, setGridData] = useState(null);
    const [sortedData, setSortedData] = useState(null);

    useEffect(() => {
        if (playerCpaData) {
            const sortedData = sortBy(playerCpaData?.mainData, params.sortColumn, params.isAscending);
            const data = paginate(sortedData, pagingOption?.PageIndex, pagingOption?.PageSize);

            setGridData(data);
            setSortedData(sortedData);
        }
    }, [playerCpaData]);

    const handlePaging = (pageIndex, pageSize) => {
        toggleLoader(true);

        setTimeout(() => {
            setPagingOption({
                ...pagingOption,
                PageIndex: pageIndex,
                PageSize: pageSize
            });

            const data = paginate(sortedData, pageIndex, pageSize);
            
            setGridData(data);
            toggleLoader(false);
        }, 100);
    }

    const handleSort = (sortColumnSelected) => {
        toggleLoader(true);

        setTimeout(() => {
            if (!sortColumnSelected) return;

            const isAscending = params?.sortColumn === sortColumnSelected ? !params?.isAscending : true;
            const newSortedData = sortBy(
                playerCpaData?.mainData,
                sortColumnSelected,
                isAscending
            );

            const pagingData = paginate(newSortedData, pagingOption.PageIndex, pagingOption.PageSize);

            setParams({
                sortColumn: sortColumnSelected,
                isAscending: isAscending
            });

            setGridData(pagingData);
            setSortedData(newSortedData);
            toggleLoader(false);
        }, 100);
    }

    if (!gridData) {
        return null
    }

    const maxHeight = getMaxHeight();

    return (
        <Fragment>
            <div className="table-responsive" style={{ maxHeight }}>
                <Table className="freeze-table table-bordered table-hover">
                    <TableHeader
                        sortColumn={params?.sortColumn}
                        isAscending={params?.isAscending}
                        handleSort={handleSort}
                    />
                    <TableBody
                        data={gridData}
                        pagingOption={pagingOption} />
                    <TableFooter
                        total={playerCpaData?.total}
                        totalItem={playerCpaData?.totalItem} />
                </Table>
            </div>
            <Pager
                pageOption={pagingOption}
                onPaging={handlePaging} />
        </Fragment>
    )
}

const mapStateToProps = ({ params, pagingOption, playerCpaData }) => {
    return Object.assign({}, {
        params,
        pagingOption,
        playerCpaData,
    })
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setParams,
        setPagingOption,
        toggleLoader
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GridData));