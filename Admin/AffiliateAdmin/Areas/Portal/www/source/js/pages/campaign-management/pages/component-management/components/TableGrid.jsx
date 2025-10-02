import React, { useEffect, useState, useMemo } from 'react';
import { batch, useSelector, useDispatch } from 'react-redux';
import { ActionCreators } from '../actions';
import { Table, Row, Cell } from '@9softstudio/react-fixed-table-header';
import { globalResource } from '@/modules/globalResource';
import ReportTitle from '@/components/ReportTitle';
import { headerText, confirmPopupContent } from '../constants/settings';
import StatusDropdown from './StatusDropdown';
import { showConfirmToast } from '@/pages/common/components/Toast';
import { v4 as uuidv4 } from 'uuid';

const TableGrid = () => {
    const [
        gridData,
        param,
        shouldResetScrollPosition,
        selectedComponentType,
        componentTypesList,
        statusList
    ] = useSelector(state => [
        state.gridData,
        state.param,
        state.shouldResetScrollPosition,
        state.selectedComponentType,
        state.componentTypesList,
        state.statusList
    ]);

    const dispatch = useDispatch();
    const {
        fetchData,
        setParam,
        updateComponent,
        updateDeal,
        openComponentPopup,
        setShouldResetScrollPosition
    } = ActionCreators;

    const [tableMaxWidth, setTableMaxWidth] = useState(1800);

    // Compute current component type once globally
    const currentComponentType = useMemo(() => {
        if (!componentTypesList || componentTypesList.length === 0) {
            return { name: 'Component', id: null };
        }
        return componentTypesList.find(ct => ct.id == selectedComponentType) || componentTypesList[0];
    }, [componentTypesList, selectedComponentType]);

    const isDealType = useMemo(() => currentComponentType.name === 'Deal', [currentComponentType]);

    // Calculate table width based on container width minus sidebar width
    const calculateTableWidth = () => {
        const componentManagementElement = document.querySelector('.component-management');
        const sidebarElement = document.querySelector('.component-management-sidebar');

        if (!componentManagementElement || !sidebarElement) return 1800;

        const containerWidth = componentManagementElement.offsetWidth;

        // Get actual sidebar width from DOM element
        const sidebarWidth = sidebarElement.offsetWidth;

        // Account for padding and gaps (20px padding on main + potential borders/gaps)
        const padding = 20;

        const calculatedWidth = Math.max(600, containerWidth - sidebarWidth - padding);
        console.log('calculatedWidth', calculatedWidth);
        return calculatedWidth;
    };

    // Update table width on mount and window resize
    useEffect(() => {
        const updateTableWidth = () => {
            setTableMaxWidth(calculateTableWidth());
        };

        // Initial calculation
        updateTableWidth();

        // Add resize listener
        const handleResize = () => {
            updateTableWidth();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Only fetch data if param exists and has ComponentTypeId (indicating a valid selection)
        if (param && param.ComponentTypeId && param.RequestId) {
            dispatch(fetchData(param, isDealType));
        }
    }, [param, isDealType]);

    if (!gridData) {
        return <></>;
    }


    const handleEdit = (item) => {
        batch(() => {
            dispatch(setShouldResetScrollPosition(false));
            dispatch(openComponentPopup(false, item));
        });
    };

    const handleStatusChange = (item, newStatusId) => {
        showConfirmToast({
            title: confirmPopupContent.title,
            content: confirmPopupContent.content,
            onConfirm: () => handleConfirmStatusChange(item, newStatusId),
            onCancel: () => { },
            cancelText: "Cancel",
            submitText: "Yes"
        });
    };

    const handleConfirmStatusChange = (item, newStatusId) => {
        if (isDealType) {
            var updateParam = {
                dealName: item.DealName,
                dealId: item.DealId,
                statusId: newStatusId
            };

            dispatch(updateDeal(updateParam, () => {
                dispatch(setParam({ ...param, RequestId: uuidv4() }));
            }));
        } else {
            var updateParam = {
                componentCode: item.ComponentCode,
                componentName: item.ComponentName,
                componentId: item.ComponentId,
                componentTypeId: selectedComponentType,
                statusId: newStatusId
            };

            dispatch(updateComponent(updateParam, () => {
                dispatch(setParam({ ...param, RequestId: uuidv4() }));
            }));
        }

    };

    const _renderHeader = () => {
        const codeHeader = isDealType ? 'Deal Type' : headerText.Code;
        const nameHeader = isDealType ? 'Deal Name' : headerText.Name;

        return (
            <Row key="thead">
                <Cell header={true} colWidth={1} title={headerText.Index}>{headerText.Index}</Cell>
                <Cell header={true} colWidth={5} title={codeHeader}>{codeHeader}</Cell>
                <Cell header={true} colWidth={5} title={nameHeader}>{nameHeader}</Cell>
                <Cell header={true} colWidth={4} title={headerText.CreatedDate}>{headerText.CreatedDate}</Cell>
                <Cell header={true} colWidth={4} title={headerText.CreatedBy}>{headerText.CreatedBy}</Cell>
                <Cell header={true} colWidth={4} title={headerText.LastModifiedDate}>{headerText.LastModifiedDate}</Cell>
                <Cell header={true} colWidth={4} title={headerText.LastModifiedBy}>{headerText.LastModifiedBy}</Cell>
                <Cell header={true} colWidth={3} title={headerText.Status}>{headerText.Status}</Cell>
                {!isDealType && <Cell header={true} colWidth={2} title={headerText.Edit}>{headerText.Edit}</Cell>}
            </Row>
        );
    };

    const _renderDataSection = () => {
        const colSpan = isDealType ? "8" : "9";

        if (gridData && gridData.length > 0) {
            return gridData.map((item, index) => {
                const displayCode = isDealType ? item.GroupTypeName : (item.ComponentCode || '');
                const displayName = isDealType ? item.ComponentName : item.ComponentName;
                const displayLastModifiedDate = isDealType ? item.UpdatedDateText : item.LastModifiedDateText;
                const displayLastModifiedBy = isDealType ? item.UpdatedBy : item.LastModifiedBy;

                return (
                    <Row key={index}>
                        <Cell className="text-center" title={index + 1}>{index + 1}</Cell>
                        <Cell className="text-center" title={displayCode}>{displayCode}</Cell>
                        <Cell className="text-left" title={displayName}>{displayName}</Cell>
                        <Cell className="text-center" title={item.CreatedDateText}>{item.CreatedDateText}</Cell>
                        <Cell className="text-center" title={item.CreatedBy}>{item.CreatedBy}</Cell>
                        <Cell className="text-center" title={displayLastModifiedDate}>{displayLastModifiedDate}</Cell>
                        <Cell className="text-center" title={displayLastModifiedBy}>{displayLastModifiedBy}</Cell>
                        <Cell className="text-center" title={item.Status}>
                            <StatusDropdown
                                value={item.StatusId || '0'}
                                onChange={(newStatusId) => handleStatusChange(item, newStatusId)}
                            />
                        </Cell>
                        {!isDealType && (
                            <Cell className="text-center" title="Edit">
                                <span
                                    className="oi oi-pencil"
                                    style={{ cursor: 'pointer', color: '#007bff' }}
                                    onClick={() => handleEdit(item)}
                                ></span>
                            </Cell>
                        )}
                    </Row>
                );
            });
        }
        return <Row key="no-info">
            <Cell className="text-center" colSpan={colSpan}>{globalResource.NoInfo}</Cell>
        </Row>
    };

    const _getReportTitle = () => {
        let statusText = 'All Statuses';

        if (param.StatusIds && statusList && statusList.length > 0) {
            const selectedStatus = statusList.find(status => status.key.toString() === param.StatusIds.toString());
            statusText = selectedStatus ? `Status: ${selectedStatus.name}` : 'All Statuses';
        }

        let searchText = `All ${currentComponentType.name}s`;
        if (param.Search) {
            searchText = `${currentComponentType.name}: ${param.Search}`;
        }

        const reportTitle = `${currentComponentType.name.toUpperCase()} MANAGEMENT - ${searchText} - ${statusText}`;
        return reportTitle;
    };

    const _buildReportTitle = () => {
        const reportTitle = _getReportTitle();
        return (
            <div className="d-flex align-items-center">
                {reportTitle}
            </div>
        );
    };

    return (
        <>
            <ReportTitle content={_buildReportTitle()} />
            <Table
                key={param.RequestId}
                maxWidth={tableMaxWidth}
                autoWidth={true}
                bodyHeight={300}
                header={_renderHeader()}
                body={_renderDataSection()}
                containerPadding={20}
                isPaging={false}
                shouldResetScrollPosition={shouldResetScrollPosition}
            />
        </>
    );
};

export default TableGrid;
