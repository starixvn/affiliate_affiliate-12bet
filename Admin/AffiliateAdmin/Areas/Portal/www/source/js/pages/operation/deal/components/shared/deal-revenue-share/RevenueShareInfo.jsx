import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setDealInfo } from '../../../actions';

import PlatformFeeSetting from './tier-deduction/PlatformFeeSetting';
import FeeSettingItem from './tier-deduction/FeeSettingItem';
import QmTurnoverSetting from './qp-turnover/QmTurnoverSetting';
import CopyRevenueDealSetting from './copy-revenue-setting/CopyRevenueDealSetting';
import { DEAL_HYBRID } from '../../../libs/constants';

export class RevenueShareInfo extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isInitialDepositFee: true,
            isInitialWithdrawalFee: true,
        }
    }

    handleChangeDepositFee = (value) => {
        const { DepositFeeSetting } = this.props.dealInfo;
        this.props.setDealInfo({
            DepositFeeSetting: Object.assign({}, DepositFeeSetting, value)
        });
    }

    handleChangeWithdrawalFee = (value) => {
        const { WithdrawalFeeSetting } = this.props.dealInfo;
        this.props.setDealInfo({
            WithdrawalFeeSetting: Object.assign({}, WithdrawalFeeSetting, value)
        });
    }

    render() {
        const { defaultCurrency, dealInfo } = this.props;
        const { isInitialDepositFee, isInitialWithdrawalFee } = this.state;
        const { DepositFeeSetting, WithdrawalFeeSetting } = this.props.dealInfo;

        return (
            <Fragment>
                {dealInfo.DealType === DEAL_HYBRID && <CopyRevenueDealSetting />}
                <QmTurnoverSetting />
                <fieldset className="tier-setting-group">
                    <legend><h6 className="font-weight-bold">Tier Rated Products Deduction</h6></legend>
                    <PlatformFeeSetting />

                    <p className="font-weight-bold pt-3">Banking Fee</p>
                    <FeeSettingItem label="+ Deposit Fee" basedValueName="Deposit"
                        handleChange={this.handleChangeDepositFee}
                        handleUpdateState={() => this.setState({ isInitialDepositFee: false })}
                        data={DepositFeeSetting}
                        defaultCurrency={defaultCurrency}
                        isInitial={isInitialDepositFee} />
                    <FeeSettingItem label="+ Withdrawal Fee" basedValueName="Withdrawal"
                        handleChange={this.handleChangeWithdrawalFee}
                        handleUpdateState={() => this.setState({ isInitialWithdrawalFee: false })}
                        data={WithdrawalFeeSetting}
                        defaultCurrency={defaultCurrency}
                        isInitial={isInitialWithdrawalFee} />
                </fieldset>
            </Fragment>
        )
    }
}

function mapStateToProp({ dealInfo, defaultCurrency }) {
    return { dealInfo, defaultCurrency };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setDealInfo }, dispatch);
}

export default connect(mapStateToProp, mapDispatchToProps)(RevenueShareInfo);