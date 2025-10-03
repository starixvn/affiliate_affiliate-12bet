import React, { useEffect, useState, useRef, useCallback } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Pager } from '@9softstudio/react-fixed-table-header';

import { setParam, setDealInfo, setPagingOption, fetchData, setIsEdit, setIsSubmitted, setCopyRevenueDeal } from '../actions';
import { copyRevenueDealDefault } from '../libs/constants';

import GridData from './deal-list/GridData';
import AddDeal from './add-deal/AddDeal';
import EditDeal from './edit-deal/EditDeal';

export const Content = (props) => {

    const [popupInfo, setPopupInfo] = useState({ Content: null, Title: '' });

    const modalRef = useRef(null);

    useEffect(() => {
        const { param, pagingOption } = props;
        if (param) {
            const updatedParam = {
                ...param,
                PageIndex: 1,
                PageSize: pagingOption.PageSize
            };
            _fetchData(updatedParam);
        }
    }, [props.param]);

    const _fetchData = async (param) => {
        await props.fetchData(param);
    }

    const _handlePaging = (index, size) => {
        const newPaging = {
            PageIndex: index,
            PageSize: size
        };

        const newParam = { ...props.param, ...newPaging };
        _fetchData(newParam);
    }

    const _handleHidePopup = () => {
        setPopupInfo({ Content: null, Title: '' });
        props.setIsEdit(false);
        props.setIsSubmitted(false);
        props.setDealInfo(null);
        props.setCopyRevenueDeal(copyRevenueDealDefault);
    }

    const _handleShowAddPopup = useCallback((dealId = null) => {
        if (!props.isModifiable) {
            return;
        }

        props.setIsEdit(false);
        setPopupInfo({
            Content: <AddDeal onClose={_handleHidePopup} onSave={_handleSave} dealId={dealId} />,
            Title: 'Add new Deal'
        });
    }, []);

    const _handleShowEditPopup = useCallback((dealId) => {
        props.setIsEdit(true);
        setPopupInfo({
            Content: <EditDeal onClose={_handleHidePopup} onSave={_handleSave} dealId={dealId} />,
            Title: props.isModifiable ? 'Edit Deal' : 'View Deal'
        });
    }, []);

    const _handleSave = () => {
        modalRef.current.scrollTo({ top: 0, behavior: "smooth" });
        if (!props.isSubmitted) {
            props.setIsSubmitted(true);
        }
    }

    return props.gridData && (
        <div className='data-content my-2'>
            {
                props.isModifiable && (
                    <div className="my-2">
                        <Button outline type="button" onClick={() => _handleShowAddPopup()}>
                            Add Deal
                            <span className="oi oi-plus ml-2"></span>
                        </Button>
                    </div>
                )
            }
            <GridData onEdit={_handleShowEditPopup} onCopy={_handleShowAddPopup} />
            <Pager pageOption={props.pagingOption} onPaging={_handlePaging} />

            {
                popupInfo.Content && <Modal className="deal-popup-container" isOpen={!!popupInfo.Content} toggle={_handleHidePopup} size="lg" backdrop='static' innerRef={modalRef}>
                    <ModalHeader toggle={_handleHidePopup}><span className="iconpopup"></span>{popupInfo.Title}</ModalHeader>
                    <ModalBody className={props.isModifiable ? '' : 'disabled-all'}>
                        <div className="modal-body-wrapper">
                            {popupInfo.Content}
                        </div>
                    </ModalBody>
                </Modal>
            }
        </div>
    );
}

const mapStateToProps = ({ param, pagingOption, gridData, isModifiable }) => {
    return {
        param,
        pagingOption,
        gridData,
        isModifiable
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setParam,
        setDealInfo,
        setPagingOption,
        fetchData,
        setIsEdit,
        setIsSubmitted,
        setCopyRevenueDeal
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Content));