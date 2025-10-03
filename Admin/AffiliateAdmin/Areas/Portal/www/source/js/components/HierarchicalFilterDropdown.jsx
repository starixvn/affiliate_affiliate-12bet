import React, { useState, useCallback, useMemo } from 'react';
import { DropdownItem } from 'reactstrap';
import SearchableDropdown from './SearchableDropdown';

const HierarchicalFilterDropdown = ({
    // Basic props (inherited from SearchableDropdown)
    value = [],
    onSelectionChange,
    placeholder = 'Select filters...',
    searchPlaceholder = 'Search filters...',
    className = '',
    error,
    isDisabled = false,
    maxHeight = 400,
    
    // Hierarchical specific props
    data = { groups: [] },
    showSelectAll = true,
    groupKeyField = 'id',
    groupLabelField = 'label',
    itemKeyField = 'id',
    itemLabelField = 'label',
    
    // Collapse/Expand functionality
    defaultExpanded = true,
    allowGroupCollapse = true,
    
    // Styling props
    groupIndent = 0,
    itemIndent = 20,
    
    // Display customization
    allLabel = 'All',
    showGroupCounts = true,
    
    // Selection defaults
    defaultSelectAll = false,
    
    // Other SearchableDropdown props
    ...otherProps
}) => {
    const selectedItems = Array.isArray(value) ? value : [];
    
    const [expandedGroups, setExpandedGroups] = useState(() => {
        if (!allowGroupCollapse) return {};
        
        const initialState = {};
        data.groups.forEach(group => {
            initialState[group[groupKeyField]] = defaultExpanded;
        });
        return initialState;
    });
    
    const allItemIds = useMemo(() => {
        return data.groups.flatMap(group => 
            group.items?.map(item => item[itemKeyField]) || []
        );
    }, [data, itemKeyField]);
    
    React.useEffect(() => {
        if (
            defaultSelectAll && 
            selectedItems.length === 0 && 
            allItemIds.length > 0 &&
            onSelectionChange
        ) {
            onSelectionChange([...allItemIds]);
        }
    }, []);
    
    // Calculate selection states
    const selectionStates = useMemo(() => {
        const states = {
            all: { checked: false, indeterminate: false },
            groups: {},
            items: {}
        };
        
        // Calculate item states
        allItemIds.forEach(itemId => {
            states.items[itemId] = selectedItems.includes(itemId);
        });
        
        // Calculate group states
        data.groups.forEach(group => {
            const groupItems = group.items || [];
            const selectedInGroup = groupItems.filter(item => 
                selectedItems.includes(item[itemKeyField])
            );
            
            if (selectedInGroup.length === 0) {
                states.groups[group[groupKeyField]] = { checked: false, indeterminate: false };
            } else if (selectedInGroup.length === groupItems.length) {
                states.groups[group[groupKeyField]] = { checked: true, indeterminate: false };
            } else {
                states.groups[group[groupKeyField]] = { checked: false, indeterminate: true };
            }
        });
        
        // Calculate "All" state
        if (selectedItems.length === 0) {
            states.all = { checked: false, indeterminate: false };
        } else if (selectedItems.length === allItemIds.length) {
            states.all = { checked: true, indeterminate: false };
        } else {
            states.all = { checked: false, indeterminate: true };
        }
        
        return states;
    }, [selectedItems, allItemIds, data, groupKeyField, itemKeyField]);
    
    const handleAllSelect = useCallback(() => {
        onSelectionChange && onSelectionChange(selectionStates.all.checked ? [] : [...allItemIds]);
    }, [selectionStates.all.checked, allItemIds, onSelectionChange]);
    
    const handleGroupSelect = useCallback((group) => {
        const groupItems = group.items || [];
        const groupItemIds = groupItems.map(item => item[itemKeyField]);
        const groupState = selectionStates.groups[group[groupKeyField]];
        
        let newSelection;
        if (groupState.checked) {
            newSelection = selectedItems.filter(id => !groupItemIds.includes(id));
        } else {
            newSelection = [...new Set([...selectedItems, ...groupItemIds])];
        }
        
        onSelectionChange && onSelectionChange(newSelection);
    }, [selectedItems, selectionStates.groups, groupKeyField, groupLabelField, itemKeyField, onSelectionChange]);
    
    const handleItemSelect = useCallback((item) => {
        const itemId = item[itemKeyField];
        const isSelected = selectedItems.includes(itemId);
        
        let newSelection;
        if (isSelected) {
            newSelection = selectedItems.filter(id => id !== itemId);
        } else {
            newSelection = [...selectedItems, itemId];
        }

        onSelectionChange && onSelectionChange(newSelection);
    }, [selectedItems, itemKeyField, itemLabelField, onSelectionChange]);
    
    const handleToggleGroup = useCallback((groupId, event) => {
        event.stopPropagation();
        
        if (!allowGroupCollapse) return;
        
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    }, [allowGroupCollapse]);
    
    const filterHierarchicalItems = useCallback((groups, searchTerm ) => {
        if (!searchTerm) return groups;
        
        const filtered = groups.map(group => {
            const groupMatches = group[groupLabelField].toLowerCase().includes(searchTerm.toLowerCase());
            const filteredItems = (group.items || []).filter(item =>
                item[itemLabelField].toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (groupMatches || filteredItems.length > 0) {
                return {
                    ...group,
                    items: groupMatches ? group.items : filteredItems
                };
            }
            return null;
        }).filter(Boolean);
        
        return filtered;
    }, [groupLabelField, itemLabelField]);
    
    const renderDisplayValue = useCallback((selectedValue, allItems) => {
        const selectedCount = selectedItems.length;
        const totalCount = allItemIds.length;
        
        if (selectedCount === 0) {
            return placeholder;
        } else if (selectedCount === totalCount) {
            return `${allLabel} (${totalCount})`;
        } else if (selectedCount === 1) {
            const singleItem = data.groups
                .flatMap(group => group.items || [])
                .find(item => selectedItems.includes(item[itemKeyField]));
            return singleItem ? singleItem[itemLabelField] : `${selectedCount} selected`;
        } else {
            return `${selectedCount} of ${totalCount} selected`;
        }
    }, [selectedItems, allItemIds, placeholder, allLabel, data, itemKeyField, itemLabelField]);
    
    const renderHierarchicalItem = useCallback((item, isSelected, onToggle, key) => {
        if (item._type === 'all') {
            const state = selectionStates.all;
            return (
                <DropdownItem
                    key="select-all"
                    tag="div"
                    onClick={handleAllSelect}
                    toggle={false}
                    className="d-flex align-items-center hierarchical-all-item"
                    style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '0.5rem',
                        fontWeight: 'bold'
                    }}
                >
                    <input
                        type="checkbox"
                        checked={state.checked}
                        ref={checkbox => {
                            if (checkbox) checkbox.indeterminate = state.indeterminate;
                        }}
                        onChange={handleAllSelect}
                        onClick={(e) => e.stopPropagation()}
                        className="mx-1"
                    />
                    <span>{allLabel}</span>
                    {showGroupCounts && (
                        <span className="ms-auto text-muted">
                            ({selectedItems.length}/{allItemIds.length})
                        </span>
                    )}
                </DropdownItem>
            );
        }
        
        if (item._type === 'group') {
            const group = item._group;
            const state = selectionStates.groups[group[groupKeyField]];
            const groupItemCount = group.items?.length || 0;
            const selectedInGroup = (group.items || []).filter(groupItem => 
                selectedItems.includes(groupItem[itemKeyField])
            ).length;
            
            const groupId = group[groupKeyField];
            const isExpanded = allowGroupCollapse ? expandedGroups[groupId] : true;
            
            return (
                <DropdownItem
                    key={`group-${groupId}`}
                    tag="div"
                    toggle={false}
                    className="d-flex align-items-center hierarchical-group-item"
                    style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '0.5rem',
                        fontWeight: '500'
                    }}
                    onClick={() => handleGroupSelect(group)}
                >
                    {allowGroupCollapse && (
                        <div style={{ minWidth: '20px', textAlign: 'center' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleGroup(groupId, e);
                            }}
                        >
                            <span 
                                className={`caret ${isExpanded ? 'expand current' : 'collapsed'}`}
                                style={{ 
                                    cursor: 'pointer',
                                    display: 'inline-block',
                                    marginLeft: `${groupIndent}px`
                                }}
                            />
                        </div>
                    )}  
                    
                    <input
                        type="checkbox"
                        checked={state.checked}
                        ref={checkbox => {
                            if (checkbox) checkbox.indeterminate = state.indeterminate;
                        }}
                        onChange={() => handleGroupSelect(group)}
                        onClick={(e) => e.stopPropagation()}
                        className="mx-1"
                        style={{ 
                            cursor: 'pointer',
                            marginLeft: allowGroupCollapse ? '0px' : `${groupIndent}px`
                        }}
                    />
                    
                    <span 
                        style={{ cursor: 'pointer', flex: 1 }}
                    >
                        {group[groupLabelField]}
                    </span>
                    
                    {showGroupCounts && (
                        <span className="ms-auto text-muted">
                            ({selectedInGroup}/{groupItemCount})
                        </span>
                    )}
                </DropdownItem>
            );
        }
        
        if (item._type === 'item') {
            const actualItem = item._item;
            const itemSelected = selectedItems.includes(actualItem[itemKeyField]);
            
            return (
                <DropdownItem
                    key={`item-${actualItem[itemKeyField]}`}
                    tag="div"
                    onClick={() => handleItemSelect(actualItem)}
                    toggle={false}
                    className="d-flex align-items-center hierarchical-item"
                    style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        border: 'none',
                        padding: '0.375rem 1rem 0.375rem 3rem'
                    }}
                >
                    <input
                        type="checkbox"
                        checked={itemSelected}
                        onChange={() => handleItemSelect(actualItem)}
                        onClick={(e) => e.stopPropagation()}
                        className="mx-1"
                        style={{ marginLeft: `${itemIndent}px` }}
                    />
                    <span className="text-truncate" title={actualItem[itemLabelField]}>
                        {actualItem[itemLabelField]}
                    </span>
                </DropdownItem>
            );
        }
        
        return null;
    }, [
        selectionStates, 
        handleAllSelect, 
        handleGroupSelect, 
        handleItemSelect,
        handleToggleGroup,
        selectedItems,
        allItemIds,
        allLabel,
        showGroupCounts,
        groupIndent,
        itemIndent,
        groupKeyField,
        groupLabelField,
        itemKeyField,
        itemLabelField,
        allowGroupCollapse,
        expandedGroups
    ]);
    
    const flattenedItems = useMemo(() => {
        const items = [];
        
        if (showSelectAll) {
            items.push({ _type: 'all', id: 'select-all', name: allLabel });
        }
        
        data.groups.forEach(group => {
            const groupId = group[groupKeyField];
            
            items.push({
                _type: 'group',
                _group: group,
                id: `group-${groupId}`,
                name: group[groupLabelField]
            });
            
            const isExpanded = allowGroupCollapse ? expandedGroups[groupId] : true;
            if (isExpanded) {
                (group.items || []).forEach(item => {
                    items.push({
                        _type: 'item',
                        _item: item,
                        id: `item-${item[itemKeyField]}`,
                        name: item[itemLabelField]
                    });
                });
            }
        });
        
        return items;
    }, [data, showSelectAll, allLabel, groupKeyField, groupLabelField, itemKeyField, itemLabelField, allowGroupCollapse, expandedGroups]);
    
    const customFilterItems = useCallback((items, searchTerm) => {
        if (!searchTerm) return items;
        
        const filteredGroups = filterHierarchicalItems(data.groups, searchTerm);
        const result = [];
        
        if (showSelectAll && allLabel.toLowerCase().includes(searchTerm.toLowerCase())) {
            result.push(items.find(item => item._type === 'all'));
        }
        
        filteredGroups.forEach(group => {
            const groupId = group[groupKeyField];
            const groupMatches = group[groupLabelField].toLowerCase().includes(searchTerm.toLowerCase());
            const isExpanded = allowGroupCollapse ? expandedGroups[groupId] : true;
            
            result.push(items.find(item => 
                item._type === 'group' && item._group[groupKeyField] === groupId
            ));
            
            if (groupMatches) {
                (group.items || []).forEach(item => {
                    result.push(items.find(flatItem => 
                        flatItem._type === 'item' && flatItem._item[itemKeyField] === item[itemKeyField]
                    ) || {
                        _type: 'item',
                        _item: item,
                        id: `item-${item[itemKeyField]}`,
                        name: item[itemLabelField]
                    });
                });
            } else if (isExpanded) {
                (group.items || []).forEach(item => {
                    if (item[itemLabelField].toLowerCase().includes(searchTerm.toLowerCase())) {
                        result.push(items.find(flatItem => 
                            flatItem._type === 'item' && flatItem._item[itemKeyField] === item[itemKeyField]
                        ) || {
                            _type: 'item',
                            _item: item,
                            id: `item-${item[itemKeyField]}`,
                            name: item[itemLabelField]
                        });
                    }
                });
            }
        });
        
        return result.filter(Boolean);
    }, [filterHierarchicalItems, data.groups, showSelectAll, allLabel, groupKeyField, groupLabelField, itemKeyField, itemLabelField, allowGroupCollapse, expandedGroups]);
    
    return (
        <div className={`hierarchical-filter-dropdown ${className}`}>
            <style>
                {`
                .hierarchical-filter-dropdown .caret {
                    display: inline-block;
                    width: 0;
                    height: 0;
                    border-width: 4px;
                    transition: transform 0.2s ease;
                }
                
                .hierarchical-filter-dropdown .caret.collapsed {
                    border-top: 4px solid transparent;
                    border-bottom: 4px solid transparent;
                    border-left: 6px solid #6c757d;
                    border-right: none;
                }
                
                .hierarchical-filter-dropdown .caret.expand.current {
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-top: 6px solid #6c757d;
                    border-bottom: none;
                }
                
                .hierarchical-filter-dropdown .caret:hover {
                    opacity: 0.8;
                    transform: scale(1.1);
                }
                
                .hierarchical-all-item {
                    background-color: #f8f9fa !important;
                    border-bottom: 1px solid #dee2e6 !important;
                }
                .hierarchical-all-item:hover {
                    background-color: #e9ecef !important;
                }
                .hierarchical-group-item {
                    background-color: #fafafa !important;
                    border-bottom: 1px solid #eee !important;
                }
                .hierarchical-group-item:hover {
                    background-color: #f0f0f0 !important;
                }
                .hierarchical-item:hover {
                    background-color: #f8f9fa !important;
                }
                `}
            </style>
            
            <SearchableDropdown
                value={[]}
                placeholder={placeholder}
                searchPlaceholder={searchPlaceholder}
                className={className}
                error={error || !selectedItems.length}
                isDisabled={isDisabled}
                maxHeight={maxHeight}
                multiSelect={true}
                closeOnSelect={false}
                items={flattenedItems}
                getItemKey={(item) => item.id}
                getItemLabel={(item) => item.name}
                renderDisplayValue={() => renderDisplayValue(selectedItems, flattenedItems)}
                renderItem={renderHierarchicalItem}
                filterItems={customFilterItems}
                showSelectAll={false}
                {...otherProps}
            />
        </div>
    );
};

export default HierarchicalFilterDropdown;
