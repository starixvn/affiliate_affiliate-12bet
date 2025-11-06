import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import AdjustCpaAmountForm from './AdjustCpaAmountForm';
import { toggleAdjustAmountModal, setAdjustAmountParam, updateCpaAmount } from '../../actions';
import { defaultAdjustAmountModal, defaultAdjustAmount } from '../../libs/constants';


export const AdjustCpaAmountModal = ({ adjustAmountModal, adjustAmountParam, toggleAdjustAmountModal, setAdjustAmountParam, updateCpaAmount }) => {
    const { isOpen, title } = adjustAmountModal;

    const handleClose = () => {
        setAdjustAmountParam(defaultAdjustAmount);
        toggleAdjustAmountModal(defaultAdjustAmountModal);
    }

    const handleSubmit = () => {
        updateCpaAmount(adjustAmountParam);
    }

    return (
        <Modal className='adjust-amount-cpa-popup-container' isOpen={isOpen} toggle={handleClose} backdrop='static'>
            <ModalHeader toggle={handleClose}>{title}</ModalHeader>
            <ModalBody>
                <div className='modal-body-wrapper'>
                    <AdjustCpaAmountForm
                        adjustAmountParam={adjustAmountParam}
                        setAdjustAmountParam={setAdjustAmountParam}
                        onSubmit={handleSubmit}
                    />
                </div>
            </ModalBody>
        </Modal>
    );
};

const mapStateToProps = ({ adjustAmountModal, adjustAmountParam }) => {
    return {
        adjustAmountModal,
        adjustAmountParam
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        toggleAdjustAmountModal,
        setAdjustAmountParam,
        updateCpaAmount
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AdjustCpaAmountModal));