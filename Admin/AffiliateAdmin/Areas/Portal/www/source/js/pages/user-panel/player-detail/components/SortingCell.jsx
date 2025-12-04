import React from 'react';
import { Button } from 'reactstrap';

export const SortingCell = (props) => {
    const { isSortAsc, sortingColumn, columnName, title, width } = props;
    const isSelectedColumn = sortingColumn === columnName;

    return (
        <th width={width} className="th">
            <Button className="p-0 th-wrapper btn btn-link" color="link" onClick={() => props.handleClickHeader(columnName)}>
                <span>{title}</span>
                <div className="icon-container">
                    <span className={`caret asc ${isSelectedColumn && isSortAsc ? "current" : ''}`}></span>
                    <span className={`caret desc ${isSelectedColumn && !isSortAsc ? "current" : ''}`}></span>
                </div>
            </Button>
        </th>
    )
}

export default React.memo(SortingCell);