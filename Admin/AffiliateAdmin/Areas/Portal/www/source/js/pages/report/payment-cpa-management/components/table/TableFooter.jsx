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
    const manuallyApprovedAmount = formatDecimal(total.ManuallyApprovedAmount);
    const adjustedAmount = formatDecimal(total.AdjustedAmount);
    const finalCpaAmount = formatDecimal(total.FinalCpaAmount);

    return (
        <tfoot>
            <tr className="total-row freeze-row">
                <td title={totalText} colSpan="3" className="text-right font-weight-bold freeze-column-footer">{totalText}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td title={totalEligiblePlayers} className="text-center font-weight-bold">{totalEligiblePlayers}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td title={estimateAmount} className="text-right font-weight-bold">{estimateAmount}</td>
                <td className="text-right font-weight-bold"></td>
                <td title={approvedAmount} className="text-right font-weight-bold">{approvedAmount}</td>
                <td className="text-right font-weight-bold"></td>
                <td title={manuallyApprovedAmount} className="text-right font-weight-bold">{manuallyApprovedAmount}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                {isAdjustable && (
                    <td className="text-right font-weight-bold"></td>
                )}
                <td title={adjustedAmount} className="text-right font-weight-bold">{adjustedAmount}</td>
                <td title={finalCpaAmount} className="text-right font-weight-bold">{finalCpaAmount}</td>
            </tr>
        </tfoot>
    )
}

export default TableFooter;