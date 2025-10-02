import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SubMenu from './SubMenu';
import FilterForm from './FilterForm';
import TableGrid from './TableGrid';
import ComponentFormPopup from './ComponentFormPopup';
import DealFormPopup from './DealFormPopup';

import AppLayout from '@/layouts/AppLayout';
import Loader from '@/components/Loader';
import { ActionCreators } from '../actions';

const AppContainer = () => {
    const [isShowLoader, selectedComponentType, componentTypesList] = useSelector(state => [
        state.isShowLoader,
        state.selectedComponentType,
        state.componentTypesList
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

    const getCurrentComponentType = () => {
        if (!componentTypesList || componentTypesList.length === 0) {
            return { name: 'Component', id: null };
        }
        return componentTypesList.find(ct => ct.id == selectedComponentType) || componentTypesList[0];
    };

    const currentComponentType = getCurrentComponentType();
    const isDealType = currentComponentType.name === 'Deal';

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
            {isDealType ? <DealFormPopup /> : <ComponentFormPopup />}
        </AppLayout>
    );
}

export default AppContainer;
