import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Label, Col, Input, Button, Form } from 'reactstrap';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';
import { showErrorToast } from '@/pages/common/components/Toast';
import Select from '@/components/select/components/Select';

// Deal Form Modal Component - Add Only
const DealFormModal = ({
    title,
    formData,
    onDealNameChange,
    onSubmit,
    onClose,
    statusList,
    dealNameOptions,
    showStatusNote,
    onInputChange,
    isLoadingDealNames,
    showValidationError
}) => (
    <div className="modal-backdrop">
        <div className="component-form-modal" style={{ width: '500px', maxWidth: '90vw' }}>
            <div className="modal-header form-header">
                <div className="header-content">
                    <span className="oi oi-plus"></span>{title}
                </div>
                <button
                    type="button"
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="modal-content form-content">
                <Form onSubmit={onSubmit} autoComplete="off" acceptCharset="UTF-8">
                    <FormGroup row className={`mb-2 ${showValidationError ? 'is-invalid' : ''}`}>
                        <Label sm={3} htmlFor="dealName" className="required">
                            Deal Name
                        </Label>
                        <Col sm={9}>
                            <div className={showValidationError ? 'select-validation-error' : ''}>
                                <Select
                                    id="dealName"
                                    dataSource={dealNameOptions}
                                    keyField="GroupId"
                                    valueField="GroupName"
                                    hasInputOption={true}
                                    selectedKey={formData.dealId}
                                    onChange={onDealNameChange}
                                    isDisable={isLoadingDealNames}
                                />
                            </div>
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mb-3">
                        <Label sm={3} htmlFor="statusId">Status</Label>
                        <Col sm={9}>
                            <Input
                                type="select"
                                name="statusId"
                                id="statusId"
                                value={formData.statusId}
                                onChange={onInputChange}
                            >
                                {statusList && statusList.filter(option => option.key !== '').map(statusOption => (
                                    <option key={statusOption.key} value={statusOption.key}>
                                        {statusOption.name}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </FormGroup>

                    {showStatusNote && (
                        <div className="status-change-note">
                            <div className="status-note-content">
                                <div className="status-note-line">
                                    Only active deal will be available for selection when generating a link.
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="component-form-actions text-right">
                        <Button
                            type="button"
                            color="info"
                            className="mr-2"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="success"
                            disabled={!formData.dealId || formData.dealId === 0 || formData.dealId === null}
                        >
                            Add
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
);

const DealFormPopup = () => {
    const dispatch = useDispatch();
    const [
        popupState,
        param,
        selectedStatus,
        searchComponent,
        selectedComponentType,
        componentTypesList,
        statusList,
        selectedDealType,
        dealNameList
    ] = useSelector(state => [
        state.popupState,
        state.param,
        state.selectedStatus,
        state.searchComponent,
        state.selectedComponentType,
        state.componentTypesList,
        state.statusList,
        state.selectedDealType,
        state.dealNameList
    ]);

    const { insertDeal, setParam, closeComponentPopup, fetchDealNameList } = ActionCreators;

    const { isOpen, isAdd } = popupState;

    const [formData, setFormData] = useState({
        dealId: null,  // GroupId from the deal list (null = not selected)
        dealName: '',
        statusId: 1
    });

    const [showStatusNote, setShowStatusNote] = useState(false);
    const [isLoadingDealNames, setIsLoadingDealNames] = useState(false);
    const [showValidationError, setShowValidationError] = useState(true);

    // Fetch deal name list from API when popup opens or deal type changes
    useEffect(() => {
        if (isOpen) {
            setIsLoadingDealNames(true);
            dispatch(fetchDealNameList(selectedDealType)).finally(() => {
                setIsLoadingDealNames(false);
            });
        }
    }, [isOpen, selectedDealType, dispatch, fetchDealNameList]);

    // Map deal names to Select component format
    // DealName Select selects GroupId from the data list (GroupId, GroupName, GroupTypeId)
    const dealNameOptions = isLoadingDealNames
        ? [{ GroupId: 0, GroupName: 'Loading...' }]
        : dealNameList && dealNameList.length > 0
            ? dealNameList.map(item => ({
                GroupId: item.GroupId,
                GroupName: item.GroupName
            }))
            : [];

    const getCurrentComponentType = () => {
        if (!componentTypesList || componentTypesList.length === 0) {
            return { name: 'Component', id: null };
        }
        return componentTypesList.find(ct => ct.id == selectedComponentType) || componentTypesList[0];
    };

    // Reset form when component type changes
    useEffect(() => {
        setFormData({
            dealId: null,
            dealName: '',
            statusId: 1
        });
        setShowStatusNote(false);
        setShowValidationError(true);
    }, [selectedComponentType]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'statusId') {
            setShowStatusNote(true);
        }
    }, []);

    const handleDealNameChange = useCallback((selectedKey) => {
        // selectedKey is the GroupId (dealId)
        setFormData(prev => ({
            ...prev,
            dealId: selectedKey,
            dealName: dealNameOptions.find(opt => opt.GroupId === selectedKey)?.GroupName || ''
        }));
        // Clear validation error when user selects a valid deal
        // Show validation error when no deal is selected
        if (selectedKey && selectedKey !== 0) {
            setShowValidationError(false);
        } else {
            setShowValidationError(true);
        }
    }, [dealNameOptions]);

    const handleClosePopup = useCallback(() => {
        setFormData({
            dealId: null,
            dealName: '',
            statusId: 1
        });
        setShowStatusNote(false);
        setShowValidationError(false);

        dispatch(closeComponentPopup());
    }, [dispatch, closeComponentPopup, selectedComponentType]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!formData.dealId || formData.dealId === 0 || formData.dealId === null) {
            setShowValidationError(true);
            showErrorToast('Validation Error', 'Deal Name is required.');
            return;
        }

        const newParam = param
            ? { ...param, RequestId: uuidv4() }
            : {
                ComponentTypeId: selectedComponentType,
                StatusIds: selectedStatus,
                Search: searchComponent,
                RequestId: uuidv4()
            };

        const submitData = {
            dealId: formData.dealId,
            statusId: formData.statusId,
            dealName: formData.dealName
        };

        dispatch(insertDeal(submitData, () => {
            dispatch(setParam(newParam));
            handleClosePopup();
        }));
    }, [formData, param, dispatch, insertDeal, setParam, handleClosePopup, selectedComponentType, selectedStatus, searchComponent, dealNameOptions]);

    // Only show for Add operation and Deal type
    if (!isOpen || !isAdd) return null;

    const currentComponentType = getCurrentComponentType();
    const isDealType = currentComponentType.name === 'Deal';

    if (!isDealType) return null;

    const title = `Add New ${currentComponentType.name}`;

    return (
        <DealFormModal
            title={title}
            formData={formData}
            onInputChange={handleInputChange}
            onDealNameChange={handleDealNameChange}
            onSubmit={handleSubmit}
            onClose={handleClosePopup}
            statusList={statusList}
            dealNameOptions={dealNameOptions}
            showStatusNote={showStatusNote}
            isLoadingDealNames={isLoadingDealNames}
            showValidationError={showValidationError}
        />
    );
};

export default DealFormPopup;

