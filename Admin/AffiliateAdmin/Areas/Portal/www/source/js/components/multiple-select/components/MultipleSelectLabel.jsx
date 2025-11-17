import React from 'react';
import PropTypes from 'prop-types';

const NONE_SELECT_LABEL = "None Select";
const MAX_SELECTED_ITEM_FOR_DISPLAY = 3;

function getSelectedItemsString(props) {
    const { selectedItems, noneSelectedLabel, maxDisplayItemCount, isSelectedAll, selectedAllLabel } = props;
    const selectedValues = selectedItems.map(item => item.value);

    const selectedItemCount = selectedValues.length;

    if (isSelectedAll) {
        if (selectedItemCount == 1) {
            return selectedValues[0];
        }

        return selectedAllLabel || "All";
    }

    if (selectedItemCount > maxDisplayItemCount) {
        return `${selectedItemCount} selected`;
    }

    if (selectedItemCount >= 1) {
        return selectedValues.join(", ");
    }

    return noneSelectedLabel;
}

const MultipleSelectLabel = (props) => {
    const selectedItemString = getSelectedItemsString(props);

    return (
        <button id={`${props.id}`} type="button" className="multiple-select-default multiple-select-label"
            onClick={props.onToggle}>
            <span className="text-display" title={selectedItemString}>{selectedItemString}</span>
            <b className="caret"></b>
        </button>
    )
}

MultipleSelectLabel.propTypes = {
    selectedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    noneSelectedLabel: PropTypes.string,
    isSelectedAll: PropTypes.bool,
    selectedAllLabel: PropTypes.string,
    maxDisplayItemCount: PropTypes.number
}

MultipleSelectLabel.defaultProps = {
    isSelectedAll: false,
    selectedAllLabel: '',
    noneSelectedLabel: NONE_SELECT_LABEL,
    maxDisplayItemCount: MAX_SELECTED_ITEM_FOR_DISPLAY
}

export default MultipleSelectLabel;