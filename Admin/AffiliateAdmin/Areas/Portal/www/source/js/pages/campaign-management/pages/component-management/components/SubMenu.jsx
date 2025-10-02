import React from 'react';
import { batch, useSelector, useDispatch } from 'react-redux';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';
import { setGridData } from '../actions/gridAction';

const SubMenu = () => {
    const dispatch = useDispatch();
    const [selectedComponentType, componentTypesList, statusList] = useSelector(state => [
        state.selectedComponentType,
        state.componentTypesList,
        state.statusList
    ]);

    const { setSelectedComponentType, setParam, setSelectedStatus, setSearchComponent, setStatusList } = ActionCreators;

    const handleComponentTypeClick = (componentType) => {
        if (selectedComponentType !== componentType.id) {
            const allStatusIds = statusList.map(s => s.key).join(',');
            const resetStatusList = statusList.map(status => ({ ...status, checked: true }));
            batch(() => {
                dispatch(setSelectedComponentType(componentType.id));
                // Reset search and status when changing component type
                // Set all statuses as selected for multiple selection
                dispatch(setSelectedStatus(allStatusIds)); // Reset to "All" (all statuses selected)
                dispatch(setStatusList(resetStatusList)); // Reset statusList with all checked
                dispatch(setSearchComponent(''));  // Clear search
                dispatch(setParam(null)); // Clear current data/filters
                dispatch(setGridData(null)); // Clear grid data
            });
        }
    };

    return (
        <div className="sub-menu-container">
            <div className="sub-menu-header">
                <h4>Components</h4>
            </div>
            <div className="sub-menu-list">
                {componentTypesList && componentTypesList.length > 0 ? (
                    componentTypesList.map(componentType => (
                        <div
                            key={componentType.id}
                            className={`sub-menu-item ${selectedComponentType === componentType.id ? 'active' : ''}`}
                            onClick={() => handleComponentTypeClick(componentType)}
                        >
                            <span className="sub-menu-item-text">{componentType.name}</span>
                        </div>
                    ))
                ) : (
                    <div className="sub-menu-item">
                        <span className="sub-menu-item-text">No components available</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubMenu;
