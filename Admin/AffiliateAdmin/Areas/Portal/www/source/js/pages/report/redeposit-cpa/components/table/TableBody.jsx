import React from 'react';

import { format, formatDecimal } from '../../../../../modules/numberFormat';
import { globalResource } from '../../../../../modules/globalResource';

const groupData = (data) => {
    const grouped = {};

    data.forEach(item => {
        const key = `${item.AffUserName}_${item.DealName}_${item.RecheckDays}_${item.RedepositRate}`;

        if (!grouped[key]) {
            grouped[key] = {
                AffUserName: item.AffUserName,
                DealName: item.DealName,
                PaymentFrequency: item.PaymentFrequency,
                RecheckDays: item.RecheckDays,
                RedepositRate: item.RedepositRate,
                subEntries: []
            };
        }

        grouped[key].subEntries.push(item);
    });

    return Object.values(grouped);
};

const SubEntryRow = ({ subEntry, isFirst, rowSpan }) => {

    const statusClassName = `status-${subEntry.Status.toLowerCase().replace(' ', '-')}`;
    const recheckDays = subEntry.RecheckDays ? `${format(subEntry.RecheckDays)} days` : '-';
    const approvedCpaPlayer = format(subEntry.ApprovedCpaPlayer);
    const redepositRate = subEntry.RedepositRate ? `${formatDecimal(subEntry.RedepositRate * 100)}%` : '-';
    const totalSettledCpaAmount = formatDecimal(subEntry.TotalSettledCpaAmount);

    return (
        <tr>
            <td title={subEntry.RowIdx} className="text-center">{subEntry.RowIdx}</td>
            {isFirst && (
                <>
                    <td title={subEntry.AffUserName} className="text-left" rowSpan={rowSpan}>{subEntry.AffUserName}</td>
                    <td title={subEntry.DealName} className="text-left" rowSpan={rowSpan}>{subEntry.DealName}</td>
                    <td title={subEntry.PaymentFrequency} className="text-center" rowSpan={rowSpan}>{subEntry.PaymentFrequency}</td>
                </>
            )}
            <td title={subEntry.StartFromStr} className="text-center">{subEntry.StartFromStr}</td>
            <td title={subEntry.ApprovalDateStr} className="text-center">{subEntry.ApprovalDateStr}</td>
            {isFirst && (
                <td title={recheckDays} className="text-center" rowSpan={rowSpan}>
                    {recheckDays}
                </td>
            )}
            <td title={subEntry.ExpiredRedepositDateStr} className="text-center">{subEntry.ExpiredRedepositDateStr}</td>
            <td title={approvedCpaPlayer} className="text-right">{approvedCpaPlayer}</td>
            {isFirst && (
                <td title={redepositRate} className="text-center" rowSpan={rowSpan}>
                    {redepositRate}
                </td>
            )}
            <td title={subEntry.NumOfPlayerRedeposit} className="text-center">{subEntry.NumOfPlayerRedeposit}</td>
            <td title={totalSettledCpaAmount} className="text-right">{totalSettledCpaAmount}</td>
            <td title={subEntry.Status} className="text-center">
                <span className={statusClassName}>
                    {subEntry.Status}
                </span>
            </td>
            <td title={subEntry.AutoApprovedAmount} className="text-right">{subEntry.AutoApprovedAmount}</td>
            <td title={subEntry.AutoApprovedDateStr} className="text-center">{subEntry.AutoApprovedDateStr}</td>
            <td title={subEntry.ManualAdjustedAmount} className="text-right">{subEntry.ManualAdjustedAmount}</td>
            <td title={subEntry.ManualAdjustedDateStr} className="text-center">{subEntry.ManualAdjustedDateStr}</td>
            <td title={subEntry.ManualAdjustedDescription} className="text-left">{subEntry.ManualAdjustedDescription}</td>
            <td title={subEntry.FinalCpaAmount} className="text-right">{subEntry.FinalCpaAmount}</td>
        </tr>
    );
};

const GroupRow = ({ group, rowNumber }) => {
    return (
        <>
            {group.subEntries.map((subEntry, index) => {
                return (
                    <SubEntryRow
                        key={`${rowNumber}-${index}`}
                        subEntry={subEntry}
                        isFirst={index === 0}
                        rowSpan={group.subEntries.length}
                    />
                )
            })}
        </>
    );
};

export function TableBody({
    data,
}) {
    if (!data || data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td className="text-center" colSpan={20}>{globalResource.NoInfo}</td>
                </tr>
            </tbody>
        )
    }

    const groupedData = groupData(data);

    return (
        <tbody>
            {groupedData.map((group, index) => (
                <GroupRow
                    key={`group-${index}`}
                    group={group}
                    rowNumber={index + 1}
                />
            ))}
        </tbody>
    )
}

export default TableBody;