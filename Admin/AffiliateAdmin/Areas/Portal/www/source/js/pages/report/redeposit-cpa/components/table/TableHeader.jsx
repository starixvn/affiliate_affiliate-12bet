import React from 'react';

import { buildHeader } from '../../libs/service';
import { AggregateHeaderColumn, HeaderRow } from '../../libs/headerConfigs';

const RowHeader = ({ header, index, rowSpan }) => (
    <tr className={`freeze-row freeze-row-h${index}`} key={`thead-${index}`}>
        {Object.entries(header).map(([key, col]) => {
            const isAggregate = col instanceof AggregateHeaderColumn;

            return (
                <th
                    title={col.text}
                    key={`thead-col-${index}-${key}`}
                    width={col.width}
                    rowSpan={isAggregate ? 1 : rowSpan}
                    colSpan={isAggregate ? col.totalShowableCol : 1}
                >
                    {col.text}
                </th>
            );
        })}
    </tr>
);

export const TableHeader = ({ isAdjustable }) => {
    const headerRows = buildHeader(isAdjustable);
    if (!(headerRows instanceof HeaderRow)) return [];

    const mainHeader = AggregateHeaderColumn.convertColsToObject(headerRows.getHeaderCols(0));
    const subHeader = AggregateHeaderColumn.convertColsToObject(headerRows.getHeaderCols(1));

    return (
        <thead>
            {
                [
                    <RowHeader header={mainHeader} index={1} rowSpan={2} />,
                    <RowHeader header={subHeader} index={2} rowSpan={1} />
                ]
            }
        </thead>
    )
}

export default React.memo(TableHeader);