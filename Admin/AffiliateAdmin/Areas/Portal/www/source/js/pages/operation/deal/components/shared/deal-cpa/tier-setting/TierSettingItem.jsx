import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormGroup, Col, Form, Label, Input } from 'reactstrap';

import MultipleSelect from '../../../../../../../components/multiple-select';
import TierSettingDataItem from './TierSettingDataItem';
import NotificationPopup from '../../../../../../common/components/NotificationPopup';

import { setDealInfo } from '../../../../actions';
import { deepClone } from '../../../../../../../modules/dataHandler';
import { cpaTierSettingTitle } from '../../../../libs/constants';

export const TierSettingItem = (props) => {
    const { tierSetting, isFirstItem, index, dealInfo, isModifiable } = props;
    const { ProductGroup, TierSetting } = tierSetting;

    const [message, setMessage] = useState('');
    const [isConfirmPopup, setIsConfirmPopup] = useState(true);

    const _handleCloseNotificationPopup = (confirmResult) => {
        setMessage('');

        if (confirmResult) {
            _handleDisableMinTurnover();
        }
    }

    const _handleDisableMinTurnover = () => {
        const firstGroupProductId = dealInfo.ProductGroup[0].GroupProductId;

        const newGroupProduct = dealInfo.ProductGroup.find(p => p.GroupProductId === firstGroupProductId);
        newGroupProduct.ProductIds = '';

        const newTierSetting = dealInfo.CPATierSetting.filter(t => t.GroupProductId === firstGroupProductId);
        const resetTierSetting = newTierSetting.map(t => ({ ...t, MinTO: 0 }));

        props.setDealInfo({
            ProductGroup: [newGroupProduct],
            CPATierSetting: resetTierSetting,
            CheckedMinTurnover: false
        });
    }

    const _handleAddTier = () => {
        if (!dealInfo.CheckedMinTurnover) {
            return;
        }

        const firstGroupProductId = dealInfo.ProductGroup[0].GroupProductId;
        const lastGroupProductId = dealInfo.ProductGroup[dealInfo.ProductGroup.length - 1].GroupProductId;
        const firstTierItem = dealInfo.CPATierSetting.find(t => t.GroupProductId === firstGroupProductId && t.TierId === 1);

        const newProductGroup = {
            ProductIds: '',
            GroupProductId: lastGroupProductId + 1,
        }
        const newTierItem = {
            TierId: 1,
            GroupProductId: lastGroupProductId + 1,
            MinFdm: firstTierItem.MinFdm,
            MinTotalDeposit: firstTierItem.MinTotalDeposit,
            MinTO: 0,
            CpaAmount: 1
        }

        props.setDealInfo({
            CPATierSetting: [...props.dealInfo.CPATierSetting, newTierItem],
            ProductGroup: [...props.dealInfo.ProductGroup, newProductGroup]
        });
    }

    const _handleDeleteTier = (groupProductId) => {
        props.setDealInfo({
            CPATierSetting: dealInfo.CPATierSetting.filter(t => t.GroupProductId !== groupProductId),
            ProductGroup: dealInfo.ProductGroup.filter(p => p.GroupProductId !== groupProductId)
        });
    }

    const _handleCheck = (e) => {
        const { name, checked } = e.target;

        const propMap = {
            CheckedMinFdm: 'MinFdm',
            CheckedMinTotalDeposit: 'MinTotalDeposit',
        };

        const tierField = propMap[name];
        const newDealInfo = { [name]: checked };

        if (!checked && tierField) {
            newDealInfo.CPATierSetting = dealInfo.CPATierSetting.map(tier => ({
                ...tier,
                [tierField]: 0,
            }));
        }

        props.setDealInfo(newDealInfo);
    };

    const _handleSelect = (item, selectedItem) => {
        const isSelecting = !!item || (selectedItem !== '');

        const productGroup = deepClone(dealInfo.ProductGroup);

        let updatedIds = [];

        if (isSelecting) {
            updatedIds = [...selectedItem.split(',').filter(Boolean)];
        }

        productGroup[index].ProductIds = updatedIds.length > 0 ? updatedIds.join(',') : '';

        props.setDealInfo({ ProductGroup: productGroup });
    };

    const _handleCheckMinTurnover = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            props.setDealInfo({ [name]: true });
            return;
        }

        const message = 'Unchecking for Min Turnover will remove all data from additional Product Groups, if present. Only the first Product Group will be retained.</br>Do you want to proceed?'
        setMessage(message);
        setIsConfirmPopup(true);
    };

    const _buildHeader = () => {
        return (
            <tr>
                <th style={{ width: '10%' }}>Tier</th>
                <th style={{ width: '28%' }}>
                    {isFirstItem
                        ? <Form inline>
                            <FormGroup check className="mx-sm-1">
                                <Label check>
                                    <Input type="checkbox" name="CheckedMinFdm" id="CheckedMinFdm" checked={dealInfo.CheckedMinFdm} onChange={_handleCheck} disabled={!isModifiable} />
                                </Label>
                            </FormGroup>
                            <Label htmlFor="CheckedMinFdm">{cpaTierSettingTitle.MinFdm}</Label>
                        </Form>
                        : cpaTierSettingTitle.MinFdm
                    }
                </th>
                <th style={{ width: '30%' }}>
                    {isFirstItem ?
                        <Form inline>
                            {isFirstItem &&
                                <FormGroup check className="mx-sm-1">
                                    <Label check>
                                        <Input type="checkbox" name="CheckedMinTotalDeposit" id="CheckedMinTotalDeposit" checked={dealInfo.CheckedMinTotalDeposit} onChange={_handleCheck} disabled={!isModifiable} />
                                    </Label>
                                </FormGroup>
                            }
                            <Label htmlFor="CheckedMinTotalDeposit">{cpaTierSettingTitle.MinTotalDeposit}</Label>
                        </Form>
                        : cpaTierSettingTitle.MinTotalDeposit
                    }
                </th>
                <th style={{ width: '30%' }}>
                    {isFirstItem ?
                        <Form inline>
                            {isFirstItem &&
                                <FormGroup check className="mx-sm-1">
                                    <Label check>
                                        <Input type="checkbox" disabled={!isModifiable} name="CheckedMinTurnover" id="CheckedMinTurnover" checked={dealInfo.CheckedMinTurnover} onChange={_handleCheckMinTurnover} />
                                    </Label>
                                </FormGroup>
                            }
                            <Label htmlFor="CheckedMinTurnover">{cpaTierSettingTitle.MinTO}</Label>
                        </Form>
                        : cpaTierSettingTitle.MinTO
                    }
                </th>
                <th style={{ width: '20%' }}>{cpaTierSettingTitle.CpaAmount}</th>
                <th style={{ width: '12%' }}>{cpaTierSettingTitle.Action}</th>
            </tr>
        )
    }

    const isValid =
        !dealInfo.CheckedMinTurnover ||
        !props.isSubmitted ||
        ProductGroup.some(p => p.Checked);

    return (
        <div>
            <FormGroup row className="align-items-center my-2">
                <Col sm={3}>
                    <span className="group-index">{index + 1}.</span>
                    <div className={`select-product ${isValid ? '' : 'is-invalid'}`}>
                        <MultipleSelect
                            dataSource={ProductGroup}
                            keyField="ProductId"
                            valueField="ProductName"
                            statusField="Checked"
                            isDisableItemField="IsDisabledItem"
                            hasAllOption={true}
                            hasInputOption={true}
                            maxDisplayItemCount={1}
                            noneSelectedLabel={!dealInfo.CheckedMinTurnover ? 'None' : 'Please Select'}
                            selectedAllLabel="All Products"
                            onChange={_handleSelect}
                            isDisable={!dealInfo.CheckedMinTurnover} />
                    </div>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col sm={11}>
                    <table className='table table-bordered table-striped'>
                        <thead>
                            {_buildHeader()}
                        </thead>
                        <tbody>
                            {TierSetting && TierSetting.map((tier, index) => (
                                <TierSettingDataItem
                                    tierSetting={TierSetting}
                                    isFirstItem={isFirstItem}
                                    tier={tier}
                                    index={index} />
                            ))}
                        </tbody>
                    </table>
                </Col>
                <Col sm={1} className='pl-0'>
                    {isFirstItem
                        ? <button disabled={!dealInfo.CheckedMinTurnover} className="btn btn-action" onClick={_handleAddTier}>Add +</button>
                        : <button className="btn btn-action" onClick={() => _handleDeleteTier(TierSetting[0].GroupProductId)}>
                            <span className="oi oi-trash text-secondary"></span>
                        </button>}
                </Col>
            </FormGroup>
            {
                !!message && <NotificationPopup
                    message={message}
                    isConfirmPopup={isConfirmPopup}
                    onClose={_handleCloseNotificationPopup}
                />
            }
        </div>
    );
};

const mapStateToProps = ({ dealInfo, isSubmitted, isEdit, isModifiable }) => {
    return {
        dealInfo,
        isSubmitted,
        isEdit,
        isModifiable
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setDealInfo
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TierSettingItem));