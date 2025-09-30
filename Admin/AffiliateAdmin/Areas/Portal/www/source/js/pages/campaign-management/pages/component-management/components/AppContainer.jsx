import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SubMenu from './SubMenu';
import FilterForm from './FilterForm';
import TableGrid from './TableGrid';
import ComponentFormPopup from './ComponentFormPopup';

import AppLayout from '@/layouts/AppLayout';
import Loader from '@/components/Loader';
import { ActionCreators } from '../actions';

const AppContainer = () => {
    const [isShowLoader, selectedComponentType] = useSelector(state => [
        state.isShowLoader,
        state.selectedComponentType
    ]);

    const dispatch = useDispatch();
    const { fetchSettings, setSelectedComponentType } = ActionCreators;

    useEffect(() => {
        // Initialize settings (component types and status list) on mount
        dispatch(fetchSettings());
    }, [dispatch, fetchSettings]);

    useEffect(() => {
        // Set default component type if none selected
        if (!selectedComponentType) {
            dispatch(setSelectedComponentType(1)); // Default to first component type (Event)
        }
    }, [selectedComponentType, dispatch, setSelectedComponentType]);

    return (
        <AppLayout>
            <Loader show={isShowLoader} />
            <div className="component-management">
                <div className="component-management-sidebar">
                    <SubMenu />
                </div>
                <div className="component-management-main">
                    <FilterForm />
                    <TableGrid />
                </div>
            </div>
            <ComponentFormPopup />
        </AppLayout>
    );
}

export default AppContainer;
