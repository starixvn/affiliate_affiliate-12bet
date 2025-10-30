import React from 'react';

import { Button } from 'reactstrap';

import { formatDecimal } from '@/modules/numberFormat';
import { globalResource } from '@/modules/globalResource';
import { getCSSClassName } from '@/modules/utils';
import { groupData } from '../../libs/service';
import { NOT_QUALIFIED, QUALIFIED } from '../../libs/constants';
import { htmlDecode } from '@/modules/htmlHelper';
import { relativePath } from '../../../libs/constants';

const SubEntryRow = ({
    subEntry,
    isFirst,
    rowSpan,
    rowNumber,
    isAdjustable,
    toggleAdjustAmountModal,
    setAdjustAmountParam }) => {

    const statusClassName = getCSSClassName('status', subEntry.Status);
    const paymentFrequencyClassName = getCSSClassName('payment-frequency', subEntry.PaymentFrequency);
    const totalEligiblePlayers = subEntry.TotalEligiblePlayers;
    const redepositDays = subEntry.RedepositDays ? `${subEntry.RedepositDays} days` : '-';
    const redepositRate = subEntry.RedepositRate ? `${formatDecimal(subEntry.RedepositRate * 100)}%` : '-';
    const description = htmlDecode(subEntry.Description);
    const estimateAmount = formatDecimal(subEntry.EstimateAmount);
    const approvedAmount = formatDecimal(subEntry.ApprovedAmount);
    const manuallyApprovedAmount = formatDecimal(subEntry.ManuallyApprovedAmount);
    const adjustedAmount = formatDecimal(subEntry.AdjustedAmount);
    const finalCpaAmount = formatDecimal(subEntry.FinalCpaAmount);

    const _handleUrlRedirectToPlayerCpa = () => {
        const paramFromPaymentManagement = {
            custName: subEntry.AffUserName,
            dealName: subEntry.GroupId,
            viewBy: 2,
            fromDate: subEntry.StartScheduleStr,
            toDate: subEntry.EndScheduleStr
        };

        document.cookie = `paramForPlayerCpaReport=${JSON.stringify(paramFromPaymentManagement)}; path=${relativePath.playerCPA}`;
        window.open(relativePath.playerCPA, '_blank');
    }

    const _handleShowModal = () => {
        setAdjustAmountParam({
            affId: subEntry.AffId,
            paymentId: subEntry.PaymentId,
            estimatedAmount: subEntry.EstimateAmount,
            approvedAmount: subEntry.ApprovedAmount,
            affName: subEntry.AffUserName,
            isApproved: subEntry.StatusId === NOT_QUALIFIED
        });

        const title = `Adjust CPA Amount - ${subEntry.AffUserName} - ${subEntry.StartScheduleStr} - ${subEntry.EndScheduleStr}`;
        toggleAdjustAmountModal({
            title,
            isOpen: true
        });
    }

    return (
        <tr>
            {isFirst && (
                <>
                    <td title={rowNumber} className="text-center freeze-column-0" rowSpan={rowSpan}>{rowNumber}</td>
                    <td title={subEntry.AffUserName} className="text-left freeze-column-1" rowSpan={rowSpan}>{subEntry.AffUserName}</td>
                    <td title={subEntry.DealName} className="text-left freeze-column-2" rowSpan={rowSpan}>{subEntry.DealName}</td>
                    <td title={subEntry.PaymentFrequency} className="text-center" rowSpan={rowSpan}>
                        <span className={paymentFrequencyClassName}>
                            {subEntry.PaymentFrequency}
                        </span>
                    </td>
                </>
            )}
            <td title={subEntry.StartScheduleStr} className="text-center">{subEntry.StartScheduleStr}</td>
            <td title={subEntry.EndScheduleStr} className="text-center">{subEntry.EndScheduleStr}</td>
            <td title={totalEligiblePlayers} className="text-center">
                {
                    !subEntry.TotalEligiblePlayers ? totalEligiblePlayers :
                        <span className='btn-link' onClick={_handleUrlRedirectToPlayerCpa}>{totalEligiblePlayers}</span>
                }
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
            <td title={manuallyApprovedAmount} className="text-right">{manuallyApprovedAmount}</td>
            <td title={subEntry.ManuallyApprovedDateStr} className="text-center">{subEntry.ManuallyApprovedDateStr}</td>
            <td title={description} className="text-left">{description}</td>
            {isAdjustable && (
                <td title='Adjust' className='text-center'>
                    {subEntry.StatusId === NOT_QUALIFIED || subEntry.StatusId === QUALIFIED
                        ? subEntry.IsEnabled && subEntry.AdjustedBy === 0 ?
                            <Button outline color="primary" type="button" onClick={_handleShowModal}>
                                Adjust
                            </Button> :
                            <Button outline color="secondary" type="button" disabled>Adjust</Button>
                        : ''
                    }
                </td>
            )}
            <td title={adjustedAmount} className="text-right">{adjustedAmount}</td>
            <td title={finalCpaAmount} className="text-right">{finalCpaAmount}</td>
        </tr>
    );
};

const GroupRow = ({ group, rowNumber, isAdjustable, toggleAdjustAmountModal, setAdjustAmountParam }) => {
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
                        toggleAdjustAmountModal={toggleAdjustAmountModal}
                        setAdjustAmountParam={setAdjustAmountParam}
                    />
                )
            })}
        </>
    );
};

export function TableBody({
    data,
    isAdjustable,
    toggleAdjustAmountModal,
    setAdjustAmountParam,
    pagingOption
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

    const getRowNumber = (index) => {
        return (pagingOption.PageIndex - 1) * pagingOption.PageSize + index + 1;
    }

    const groupedData = groupData(data);

    return (
        <tbody>
            {groupedData.map((group, index) => (
                <GroupRow
                    key={`group-${index}`}
                    group={group}
                    rowNumber={getRowNumber(index)}
                    isAdjustable={isAdjustable}
                    toggleAdjustAmountModal={toggleAdjustAmountModal}
                    setAdjustAmountParam={setAdjustAmountParam}
                />
            ))}
        </tbody>
    )
}

export default TableBody;