import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';

const FilterForm = () => {
    const {
        setSelectedStatus,
        setSearchComponent,
        setParam,
        openComponentPopup
    } = ActionCreators;

    const [
        selectedComponentType,
        selectedStatus,
        searchComponent,
        isShowLoader,
        componentTypesList,
        statusList
    ] = useSelector(state => [
        state.selectedComponentType,
        state.selectedStatus,
        state.searchComponent,
        state.isShowLoader,
        state.componentTypesList,
        state.statusList]);

    const dispatch = useDispatch();

    const getCurrentComponentType = () => {
        if (!componentTypesList || componentTypesList.length === 0) {
            return { name: 'Component', id: null };
        }
        return componentTypesList.find(ct => ct.id === selectedComponentType) || componentTypesList[0];
    };

    const handleChangeStatus = (event) => {
        const selectedStatusValue = event.target.value;
        dispatch(setSelectedStatus(selectedStatusValue));
    };

    const handleChangeSearch = (event) => {
        dispatch(setSearchComponent(event.target.value));
    };

    const handleSearch = () => {
        const params = {
            ComponentTypeId: selectedComponentType,
            StatusIds: selectedStatus,
            ComponentName: searchComponent,
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

    return (
        <div className="component-management-content">
            <div className="content-header">
                <h2>{currentComponentType.name} Management</h2>
            </div>

            <div className="filter-container my-2 pb-0">
                <Form inline tag="div">
                    <FormGroup className="mr-sm-2 pb-2">
                        <Label htmlFor="componentSearch" className="mr-sm-2">
                            {currentComponentType.name}
                        </Label>
                        <Input
                            type="text"
                            name="componentSearch"
                            id="componentSearch"
                            value={searchComponent}
                            onChange={handleChangeSearch}
                            placeholder={'Search name/code'}
                            className="wide-input"
                        />
                    </FormGroup>

                    <FormGroup className="mr-sm-3 pb-2 single-status-filter">
                        <Label htmlFor="status" className="mr-sm-2">Status</Label>
                        <Input
                            type="select"
                            name="status"
                            id="status"
                            value={selectedStatus !== undefined && selectedStatus !== null ? selectedStatus : ''}
                            onChange={handleChangeStatus}
                            className="status-select-input"
                        >
                            <option value="">All</option>
                            {statusList && statusList.length > 0 ? statusList.map(statusOption => {
                                // Skip the "All" option since we have it hardcoded above
                                if (statusOption.key === '' || statusOption.name === 'All') return null;
                                return (
                                    <option
                                        key={statusOption.key}
                                        value={statusOption.key}
                                    >
                                        {statusOption.name}
                                    </option>
                                );
                            }) : (
                                <option value="" disabled>Loading...</option>
                            )}
                        </Input>
                    </FormGroup>

                    <div className="button-group">
                        <Button
                            outline
                            color="primary"
                            type="button"
                            className="mb-2 mr-2"
                            onClick={handleSearch}
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
