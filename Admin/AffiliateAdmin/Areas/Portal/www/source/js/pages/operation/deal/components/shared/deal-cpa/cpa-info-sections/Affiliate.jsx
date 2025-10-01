import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FormGroup, Label, Col, Input } from 'reactstrap';
import { DatePicker } from '@9softstudio/react-datepicker';

import { setDealInfo } from '../../../../actions';
import { INFINITY_NUMBER } from '../../../../libs/constants';
import { format } from '../../../../../../../modules/numberFormat';
import { isValidNumber } from '../../../../../../../modules/utils';


export const Affiliate = ({ dealInfo, paymentFrequencyList, setDealInfo, isEdit, isSubmitted, today, isModifiable }) => {
    const todayDate = new Date(today);
    const todayString = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`;

    useEffect(() => {
        if (!dealInfo.StartDate && !isEdit) {
            setDealInfo({ StartDate: todayString });
        }
    }, [dealInfo.DealType]);

    const _handleCheckRedeposit = (e) => {
        const { name } = e.target;
        const toggledValue = !dealInfo[name];

        const updatedInfo = { [name]: toggledValue };

        if (toggledValue) {
            updatedInfo.RedepositRate = '';
            updatedInfo.RedepositDays = '';
        } else {
            updatedInfo.RedepositRate = 0;
            updatedInfo.RedepositDays = 0;
        }

        setDealInfo(updatedInfo);
    };

    const _handleChangePositiveInteger = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value.replace(/,/g, ''));
        let newValue = dealInfo[name];

        if (value === '') {
            newValue = '';
        } else if (numericValue === 0) {
            newValue = 0;
        }
        else if (numericValue > 0 && numericValue <= INFINITY_NUMBER && isValidNumber(numericValue)) {
            newValue = numericValue;
        }

        setDealInfo({ [name]: newValue });
    };

    const _handleChangeScheduleId = (e) => {
        if (isEdit) {
            return;
        }

        setDealInfo({ ScheduleId: Number(e.target.value) });
    };

    const _handleCheckQuota = (e) => {
        const { name } = e.target;
        const toggledValue = !dealInfo[name];

        const updatedInfo = { [name]: toggledValue };

        if (toggledValue) {
            updatedInfo.Quota = '';
        } else {
            updatedInfo.Quota = 0;
        }
        setDealInfo(updatedInfo);
    }

    const _handleChangeRedepositRate = (event) => {
        let val = event.target.value;
        const lastValid = dealInfo.RedepositRate;

        const validRateRegex = /^(100(\.0{0,2})?|([1-9][0-9]?)(\.\d{0,2})?)$/;

        if (/^0+$/.test(val)) {
            val = '0';
        } else {
            val = val.replace(/^0+/, '');
        }

        const hasSingleDot = (val.match(/\./g) || []).length <= 1;
        const isValid = hasSingleDot && validRateRegex.test(val);

        let newRate;

        if (isValid) {
            newRate = val;
        } else if (val === '') {
            newRate = '';
        } else if (Number(val) >= 0 && Number(val) < 1) {
            newRate = 0;
        } else {
            newRate = lastValid;
        }


        setDealInfo({ RedepositRate: newRate });
    };


    const _handleChangeDate = (momentDate) => {
        if (!isEdit) {
            setDealInfo({ StartDate: momentDate.format('MM/DD/YYYY') });
        }
    }

    const _getErrorClass = (value, checkedField = true) => {
        if (isSubmitted && checkedField) {
            return Number.isNaN(value) || value < 1 || value > INFINITY_NUMBER ? 'has-error' : '';
        }

        return '';
    }

    const isRedepositRateError = isSubmitted && dealInfo.IsRedeposit && (Number.isNaN(dealInfo.RedepositRate) || dealInfo.RedepositRate < 1 || dealInfo.RedepositRate > 100);

    return (
        <fieldset className="affiliate-group">
            <legend><h6 className="font-weight-bold">Affiliate</h6></legend>

            <FormGroup row className='align-items-center'>
                <Label sm={4} className="d-flex mr_15neg" htmlFor='IsRedeposit'>
                    <input
                        disabled={isEdit || !isModifiable}
                        type="checkbox"
                        name="IsRedeposit"
                        id="IsRedeposit"
                        checked={dealInfo.IsRedeposit}
                        onChange={isEdit ? null : _handleCheckRedeposit}
                    />
                    <span className="ml-1">Redeposit</span>
                    <span title="The affiliate receive CPA Amount only when a minimum percentage of their referred players redeposit within a specified number of days." className="ml-1 oi icon-info"></span>
                </Label>

                <Col sm={2} className="d-flex align-items-center">
                    <Input type="text"
                        disabled={!dealInfo.IsRedeposit || isEdit}
                        name="RedepositRate"
                        className={isRedepositRateError ? 'has-error' : ''}
                        id="RedepositRate"
                        value={dealInfo.RedepositRate}
                        onChange={isEdit || !dealInfo.IsRedeposit ? null : _handleChangeRedepositRate} />
                </Col>
                <Label className="text-content mb-0 ms-2">% of eligible players | Re-checked within</Label>
                <Col sm={2} className="d-flex align-items-center">
                    <Input type="text"
                        disabled={!dealInfo.IsRedeposit || isEdit}
                        name="RedepositDays"
                        className={_getErrorClass(dealInfo.RedepositDays, dealInfo.IsRedeposit)}
                        id="RedepositDays"
                        value={format(dealInfo.RedepositDays)}
                        onChange={isEdit || !dealInfo.IsRedeposit ? null : _handleChangePositiveInteger} />
                </Col>
                <Label className="text-content mb-0 ms-2">(days)</Label>
            </FormGroup>
            <FormGroup row className='align-items-center'>
                <Label sm={4} className="d-flex mr_15neg" htmlFor='IsQuota'>
                    <input
                        disabled={!isModifiable}
                        type="checkbox"
                        name="IsQuota"
                        id="IsQuota"
                        checked={dealInfo.IsQuota}
                        onChange={_handleCheckQuota}
                    />
                    <span className="ml-1">Quota</span>
                    <span title="The maximum number of players eligible for CPA payment in this deal." className="ml-1 oi icon-info"></span>
                </Label>
                <Col sm={3} className="d-flex align-items-center">
                    <Input type="text"
                        disabled={!dealInfo.IsQuota}
                        name="Quota"
                        className={_getErrorClass(dealInfo.Quota, dealInfo.IsQuota)}
                        id="Quota"
                        value={format(dealInfo.Quota)}
                        onChange={_handleChangePositiveInteger} />
                </Col>
                <Label className="text-content mb-0 ms-2">(players)</Label>
            </FormGroup>

            <FormGroup row className='align-items-center'>
                <Label htmlFor="ScheduleId" sm={4} className="d-flex mr_15neg">
                    Payment Frequency
                    <span title="Choose how often CPA is calculated and payments are made, starting from the ‘Start from’ date." className="ml-1 oi icon-info"></span>
                </Label>
                <Col sm={3}>
                    <Input type="select"
                        name="ScheduleId"
                        id="ScheduleId"
                        disabled={isEdit}
                        value={dealInfo.ScheduleId}
                        onChange={_handleChangeScheduleId}
                        className={`mr-sm-2 search-box ${isSubmitted && dealInfo.ScheduleId === 0 ? 'has-error' : ''}`}>
                        <option disabled hidden value={0}>Please Select</option>
                        {
                            paymentFrequencyList.map(pf =>
                                <option key={pf.ScheduleId}
                                    value={pf.ScheduleId}
                                    disabled={isEdit && pf.ScheduleId !== 0}>
                                    {pf.ScheduleName}
                                </option>)
                        }
                    </Input>
                </Col>
                <Label className="text-content mb-0 ms-2">Start from</Label>
                <Col sm={4}>
                    <DatePicker
                        isEnable={!isEdit}
                        minDate={todayString}
                        date={dealInfo.StartDate || todayString}
                        iconElement={(<span className="oi oi-calendar icon-calendar ml-1"></span>)}
                        onChange={_handleChangeDate}
                    />
                </Col>
            </FormGroup>
            
        </fieldset>
    );
}

const mapStateToProps = ({ dealInfo, paymentFrequencyList, isEdit, isSubmitted, today, isModifiable }) => {
    return {
        dealInfo,
        paymentFrequencyList,
        isEdit,
        isSubmitted,
        today,
        isModifiable
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Affiliate));