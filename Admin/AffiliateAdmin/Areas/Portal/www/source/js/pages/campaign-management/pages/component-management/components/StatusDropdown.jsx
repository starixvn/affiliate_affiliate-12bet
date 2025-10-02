import React, { useState, useEffect, useRef } from 'react';
import { statusOptions } from '../constants/settings';

const StatusDropdown = ({
    value = '0',
    onChange,
    disabled = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [positionKey, setPositionKey] = useState(0);
    const dropdownRef = useRef(null);

    const getStatusClassName = (statusId) => {
        const status = statusOptions.find(opt => opt.value === statusId?.toString());
        return `status-select ${status?.className || 'status-select--inactive'}`;
    };

    const getCurrentStatus = () => {
        return statusOptions.find(opt => opt.value === value?.toString()) || statusOptions[0];
    };

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsOpen(prev => {
                if (!prev) {
                    // Reset position key when opening
                    setPositionKey(0);
                }
                return !prev;
            });
        }
    };

    const handleOptionClick = (optionValue) => {
        if (!disabled && optionValue !== value?.toString()) {
            onChange && onChange(optionValue);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) {
                // Force re-render to update dropdown position
                setPositionKey(prev => prev + 1);
            }
        };

        document.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const currentStatus = getCurrentStatus();

    const getDropdownPosition = () => {
        if (!dropdownRef.current) return { top: 0, left: 0 };

        const buttonRect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isInBottomThird = buttonRect.top > (viewportHeight * 2) / 3;

        const estimatedDropdownHeight = statusOptions.length * 38 + 16; // Approximate height

        let top;
        if (isInBottomThird) {
            // Show above the button
            top = buttonRect.top - estimatedDropdownHeight - 4;
            // Ensure dropdown doesn't go off the top of the screen
            if (top < 10) {
                top = 10;
            }
        } else {
            // Show below the button (normal)
            top = buttonRect.bottom + 4;
        }

        return {
            top: top,
            left: buttonRect.left,
            width: Math.max(120, buttonRect.width)
        };
    };

    return (
        <div className={`status-dropdown ${className}`} ref={dropdownRef}>
            <button
                type="button"
                className={getStatusClassName(value)}
                onClick={toggleDropdown}
                disabled={disabled}
            >
                <span className="status-select__text">{currentStatus.label}</span>
                <span className="oi oi-caret-bottom status-select__icon"></span>
            </button>

            {isOpen && (
                <div
                    className="status-menu"
                    style={getDropdownPosition()}
                    key={positionKey}
                >
                    {statusOptions.map(option => {
                        const isSelected = option.value === value?.toString();
                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={`status-menu__item status-menu__item--${option.type} ${isSelected ? 'status-menu__item--disabled' : ''}`}
                                onClick={() => handleOptionClick(option.value)}
                                disabled={isSelected}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StatusDropdown;
