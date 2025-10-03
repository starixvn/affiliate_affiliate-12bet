import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const SearchableDropdown = ({
    // Basic props
    value,
    error,
    isDisabled = false,
    placeholder = 'Please select...',
    searchPlaceholder = 'Search...',
    className = '',
    dropdownClassName = '',
    
    // Data and rendering
    items = [],
    getItemKey = (item) => item.id,
    getItemLabel = (item) => item.name,
    renderDisplayValue,
    renderItem,
    
    // Selection behavior
    multiSelect = false,
    onSelectionChange,
    
    // Optional features
    showSelectAll = false,
    onSelectAll, // External select all handler
    showAddNew = false,
    onAddNew,
    addNewLabel = 'Add New...',
    addNewIcon = 'fa fa-plus',
    
    // Search and filtering
    filterItems,
    searchable = true,
    
    // Styling
    toggleStyle = {},
    menuStyle = {},
    maxHeight = 300,
    
    // Advanced props
    closeOnSelect = true,
    children
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropDirection, setDropDirection] = useState('down');
    const dropdownRef = useRef(null);

    // Dropdown positioning logic
    const calculateDropDirection = useCallback(() => {
        if (dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            if (spaceBelow < maxHeight && spaceAbove > spaceBelow) {
                setDropDirection('up');
            } else {
                setDropDirection('down');
            }
        }
    }, [maxHeight]);

    const toggle = useCallback(() => {
        if (!isDisabled) {
            if (!isOpen) {
                calculateDropDirection();
            }
            setIsOpen(prevState => !prevState);
        }
    }, [isDisabled, isOpen, calculateDropDirection]);

    // Handle window resize and scroll
    useEffect(() => {
        const handleResize = () => {
            if (isOpen) {
                calculateDropDirection();
            }
        };

        if (isOpen) {
            window.addEventListener('resize', handleResize);
            window.addEventListener('scroll', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                window.removeEventListener('scroll', handleResize);
            };
        }
    }, [isOpen, calculateDropDirection]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    // Filter items based on search term
    const filteredItems = filterItems 
        ? filterItems(items, searchTerm)
        : items.filter(item => {
            const label = getItemLabel(item);
            return label && label.toLowerCase().includes(searchTerm.toLowerCase());
        });

    // Handle item selection
    const handleItemSelect = useCallback((item, isSelected) => {
        if (multiSelect) {
            const currentValue = Array.isArray(value) ? value : [];
            const itemKey = getItemKey(item);
            
            let newValue;
            if (isSelected) {
                newValue = currentValue.filter(key => key !== itemKey);
            } else {
                newValue = [...currentValue, itemKey];
            }
            
            onSelectionChange && onSelectionChange(newValue);
        } else {
            const itemKey = getItemKey(item);
            onSelectionChange && onSelectionChange(itemKey);
            
            if (closeOnSelect) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }
    }, [multiSelect, value, getItemKey, onSelectionChange, closeOnSelect]);

    // Handle select all
    const handleSelectAll = useCallback(() => {
        if (!multiSelect || !showSelectAll) return;
        
        // If external onSelectAll is provided, use it instead of internal logic
        if (onSelectAll) {
            onSelectAll();
            return;
        }
        
        // Fallback to internal select all logic
        const currentValue = Array.isArray(value) ? value : [];
        const allItemKeys = filteredItems.map(getItemKey);
        const allSelected = allItemKeys.every(key => currentValue.includes(key));
        
        let newValue;
        if (allSelected) {
            // Deselect all filtered items
            newValue = currentValue.filter(key => !allItemKeys.includes(key));
        } else {
            // Select all filtered items
            newValue = [...new Set([...currentValue, ...allItemKeys])];
        }
        
        onSelectionChange && onSelectionChange(newValue);
    }, [multiSelect, showSelectAll, onSelectAll, value, filteredItems, getItemKey, onSelectionChange]);

    // Handle add new
    const handleAddNew = useCallback(() => {
        setIsOpen(false);
        onAddNew && onAddNew();
    }, [onAddNew]);

    // Get display value
    const getDisplayValue = () => {
        if (renderDisplayValue) {
            return renderDisplayValue(value, items);
        }
        
        if (multiSelect) {
            const selectedCount = Array.isArray(value) ? value.length : 0;

            if (selectedCount == 1) {
                const selectedItem = items.find(item => getItemKey(item) === value);
                return selectedItem ? getItemLabel(selectedItem) : placeholder;
            }

            return selectedCount > 0 ? `${selectedCount} selected` : placeholder;
        } else {
            if (!value) return placeholder;
            const selectedItem = items.find(item => getItemKey(item) === value);
            return selectedItem ? getItemLabel(selectedItem) : placeholder;
        }
    };

    // Check if item is selected
    const isItemSelected = (item) => {
        const itemKey = getItemKey(item);
        if (multiSelect) {
            return Array.isArray(value) && value.includes(itemKey);
        } else {
            return value === itemKey;
        }
    };

    // Check if all filtered items are selected (for select all)
    const allFilteredSelected = showSelectAll && filteredItems.length > 0 && 
        filteredItems.every(item => isItemSelected(item));

    return (
        <div className={`searchable-dropdown ${className}`} ref={dropdownRef}>
            <style>
                {`
                .dropdown-menu-up {
                    bottom: 100% !important;
                    top: auto !important;
                    transform: translateY(-2px) !important;
                    margin-bottom: 2px !important;
                }
                .dropdown-toggle-visible-text {
                    color: #495057 !important;
                    text-decoration: none !important;
                }
                .dropdown-toggle-visible-text:hover {
                    background-color: #f8f9fa !important;
                    color: #495057 !important;
                    text-decoration: none !important;
                }
                .dropdown-toggle-visible-text:focus {
                    background-color: #e9ecef !important;
                    color: #495057 !important;
                    text-decoration: none !important;
                    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25) !important;
                }
                .dropdown-toggle-visible-text.is-error {
                    color: #dc3545 !important;
                    border-color: #dc3545 !important;
                }
                .dropdown-item {
                    color: #495057 !important;
                    font-size: 13px !important;
                }
                .dropdown-item:hover {
                    background-color: #f8f9fa !important;
                    color: #495057 !important;
                }
                .dropdown-item.active {
                    background-color: #007bff !important;
                    color: white !important;
                }
                .dropdown-item.active:hover {
                    background-color: #0056b3 !important;
                    color: white !important;
                }
                .add-new-item {
                    background-color: #e3f2fd !important;
                    color: #1976d2 !important;
                    font-weight: 500 !important;
                    font-size: 13px !important;
                    border-top: 1px solid #dee2e6;
                }
                .add-new-item:hover {
                    background-color: #bbdefb !important;
                    color: #1976d2 !important;
                }
                .select-all-item {
                    background-color: #f8f9fa !important;
                    cursor: pointer !important;
                }
                .search-clear-btn:hover {
                    color: #495057 !important;
                    background-color: #f8f9fa !important;
                    border-radius: 50% !important;
                }
                .search-clear-btn:focus {
                    outline: none !important;
                    box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25) !important;
                    border-radius: 50% !important;
                }
                `}
            </style>
            
            <Dropdown 
                isOpen={isOpen} 
                toggle={toggle} 
                className="w-100"
            >
                <DropdownToggle
                    className={`form-control text-truncate text-left multiple-select-label dropdown-toggle-visible-text ${error ? 'is-error' : ''} ${dropdownClassName}`}
                    style={{ 
                        backgroundColor: 'white',
                        border: '1px solid #ced4da',
                        minWidth: '135px',
                        ...toggleStyle
                    }}
                    disabled={isDisabled}
                    title={getDisplayValue()}
                >
                    {getDisplayValue()}
                    <b class="caret"></b>
                </DropdownToggle>
                
                <DropdownMenu 
                    className={`w-100 ${dropDirection === 'up' ? 'dropdown-menu-up' : ''}`}
                    style={{ 
                        maxHeight: `${maxHeight}px`, 
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        zIndex: 1050,
                        position: 'absolute',
                        width: '100%',
                        minWidth: '280px',
                        ...menuStyle
                    }}
                    flip={false}
                    right={dropDirection === 'up'}
                >
                    {/* Search Input */}
                    {searchable && (
                        <>
                            <DropdownItem header>
                                <div className="position-relative">
                                    <Input
                                        className="w-100 pr-4"
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            className="btn btn-sm position-absolute search-clear-btn"
                                            onClick={handleClearSearch}
                                            style={{
                                                right: '5px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                border: 'none',
                                                background: 'none',
                                                padding: '2px 4px',
                                                fontSize: '14px',
                                                color: '#6c757d',
                                                cursor: 'pointer',
                                                zIndex: 10
                                            }}
                                            title="Clear search"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </DropdownItem>
                            <DropdownItem divider />
                        </>
                    )}
                    
                    {/* Add New Option */}
                    {showAddNew && (
                        <DropdownItem
                            tag="button"
                            type="button"
                            onClick={handleAddNew}
                            className="add-new-item"
                        >
                            <i className={`${addNewIcon}`}></i>
                            {addNewLabel}
                        </DropdownItem>
                    )}
                    
                    {/* Select All Option */}
                    {showSelectAll && multiSelect && filteredItems.length > 0 && (
                        <>
                            <DropdownItem 
                                toggle={false}
                                onClick={handleSelectAll}
                                className="d-flex align-items-center select-all-item"
                            >
                                <Input
                                    type="checkbox"
                                    checked={allFilteredSelected}
                                    onChange={() => {}}
                                />
                                <strong>Select All ({filteredItems.length})</strong>
                            </DropdownItem>
                            <DropdownItem divider />
                        </>
                    )}
                    
                    {/* Items */}
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => {
                            const isSelected = isItemSelected(item);
                            const itemKey = getItemKey(item);
                            
                            if (renderItem) {
                                return renderItem(item, isSelected, (selected) => handleItemSelect(item, !selected), itemKey);
                            }
                            
                            return (
                                <DropdownItem
                                    key={itemKey}
                                    tag="div"
                                    onClick={() => handleItemSelect(item, isSelected)}
                                    active={!multiSelect && isSelected}
                                    toggle={multiSelect ? false : undefined}
                                    className={multiSelect ? "d-flex align-items-center" : ""}
                                    style={{
                                        overflow: 'hidden',
                                        maxWidth: '100%',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        padding: '0.375rem 1.5rem'
                                    }}
                                >
                                    {multiSelect && (
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            className="mr-2"
                                        />
                                    )}
                                    <span className="text-truncate" title={getItemLabel(item)}>
                                        {getItemLabel(item)}
                                    </span>
                                </DropdownItem>
                            );
                        })
                    ) : (
                        <DropdownItem disabled>
                            {searchTerm ? 'No items found' : 'No items available'}
                        </DropdownItem>
                    )}
                    
                    {/* Custom children content */}
                    {children}
                </DropdownMenu>
            </Dropdown>
        </div>
    );
};

export default SearchableDropdown;
