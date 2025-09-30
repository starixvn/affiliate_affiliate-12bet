import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormGroup, Label, Col, Input, Button, Form } from 'reactstrap';
import { ActionCreators } from '../actions';
import { formPopupNote } from '../constants/settings';
import { v4 as uuidv4 } from 'uuid';
import { showErrorToast } from '@/pages/common/components/Toast';

// Component Form Modal Component
const ComponentFormModal = ({
    title,
    formData,
    errors,
    onInputChange,
    onBlur,
    onSubmit,
    onClose,
    isAdd,
    statusList
}) => (
    <div className="modal-backdrop">
        <div className="component-form-modal" style={{ width: '500px', maxWidth: '90vw' }}>
            <div className="modal-header form-header">
                <div className="header-content">
                    <span className={isAdd ? "oi oi-plus" : "oi oi-pencil"}></span>{title}
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
                <div className="alert alert-info mb-3" role="alert">
                    <strong>Note:</strong> {formPopupNote}
                </div>
                <Form onSubmit={onSubmit} autoComplete="off" acceptCharset="UTF-8">
                    {!isAdd && (
                        <FormGroup row className="mb-2">
                            <Label sm={2} htmlFor="code">Code</Label>
                            <Col sm={10}>
                                <Input
                                    type="text"
                                    name="componentCode"
                                    id="componentCode"
                                    value={formData.componentCode}
                                    disabled={true}
                                />
                            </Col>
                        </FormGroup>
                    )}

                    <FormGroup row className="mb-2">
                        <Label sm={2} htmlFor="componentName" className="required">
                            Name
                        </Label>
                        <Col sm={10}>
                            <Input
                                type="text"
                                name="componentName"
                                id="componentName"
                                placeholder="Enter component name"
                                value={formData.componentName}
                                onChange={onInputChange}
                                onBlur={onBlur}
                                className={errors.componentName ? 'form-validation-warning' : ''}
                                required
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row className="mb-3">
                        <Label sm={2} htmlFor="statusId">Status</Label>
                        <Col sm={10}>
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
                            disabled={!formData.componentName}
                        >
                            {isAdd ? 'Add' : 'Update'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </div>
);

const ComponentFormPopup = () => {
    const dispatch = useDispatch();
    const [
        popupState,
        param,
        selectedStatus,
        searchComponent,
        selectedComponentType,
        componentTypesList,
        statusList
    ] = useSelector(state => [
        state.popupState,
        state.param,
        state.selectedStatus,
        state.searchComponent,
        state.selectedComponentType,
        state.componentTypesList,
        state.statusList
    ]);

    const { insertComponent, updateComponent, setParam, closeComponentPopup } = ActionCreators;

    const { isOpen, isAdd, selectedItem } = popupState;

    const [formData, setFormData] = useState({
        componentId: 0,
        componentCode: '',
        componentName: '',
        componentTypeId: selectedComponentType,
        statusId: 0
    });

    const [state, setState] = useState({
        errors: {
            componentName: false
        }
    });

    const getCurrentComponentType = () => {
        if (!componentTypesList || componentTypesList.length === 0) {
            return { name: 'Component', id: null };
        }
        return componentTypesList.find(ct => ct.id === selectedComponentType) || componentTypesList[0];
    };

    useEffect(() => {
        if (!isAdd && selectedItem) {
            setFormData({
                componentId: selectedItem.ComponentId || 0,
                componentCode: selectedItem.ComponentCode || '',
                componentName: selectedItem.ComponentName || '',
                componentTypeId: selectedComponentType,
                statusId: selectedItem.StatusId || 0
            });
            setState({
                errors: {
                    componentName: false
                }
            });
        } else if (isAdd) {
            setFormData({
                componentId: 0,
                componentCode: '',
                componentName: '',
                componentTypeId: selectedComponentType,
                statusId: 1
            });
            setState({
                errors: {
                    componentName: false
                }
            });
        }
    }, [isAdd, selectedItem, selectedComponentType]);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setState(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                [name]: false
            }
        }));
    }, []);

    const handleNameBlur = useCallback((e) => {
        const value = e.target.value;
        if (!value) {
            setState(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    componentName: true
                }
            }));
        }
    }, []);

    const handleClosePopup = useCallback(() => {
        setFormData({
            componentId: 0,
            componentCode: '',
            componentName: '',
            componentTypeId: selectedComponentType,
            statusId: 1
        });

        setState({
            errors: {
                componentName: false
            }
        });

        dispatch(closeComponentPopup());
    }, [dispatch, closeComponentPopup, selectedComponentType]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const newErrors = {
            componentName: !formData.componentName
        };

        setState(prev => ({ ...prev, errors: newErrors }));

        if (newErrors.componentName) {
            showErrorToast('Validation Error', 'Name is required.');
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

        if (isAdd) {
            dispatch(insertComponent(formData, () => {
                dispatch(setParam(newParam));
                handleClosePopup();
            }));
        } else {
            dispatch(updateComponent(formData, () => {
                dispatch(setParam(newParam));
                handleClosePopup();
            }));
        }
    }, [formData, isAdd, selectedItem, param, dispatch, insertComponent, updateComponent, setParam, handleClosePopup, selectedComponentType, selectedStatus, searchComponent]);

    if (!isOpen) return null;

    const currentComponentType = getCurrentComponentType();
    const title = isAdd ? `Add New ${currentComponentType.name}` : `Edit ${currentComponentType.name}`;

    return (
        <ComponentFormModal
            title={title}
            formData={formData}
            errors={state.errors}
            onInputChange={handleInputChange}
            onBlur={handleNameBlur}
            onSubmit={handleSubmit}
            onClose={handleClosePopup}
            isAdd={isAdd}
            statusList={statusList}
        />
    );
};

export default ComponentFormPopup;
