import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import MultipleSelect from '@/components/multiple-select';
import { handleChangeMultipleSelected } from '@/modules/utils';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';

const FilterForm = () => {
    const {
        setSelectedStatus,
        setStatusList,
        setSearchComponent,
        setParam,
        openComponentPopup,
        setSelectedDealType
    } = ActionCreators;

    const [
        selectedComponentType,
        selectedStatus,
        searchComponent,
        isShowLoader,
        componentTypesList,
        statusList,
        selectedDealType,
        dealTypesList
    ] = useSelector(state => [
        state.selectedComponentType,
        state.selectedStatus,
        state.searchComponent,
        state.isShowLoader,
        state.componentTypesList,
        state.statusList,
        state.selectedDealType,
        state.dealTypesList]);

    const dispatch = useDispatch();

    const getCurrentComponentType = () => {
        if (!componentTypesList || componentTypesList.length === 0) {
            return { name: 'Component', id: null };
        }
        return componentTypesList.find(ct => ct.id == selectedComponentType) || componentTypesList[0];
    };

    const handleChangeStatus = (item, selectedStatusList) => {
        dispatch(setSelectedStatus(selectedStatusList));
        dispatch(setStatusList(handleChangeMultipleSelected(statusList, selectedStatusList)));
    };

    const handleChangeDealType = (event) => {
        const selectedDealTypeValue = event.target.value;
        dispatch(setSelectedDealType(selectedDealTypeValue));
    };

    const handleChangeSearch = (event) => {
        dispatch(setSearchComponent(event.target.value));
    };

    const handleSearch = () => {
        const params = {
            ComponentTypeId: selectedComponentType,
            StatusIds: selectedStatus,
            ComponentName: searchComponent,
            DealTypes: selectedDealType,
            RequestId: uuidv4()
        };
        dispatch(setParam(params));
    };

    const handleAddNew = () => {
        if (!isShowLoader) {
            dispatch(openComponentPopup(true));
        }
    };

    const currentComponentType = getCurrentComponentType();
    const isDealType = currentComponentType.name === 'Deal';

    return (
        <div className="component-management-content">
            <div className="content-header">
                <h2>{currentComponentType.name} Management</h2>
            </div>

            <div className="filter-container my-2 pb-0">
                <Form inline tag="div">
                    {isDealType && (
                        <FormGroup className="mr-sm-3 pb-2 single-status-filter deal-type-filter">
                            <Label htmlFor="dealType" className="mr-sm-2">Deal Type</Label>
                            <Input
                                type="select"
                                name="dealType"
                                id="dealType"
                                value={selectedDealType !== undefined && selectedDealType !== null ? selectedDealType : ''}
                                onChange={handleChangeDealType}
                                className="status-select-input"
                            >
                                <option value="">All</option>
                                {dealTypesList && dealTypesList.length > 0 ? dealTypesList.map(dealTypeOption => {
                                    if (dealTypeOption.key === '' || dealTypeOption.name === 'All') return null;
                                    return (
                                        <option
                                            key={dealTypeOption.key}
                                            value={dealTypeOption.key}
                                        >
                                            {dealTypeOption.name}
                                        </option>
                                    );
                                }) : (
                                    <option value="" disabled>Loading...</option>
                                )}
                            </Input>
                        </FormGroup>
                    )}

                    <FormGroup className="mr-sm-2 pb-2">
                        <Label htmlFor="componentSearch" className="mr-sm-2">
                            {isDealType ? 'Deal Name' : currentComponentType.name}
                        </Label>
                        <Input
                            type="text"
                            name="componentSearch"
                            id="componentSearch"
                            value={searchComponent}
                            onChange={handleChangeSearch}
                            placeholder={isDealType ? 'Search deal name' : 'Search name/code'}
                            className="wide-input"
                        />
                    </FormGroup>

                    <FormGroup className={`mr-sm-3 pb-2 multiple-status-filter ${selectedStatus ? '' : ' is-invalid'}`}>
                        <Label htmlFor="status" className="mr-sm-2">Status</Label>
                        <MultipleSelect
                            id="status"
                            dataSource={statusList || []}
                            keyField="key"
                            valueField="name"
                            statusField="checked"
                            maxDisplayItemCount={1}
                            hasInputOption={true}
                            noneSelectedLabel="Please Select"
                            selectedAllLabel="All"
                            onChange={handleChangeStatus} />
                    </FormGroup>

                    <div className="button-group">
                        <Button
                            outline
                            color="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={handleSearch}
                            disabled={!selectedStatus}
                        >
                            <span className="oi oi-magnifying-glass"></span> Search
                        </Button>

                        <Button
                            color="success"
                            type="button"
                            className="mb-2"
                            onClick={handleAddNew}
                        >
                            <span className="oi oi-plus"></span> Add New
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default FilterForm;
