import React, { useState, useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Table } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';
import TableHeader from './table/TableHeader';
import TableBody from './table/TableBody';
import TableFooter from './table/TableFooter';

import { toggleLoader } from '../../../../actions/loaderAction';
import { toggleSubmit, setPagingOption, toggleAdjustAmountModal, setAdjustAmountParam } from '../actions';
import { getRedepositCpaData } from '../libs/service';
import ClaimPrincipal, { claimResource } from '../../../../modules/claim';
import { getMaxHeight } from '../../libs/constants';

export const GridData = ({
    params,
    isSubmit,
    toggleLoader,
    toggleSubmit,
    setPagingOption,
    pagingOption,
    toggleAdjustAmountModal,
    setAdjustAmountParam }) => {

    const tableRef = useRef(null);

    const [data, setData] = useState(null);
    const [total, setTotal] = useState(null);

    useEffect(() => {
        if (isSubmit) {
            fetchData(params);
        }
    }, [isSubmit]);

    const fetchData = (params) => {
        toggleLoader(true);
        getRedepositCpaData(params)
            .then(data => {
                if (!!data) {
                    const { MainData, Total, TotalItem } = data;
                    setTotal(Total);
                    setPagingOption({
                        PageIndex: params.pageIndex,
                        PageSize: params.pageSize,
                        TotalItem: TotalItem
                    });
                    setData(MainData);
                    resetScroll();
                }
            })
            .catch(err => {
                console.log('err: ', err);
            })
            .finally(() => {
                toggleLoader(false);
                toggleSubmit(false);
            })
    }

    const handlePaging = (index, size) => {
        const newPaging = {
            pageIndex: index,
            pageSize: size
        };
        const newParams = {
            ...params,
            ...newPaging
        };
        fetchData(newParams);
    }

    const resetScroll = () => {
        if (tableRef.current) {
            tableRef.current.scrollTop = 0;
            tableRef.current.scrollLeft = 0;
        }
    }

    const maxHeight = getMaxHeight();
    const claimsPrincipal = ClaimPrincipal.currentClaimPrincipal;
    const isAdjustable = claimsPrincipal.hasWriteClaim(claimResource.Payment);

    return data && (
        <React.Fragment>
            <div className="table-responsive payment-cpa-management-table-container" ref={tableRef} style={{ maxHeight }}>
                <Table className="freeze-table table-bordered table-hover">
                    <TableHeader
                        isAdjustable={isAdjustable} />
                    <TableBody
                        data={data}
                        isAdjustable={isAdjustable}
                        toggleAdjustAmountModal={toggleAdjustAmountModal}
                        setAdjustAmountParam={setAdjustAmountParam}
                        pagingOption={pagingOption} />
                    <TableFooter
                        total={total}
                        totalItem={pagingOption.TotalItem}
                        isAdjustable={isAdjustable} />
                </Table>
            </div>
            <Pager
                pageOption={pagingOption}
                onPaging={handlePaging} />
        </React.Fragment>
    )
};

const mapStateToProps = ({ params, isSubmit, pagingOption }) => {

    return {
        params,
        isSubmit,
        pagingOption
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleLoader,
        toggleSubmit,
        setPagingOption,
        toggleAdjustAmountModal,
        setAdjustAmountParam
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(GridData));