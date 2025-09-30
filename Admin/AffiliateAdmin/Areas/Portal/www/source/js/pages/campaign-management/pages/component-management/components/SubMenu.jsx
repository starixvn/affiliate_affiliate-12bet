import React from 'react';
import { batch, useSelector, useDispatch } from 'react-redux';
import { ActionCreators } from '../actions';
import { v4 as uuidv4 } from 'uuid';
import { setGridData } from '../actions/gridAction';

const SubMenu = () => {
    const dispatch = useDispatch();
    const [selectedComponentType, componentTypesList] = useSelector(state => [
        state.selectedComponentType,
        state.componentTypesList
    ]);

    const { setSelectedComponentType, setParam, setSelectedStatus, setSearchComponent } = ActionCreators;

    const handleComponentTypeClick = (componentType) => {
        if (selectedComponentType !== componentType.id) {
            batch(() => {
                dispatch(setSelectedComponentType(componentType.id));
                // Reset search and status when changing component type
                dispatch(setSelectedStatus('')); // Reset to "All"
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
