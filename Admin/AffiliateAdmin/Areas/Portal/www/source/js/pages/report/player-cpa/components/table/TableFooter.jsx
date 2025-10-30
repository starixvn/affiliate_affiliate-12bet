import React from 'react'
import { TotalText } from '../../libs/constants';
import { formatDecimal } from '../../../../../modules/numberFormat';

export default function TableFooter({
    total,
    totalItem
}) {
    if (!totalItem) {
        return null;
    }

    const ftd = formatDecimal(total.ftd);
    const totalDeposit = formatDecimal(total.totalDeposit);
    const cpaAmount = formatDecimal(total.cpaAmount);
    const estimatedCPAAmount = formatDecimal(total.estimatedCPAAmount);

    return (
        <tfoot>
            <tr className="total-row freeze-row">
                <td title={TotalText} colSpan="3" className="text-left font-weight-bold freeze-column-0">{TotalText}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td title={ftd} className="text-right font-weight-bold">{ftd}</td>
                <td title={totalDeposit} className="text-right font-weight-bold">{totalDeposit}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td title={cpaAmount} className="text-right font-weight-bold">{cpaAmount}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td title={estimatedCPAAmount} className="text-right font-weight-bold">{estimatedCPAAmount}</td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
                <td className="text-right font-weight-bold"></td>
            </tr>
        </tfoot>
    )

}
