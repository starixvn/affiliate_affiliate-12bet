import { useState, useRef, useLayoutEffect } from 'react';
import { format } from '../../../../modules/numberFormat';

export const useFormattedNumberInput = (initialValue = '', options = {}) => {
    const {
        maxValue = Number.MAX_SAFE_INTEGER,
        minValue = 0,
        allowDecimal = true,
        decimalPlaces = 2,
        onValueChange = () => { }
    } = options;

    const [displayValue, setDisplayValue] = useState(initialValue);
    const [cursorPosition, setCursorPosition] = useState(null);
    const inputRef = useRef(null);

    // Restore cursor position after displayValue changes
    useLayoutEffect(() => {
        if (cursorPosition !== null && inputRef.current && typeof inputRef.current.setSelectionRange === 'function') {
            try {
                inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
            } catch (error) {
                console.warn('Could not set cursor position: ', error);
            }
            setCursorPosition(null);
        }
    }, [displayValue, cursorPosition]);

    const parseValue = (value) => value.replace(/,/g, '').trim();

    const isValidDecimalNumber = (inputValue) => {
        if (!allowDecimal) {
            return /^\d*$/.test(inputValue);
        }
        const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces}}$`);
        return regex.test(inputValue);
    };

    const calculateNewCursorPosition = (oldValue, newValue, oldCursorPosition) => {
        // If cursor is at the end of old string, place at the end of new string
        if (oldCursorPosition >= oldValue.length) {
            return newValue.length;
        }

        // Get the part of string before cursor position (excluding commas)
        const beforeCursor = oldValue.substring(0, oldCursorPosition);
        const beforeCursorWithoutCommas = beforeCursor.replace(/,/g, '');

        // Find position in new string corresponding to the number of digits entered
        let digitCount = 0;
        let newPosition = 0;

        for (let i = 0; i < newValue.length; i++) {
            if (/\d/.test(newValue[i])) {
                digitCount++;
                if (digitCount === beforeCursorWithoutCommas.length) {
                    newPosition = i + 1;
                    break;
                }
            }
        }

        // If there's a decimal point and old cursor is after the decimal point
        if (allowDecimal && oldValue.includes('.') && oldCursorPosition > oldValue.indexOf('.')) {
            const dotIndex = newValue.indexOf('.');
            if (dotIndex !== -1) {
                const decimalPartOld = oldValue.substring(oldValue.indexOf('.') + 1, oldCursorPosition);
                const decimalPartNew = newValue.substring(dotIndex + 1);

                // Place cursor after the entered decimal part
                if (decimalPartOld.length <= decimalPartNew.length) {
                    return dotIndex + 1 + decimalPartOld.length;
                }
            }
        }

        // If no suitable position found, place at the end
        if (newPosition === 0) {
            newPosition = newValue.length;
        }

        return Math.min(newPosition, newValue.length);
    };

    const handleChange = (e) => {
        const { value, selectionStart } = e.target;
        const parsedValue = parseValue(value);

        if (isValidDecimalNumber(parsedValue) && Number(parsedValue) >= minValue && Number(parsedValue) <= maxValue) {
            const hasDecimal = allowDecimal && value.includes('.');
            const [integerPart, decimalPart] = hasDecimal ? value.split('.') : [value, null];
            const numValue = Number(parseValue(integerPart));

            let formattedDisplayValue = format(numValue);
            if (hasDecimal) {
                formattedDisplayValue += decimalPart !== null ? `.${decimalPart}` : '.';
            }

            const newCursorPosition = calculateNewCursorPosition(value, formattedDisplayValue, selectionStart);

            setDisplayValue(formattedDisplayValue);
            setCursorPosition(newCursorPosition);

            // Call callback with numeric value
            onValueChange(Number(parsedValue));
        }
    };

    const setValue = (value) => {
        if (typeof value === 'number' && value >= minValue) {
            const formattedValue = format(value);
            setDisplayValue(formattedValue);
        } else if (typeof value === 'string') {
            setDisplayValue(value);
        }
    };

    return {
        displayValue,
        inputRef,
        handleChange,
        setValue
    };
};
