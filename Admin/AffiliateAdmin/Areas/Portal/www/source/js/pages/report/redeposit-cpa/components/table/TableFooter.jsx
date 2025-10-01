import React from 'react';

import { totalText } from '../../libs/constants';
import { format, formatDecimal } from '../../../../../modules/numberFormat';

export const TableFooter = ({
    total,
    totalItem
}) => {

    if (!totalItem) {
        return null;
    }

    const approvedCpaPlayer = format(total.ApprovedCpaPlayer);
    const totalSettledCpaAmount = formatDecimal(total.TotalSettledCpaAmount);

    return (
        <tfoot>
            <tr className="total-row freeze-row">
                <td title={totalText} colSpan="8" className="text-right font-weight-bold freeze-column-footer">{totalText}</td>
                <td title={approvedCpaPlayer} className="text-right font-weight-bold freeze-column-footer">{approvedCpaPlayer}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td title={totalSettledCpaAmount} className="text-right font-weight-bold freeze-column-footer">{totalSettledCpaAmount}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
            </tr>
        </tfoot>
    )
}

export default TableFooter;