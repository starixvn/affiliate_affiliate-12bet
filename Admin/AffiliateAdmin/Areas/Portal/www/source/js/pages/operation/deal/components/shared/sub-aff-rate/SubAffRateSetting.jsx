import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { FormGroup, Label, Col, Input } from 'reactstrap';

import { setDealInfo } from '../../../actions';
import { subAffRateValueList, DEAL_REVENUE_SHARE } from '../../../libs/constants';
import { format } from '../../../../../../modules/numberFormat';

export const SubAffRateSetting = (props) => {
    const { SubCommRate, IsSubCommRate, DealType, isSubmitted } = props;

    const _handleChangeIsSubCommRate = (event) => {
        const { checked } = event.target;
        props.setDealInfo({ IsSubCommRate: checked, SubCommRate: checked ? SubCommRate : 0 });
    }

    const _handleChangeCommRate = (event) => {
        const { value } = event.target;
        props.setDealInfo({ SubCommRate: Number(value) });
    }

    return (
        <React.Fragment>
            {DealType === DEAL_REVENUE_SHARE ? (
                <fieldset>
                    <legend>
                        <h6 className="font-weight-bold">Sub-Affiliate Rate</h6>
                    </legend>
                    <FormGroup row className="align-items-center">
                        <Label htmlFor="SubCommRate" sm={2}>
                            Fixed Rate
                        </Label>
                        <Col sm={3}>
                            <Input
                                type="select"
                                className="form-control"
                                name="SubCommRate"
                                id="SubCommRate"
                                value={format(SubCommRate, 3)}
                                onChange={_handleChangeCommRate}
                            >
                                {Object.entries(subAffRateValueList).map(([key, value], i) => (
                                    <option key={`sub-aff-fixed-rate-${i}`} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </FormGroup>
                </fieldset>
            ) : (
                <fieldset className="mt-3" style={{ padding: 10 }}>
                    <FormGroup row className="align-items-center">
                        <Label sm={4} className="d-flex mr_15neg" htmlFor="IsSubCommRate">
                            <input
                                type="checkbox"
                                name="IsSubCommRate"
                                id="IsSubCommRate"
                                checked={IsSubCommRate}
                                onChange={_handleChangeIsSubCommRate}
                            />
                            <span className="ml-1">Sub-Affiliate Commission</span>
                        </Label>
                        <Col sm={3}>
                            <Input
                                type="select"
                                className={`form-control ${isSubmitted && IsSubCommRate && SubCommRate === 0 ? 'has-error' : ''}`}
                                name="SubCommRate"
                                id="SubCommRate"
                                disabled={!IsSubCommRate}
                                value={format(SubCommRate, 3)}
                                onChange={IsSubCommRate ? _handleChangeCommRate : null}
                            >
                                <option key='sub-aff-fixed-rate-0' disabled hidden value={format(0, 3)}>Please Select</option>
                                {Object.entries(subAffRateValueList).map(([key, value], i) => (
                                    <option key={`sub-aff-fixed-rate-${i}`} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Input>
                        </Col>
                    </FormGroup>
                </fieldset>
            )}
        </React.Fragment>
    );
};

const mapStateToProps = ({ dealInfo, isSubmitted }) => {
    const { SubCommRate, IsSubCommRate, DealType } = dealInfo;
    return {
        SubCommRate,
        IsSubCommRate,
        DealType,
        isSubmitted,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SubAffRateSetting));