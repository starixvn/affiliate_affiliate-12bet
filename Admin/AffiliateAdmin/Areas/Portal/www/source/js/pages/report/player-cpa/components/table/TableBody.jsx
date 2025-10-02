import React from 'react'
import { globalResource } from '../../../../../modules/globalResource';
import { connect } from 'react-redux';
import { setMemberCpaId, setDealId, toggleDealPopup, setAffName } from '../../actions';

const RowData = ({ data, rowNumber, setMemberCpaId, setDealId, toggleDealPopup, setAffName }) => {

    const handleClickTO = () => {
        setMemberCpaId(data.memberCPAId)
    }

    const handleClickDeal = () => {
        setDealId(data.groupId)
        setAffName(data.affUserName)
        toggleDealPopup()
    }

    const hasSettingRedeposit = !!data.expiredRedepositDate;

    return (
        <tr key={`dataRow-${rowNumber}`}>
            <td title={rowNumber} className="text-center freeze-column-0">
                {rowNumber}
            </td>
            <td title={data.affUserName} className="text-left freeze-column-1">
                {data.affUserName}
            </td>
            <td title={data.custUserName} className="text-left freeze-column-2">
                {data.custUserName}
            </td>
            <td title={data.registeredDateStr} className="text-center">
                {data.registeredDateStr}
            </td>
            <td title={data.dealName} className="text-left">
                <span className="btn-link" onClick={handleClickDeal}>{data.dealName}</span>
            </td>
            <td title={data.scheduleName} className="text-center">
                {data.scheduleName}
            </td>
            <td title={data.ftd} className="text-right">
                {data.ftd}
            </td>
            <td title={data.totalDeposit} className="text-right">
                {data.totalDeposit}
            </td>
            <td className="text-center">
                {
                    data.isTO ? 'Yes' : 'No'
                }
            </td>
            <td title={data.aqdStr} className="text-center">
                {data.aqdStr}
            </td>
            <td title={data.cpaAmount} className="text-right">
                {
                    data.isTO ?
                        <span
                            className="btn-link"
                            onClick={handleClickTO}>
                            <span>{data.cpaAmount}</span>
                        </span> : data.cpaAmount
                }
            </td>
            <td title={data.betTicket} className="text-center">
                {data.betTicket}
            </td>
            <td title={data.hqdStr} className="text-center">
                {data.hqdStr}
            </td>
            <td title={data.hedStr} className="text-center">
                {data.hedStr}
            </td>
            <td title={data.estimatedCPAAmount} className="text-right">
                {data.estimatedCPAAmount}
            </td>
            <td title={data.firstDepositDateStr} className="text-center">
                {data.firstDepositDateStr}
            </td>
            <td title={data.reDepositDays} className="text-center">
                {hasSettingRedeposit ? data.reDepositDays : '-'}
            </td>
            <td title={data.expiredRedepositDateStr} className="text-center">
                {data.expiredRedepositDateStr}
            </td>
            <td title={data.isRedeposit} className="text-center">
                {hasSettingRedeposit ? (data.isRedeposit ? 'Yes' : 'No') : '-'}
            </td>
            <td title={data.cpaStatus} className="text-center">
                {data.cpaStatus}
                {
                    data.isAbnormal && <span title={data.description} className="ml-1 oi icon-info"></span>
                }
            </td>
        </tr>
    )
}

export function TableBody({
    data,
    pagingOption,
    setMemberCpaId,
    setDealId,
    toggleDealPopup,
    setAffName
}) {
    if (!data || data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td title={globalResource.NoInfo} className="text-center" colSpan={18}>{globalResource.NoInfo}</td>
                </tr>
            </tbody>
        )
    }

    const getRowNumber = (index) => {
        return (pagingOption.PageIndex - 1) * pagingOption.PageSize + index + 1;
    }

    return (
        <tbody>
            {
                data && data.map((item, index) => (
                    <RowData key={index} data={item} rowNumber={getRowNumber(index)} setMemberCpaId={setMemberCpaId} setDealId={setDealId} toggleDealPopup={toggleDealPopup} setAffName={setAffName} />
                ))
            }
        </tbody>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        setMemberCpaId: (data) => dispatch(setMemberCpaId(data)),
        setDealId: (data) => dispatch(setDealId(data)),
        toggleDealPopup: () => dispatch(toggleDealPopup()),
        setAffName: (data) => dispatch(setAffName(data))
    }
}

export default connect(null, mapDispatchToProps)(TableBody)