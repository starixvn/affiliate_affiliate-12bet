import React, { useState, useMemo } from 'react';

import { Form, FormGroup, Label, Col, Input, Button } from 'reactstrap';
import { format, formatDecimal } from '../../../../../modules/numberFormat';
import { isValidNumber } from '../../../../../modules/utils';

export const AdjustCpaAmountForm = ({ adjustAmountParam, setAdjustAmountParam, onSubmit }) => {
    const { estimatedAmount, approvedAmount, newAmount, transDesc, isApproved } = adjustAmountParam;

    const [formState, setFormState] = useState({
        message: '',
        valid: false,
        touched: {
            newAmount: false,
            transDesc: false
        }
    });

    const validation = useMemo(() => {
        const isNewAmountValid = newAmount <= +estimatedAmount;
        const isTransDescValid = transDesc.trim() !== '';
        const isFormValid = isNewAmountValid && isTransDescValid;

        return {
            isNewAmountValid,
            isTransDescValid,
            isFormValid
        };
    }, [newAmount, estimatedAmount, transDesc]);

    const message = useMemo(() => {
        const est = Number(estimatedAmount);
        const appr = Number(approvedAmount);
        const diff = newAmount - appr;

        if (newAmount > est) {
            return `New CPA Amount cannot exceed ${formatDecimal(est)}`;
        }

        if (newAmount === appr) {
            return '';
        }

        if (!isApproved && newAmount !== appr) {
            const absDiff = formatDecimal(Math.abs(diff));
            const action = diff > 0 ? 'increased' : 'deducted';
            return `Affiliate Balance will be ${action} by ${absDiff}`;
        }

        return '';
    }, [newAmount, estimatedAmount, approvedAmount, isApproved]);

    const parseValue = (value) => Number(value.replace(/,/g, '').trim());

    const updateFormState = (updates) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const setFieldTouched = (fieldName) => {
        updateFormState({
            touched: { ...formState.touched, [fieldName]: true }
        });
    };

    const handleBlur = (fieldName) => {
        setFieldTouched(fieldName);
    };

    const handleChangeAmount = (e) => {
        const { value } = e.target;
        setFieldTouched('newAmount');

        const parsedValue = parseValue(value);
        if (parsedValue < 0 || !isValidNumber(parsedValue)) {
            return;
        }

        setAdjustAmountParam({
            newAmount: parsedValue,
            adjustAmount: parsedValue - +approvedAmount
        });
    };

    const handleChangeTransDesc = (e) => {
        const { value } = e.target;
        setFieldTouched('transDesc');

        setAdjustAmountParam({
            transDesc: value
        });
    };

    return (
        <Form tag='form' autoComplete='off'>
            <FormGroup row className='align-items-center'>
                <Label
                    className='text-right'
                    htmlFor='estimateAmount'
                    sm={5}>
                    Estimated CPA Amount
                </Label>
                <Col>
                    <p
                        className='text-left'
                        name='estimatedAmount'
                        id='estimatedAmount'>
                        {formatDecimal(Number(estimatedAmount))}
                    </p>
                </Col>
            </FormGroup>

            {isApproved ? (
                <>
                    <FormGroup row className='align-items-center mt-2'>
                        <Label
                            className='text-right'
                            htmlFor='newAmount'
                            sm={5}>
                            Approved CPA Amount
                            <span className='text-danger ml-1'>*</span>
                        </Label>
                        <Col sm={5}>
                            <Input
                                className='text-left'
                                type='text'
                                name='newAmount'
                                id='newAmount'
                                value={format(newAmount)}
                                onChange={handleChangeAmount}
                                onBlur={() => handleBlur('newAmount')}
                                invalid={formState.touched.newAmount && !validation.isNewAmountValid}
                            />
                        </Col>
                        <Col sm={5}>
                        </Col>
                        <Col sm={7} className='text-left'>
                            <i className='text-danger'>{formState.touched.newAmount && message}</i>
                        </Col>
                    </FormGroup>
                </>
            ) : (
                <>
                    <FormGroup row className='align-items-center mt-2'>
                        <Label
                            className='text-right'
                            htmlFor='approvedAmount'
                            sm={5}>
                            Approved CPA Amount
                        </Label>
                        <Col>
                            <p
                                className='text-left'
                                name='approvedAmount'
                                id='approvedAmount'>
                                {formatDecimal(Number(approvedAmount))}
                            </p>
                        </Col>
                    </FormGroup>

                    <FormGroup row className='align-items-center mt-2'>
                        <Label
                            className='text-right'
                            htmlFor='newAmount'
                            sm={5}>
                            New CPA Amount
                            <span className='text-danger ml-1'>*</span>
                        </Label>
                        <Col sm={5}>
                            <Input
                                className='text-left'
                                type='text'
                                name='newAmount'
                                id='newAmount'
                                value={format(newAmount)}
                                onChange={handleChangeAmount}
                                onBlur={() => handleBlur('newAmount')}
                                invalid={formState.touched.newAmount && !validation.isNewAmountValid}
                            />
                        </Col>
                        <Col sm={5}>
                        </Col>
                        <Col sm={7} className='text-left'>
                            <i className='text-danger'>{formState.touched.newAmount && message}</i>
                        </Col>
                    </FormGroup>
                </>
            )}

            <FormGroup row className='align-items-center mt-2'>
                <Label
                    className='text-right'
                    htmlFor='transDesc'
                    sm={5}>
                    Description
                    <span className='text-danger ml-1'>*</span>
                </Label>
                <Col sm={5}>
                    <Input
                        className='text-left'
                        type='text'
                        name='transDesc'
                        id='transDesc'
                        value={transDesc}
                        onChange={handleChangeTransDesc}
                        onBlur={() => handleBlur('transDesc')}
                        invalid={formState.touched.transDesc && !validation.isTransDescValid}
                    />
                </Col>
                <Col sm={5}>
                </Col>
                <Col sm={7} className='text-left'>
                    <i className='text-danger'>{formState.touched.transDesc && !validation.isTransDescValid && 'Description is required'}</i>
                </Col>
            </FormGroup>

            <FormGroup row className='align-items-center mt-4'>
                <Label className='m-0 margin-auto'>
                    <i className='text-danger'><b>Note: Manually Approve CPA can only submit one time</b></i>
                </Label>
            </FormGroup>

            <Button disabled={!validation.isFormValid} type='button' color='success' className='btn-submit mt-4' onClick={!validation.isFormValid ? null : onSubmit}>Submit</Button>
        </Form>
    );
};

export default AdjustCpaAmountForm;