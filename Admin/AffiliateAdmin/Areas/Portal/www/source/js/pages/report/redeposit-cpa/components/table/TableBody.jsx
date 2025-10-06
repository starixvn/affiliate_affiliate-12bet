import React from 'react';

import { format, formatDecimal } from '../../../../../modules/numberFormat';
import { globalResource } from '../../../../../modules/globalResource';
import { groupData } from '../../libs/service';
import { resolveClientUrl } from '../../../../../modules/utils';

const _handleUrlRedirectToPlayerCpa = (data) => {
    const path = `${resolveClientUrl('Portal/PlayerCpaReport')}`;

    const url = `${path}
                ?custName=${data.AffUserName}
                &dealName=${data.GroupId}
                &viewBy=2
                &fromDate=${data.StartScheduleStr}
                &toDate=${data.EndScheduleStr}`
    return url;
}

const SubEntryRow = ({ subEntry, isFirst, rowSpan, rowNumber, isAdjustable }) => {

    const statusClassName = `status-${subEntry.Status.toLowerCase().replace(' ', '-')}`;
    const totalEligiblePlayers = format(subEntry.TotalEligiblePlayers);
    const redepositDays = subEntry.RedepositDays ? `${format(subEntry.RedepositDays)} days` : '-';
    const redepositRate = subEntry.RedepositRate ? `${formatDecimal(subEntry.RedepositRate * 100)}%` : '-';
    const estimateAmount = formatDecimal(subEntry.EstimateAmount);
    const approvedAmount = formatDecimal(subEntry.ApprovedAmount);
    const adjustedAmount = formatDecimal(subEntry.AdjustedAmount);
    const finalCpaAmount = formatDecimal(subEntry.FinalCpaAmount);

    return (
        <tr>
            {isFirst && (
                <>
                    <td title={rowNumber} className="text-center" rowSpan={rowSpan}>{rowNumber}</td>
                    <td title={subEntry.AffUserName} className="text-left" rowSpan={rowSpan}>{subEntry.AffUserName}</td>
                    <td title={subEntry.DealName} className="text-left" rowSpan={rowSpan}>{subEntry.DealName}</td>
                    <td title={subEntry.PaymentFrequency} className="text-center" rowSpan={rowSpan}>{subEntry.PaymentFrequency}</td>
                </>
            )}
            <td title={subEntry.StartScheduleStr} className="text-center">{subEntry.StartScheduleStr}</td>
            <td title={subEntry.EndScheduleStr} className="text-center">{subEntry.EndScheduleStr}</td>
            <td title={totalEligiblePlayers} className="text-center">
                <a href={_handleUrlRedirectToPlayerCpa(subEntry)} target="_blank">{totalEligiblePlayers}</a>
            </td>
            {isFirst && (
                <td title={redepositDays} className="text-center" rowSpan={rowSpan}>
                    {redepositDays}
                </td>
            )}
            <td title={subEntry.ExpiredRedepositDateStr} className="text-center">{subEntry.ExpiredRedepositDateStr}</td>
            {isFirst && (
                <td title={redepositRate} className="text-center" rowSpan={rowSpan}>
                    {redepositRate}
                </td>
            )}
            <td title={subEntry.NoOfRedepositPlayers} className="text-center">{subEntry.NoOfRedepositPlayers}</td>
            <td title={estimateAmount} className="text-right">{estimateAmount}</td>
            <td title={subEntry.Status} className="text-center">
                <span className={statusClassName}>
                    {subEntry.Status}
                </span>
            </td>
            <td title={approvedAmount} className="text-right">{approvedAmount}</td>
            <td title={subEntry.ApprovedDateStr} className="text-center">{subEntry.ApprovedDateStr}</td>
            <td title={adjustedAmount} className="text-right">{adjustedAmount}</td>
            <td title={subEntry.AdjustedDateStr} className="text-center">{subEntry.AdjustedDateStr}</td>
            <td title={subEntry.Description} className="text-left">{subEntry.Description}</td>
            {isAdjustable && (
                <td title='Action' className='text-center'>
                    <button className='btn btn-primary'>Adjust</button>
                </td>
            )}
            <td title={finalCpaAmount} className="text-right">{finalCpaAmount}</td>
        </tr>
    );
};

const GroupRow = ({ group, rowNumber, isAdjustable }) => {
    return (
        <>
            {group.subEntries.map((subEntry, index) => {
                return (
                    <SubEntryRow
                        key={`${rowNumber}-${index}`}
                        subEntry={subEntry}
                        isFirst={index === 0}
                        rowSpan={group.subEntries.length}
                        rowNumber={rowNumber}
                        isAdjustable={isAdjustable}
                    />
                )
            })}
        </>
    );
};

export function TableBody({
    data,
    isAdjustable
}) {

    if (!data || data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td className="text-center" colSpan={isAdjustable ? 20 : 19}>{globalResource.NoInfo}</td>
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
                    isAdjustable={isAdjustable}
                />
            ))}
        </tbody>
    )
}

export default TableBody;