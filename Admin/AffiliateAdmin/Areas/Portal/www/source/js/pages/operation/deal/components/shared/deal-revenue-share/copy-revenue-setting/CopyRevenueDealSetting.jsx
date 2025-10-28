import React, { Fragment, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FormGroup, Label, Col, Input } from 'reactstrap';

import { setCopyRevenueDeal, toggleLoader, setDealInfo } from '../../../../actions';
import { getRevenueDealList, getDealDetailInfo } from '../../../../libs/apiService';
import { _buildOnlyRevenueDealInfo } from '../../../../libs/service';

export const CopyRevenueDealSetting = ({ setCopyRevenueDeal, copyRevenueDeal, toggleLoader, setDealInfo }) => {
    const { RsDealId, RsDealList } = copyRevenueDeal;

    useEffect(() => {
        if (RsDealList && RsDealList.length > 0) {
            return;
        }

        const fetchRevenueDealList = async () => {
            toggleLoader(true);
            try {
                const res = await getRevenueDealList();
                setCopyRevenueDeal({ RsDealList: res });
            } catch (error) {
                console.error("Failed to fetch revenue deal list: ", error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchRevenueDealList();
    }, [RsDealList]);

    const handleChangeRsDealId = (e) => {
        const id = Number(e.target.value);
        fetchDealDetail(id);
    };

    const fetchDealDetail = async (rsDealId) => {
        toggleLoader(true);
        try {
            const res = await getDealDetailInfo(rsDealId);
            const data = res?.status === 200 ? _buildOnlyRevenueDealInfo(res.data) : null;

            if (data) {
                setCopyRevenueDeal({ RsDealId: rsDealId });
                setDealInfo(data);
            }
        } catch (error) {
            console.error("Failed to fetch deal detail: ", error);
        } finally {
            toggleLoader(false);
        }
    };

    return (
        <Fragment>
            <FormGroup row className='align-items-center'>
                <Label className='mr_50neg' sm={3}><b>Copy Setting From</b></Label>
                <Col sm={4}>
                    <Input
                        type='select'
                        name='RsDealId'
                        id='RsDealId'
                        value={RsDealId}
                        onChange={handleChangeRsDealId}>
                        <option key='0' disabled hidden value={0}>Please Select</option>
                        {RsDealList.map(deal => (
                            <option key={deal.GroupId} value={deal.GroupId}>{deal.GroupName}</option>
                        ))}
                    </Input>
                </Col>
            </FormGroup>
        </Fragment >
    )
}

const mapStateToProps = ({ copyRevenueDeal }) => {
    return {
        copyRevenueDeal
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setCopyRevenueDeal,
        toggleLoader,
        setDealInfo
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CopyRevenueDealSetting));