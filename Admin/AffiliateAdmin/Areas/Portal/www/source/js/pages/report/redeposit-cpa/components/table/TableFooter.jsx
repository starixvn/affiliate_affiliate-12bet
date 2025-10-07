import React from 'react';

import { totalText } from '../../libs/constants';
import { format, formatDecimal } from '../../../../../modules/numberFormat';

export const TableFooter = ({
    total,
    totalItem,
    isAdjustable
}) => {
    if (!totalItem) {
        return null;
    }

    const totalEligiblePlayers = format(total.TotalEligiblePlayers);
    const estimateAmount = formatDecimal(total.EstimateAmount);
    const approvedAmount = formatDecimal(total.ApprovedAmount);
    const adjustedAmount = formatDecimal(total.AdjustedAmount);
    const finalCpaAmount = formatDecimal(total.FinalCpaAmount);

    return (
        <tfoot>
            <tr className="total-row freeze-row">
                <td title={totalText} colSpan="6" className="text-right font-weight-bold freeze-column-footer">{totalText}</td>
                <td title={totalEligiblePlayers} className="text-center font-weight-bold freeze-column-footer">{totalEligiblePlayers}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td title={estimateAmount} className="text-right font-weight-bold freeze-column-footer">{estimateAmount}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td title={approvedAmount} className="text-right font-weight-bold freeze-column-footer">{approvedAmount}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td title={adjustedAmount} className="text-right font-weight-bold freeze-column-footer">{adjustedAmount}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                {isAdjustable && (
                    <td className="text-right font-weight-bold freeze-column-footer"></td>
                )}
                <td title={finalCpaAmount} className="text-right font-weight-bold freeze-column-footer">{finalCpaAmount}</td>
            </tr>
        </tfoot>
    )
}

export default TableFooter;