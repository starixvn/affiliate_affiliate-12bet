import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Input } from 'reactstrap';

import { FIRST_ITEM_INDEX, INFINITY_MONEY } from '../../../../libs/constants';
import { setDealInfo } from '../../../../actions';
import { format } from '../../../../../../../modules/numberFormat';
import { isValidNumber } from '../../../../../../../modules/utils';

export const TierSettingDataItem = ({ tierSetting, isFirstItem, tier, index, dealInfo, setDealInfo, isSubmitted }) => {
    const isFirstTier = index === FIRST_ITEM_INDEX;

    const parseValue = (value) => Number(value.replace(/,/g, ''));

    const getValidatedValue = (rawValue, numericValue, oldValue, emptyFallback = 0) => {
        if (rawValue === '') {
            return emptyFallback;
        }

        if (numericValue >= 0 && numericValue < INFINITY_MONEY && isValidNumber(numericValue)) {
            return numericValue;
        }

        return oldValue;
    };

    const updateTierSetting = (conditionFn, updateFn) => {
        const newTierSetting = dealInfo.CPATierSetting.map(t =>
            conditionFn(t) ? updateFn(t) : t
        );
        setDealInfo({ CPATierSetting: newTierSetting });
    };

    const _handleChangeValue = (e, tierId) => {
        const { name, value } = e.target;
        const numericValue = parseValue(value);
        const oldValue = tier[name];

        const newValue = getValidatedValue(value, numericValue, oldValue, 0);

        if (isFirstItem) {
            const currentTierIndex = tierSetting.findIndex(s => s.TierId === tierId);

            const newTierSetting = dealInfo.CPATierSetting.map(t => {
                if (t.GroupProductId === tier.GroupProductId && t.TierId === tierId) {
                    return { ...t, [name]: newValue };
                }

                if (t.GroupProductId !== tier.GroupProductId) {
                    const updatedTierSetting = dealInfo.CPATierSetting.filter(c => c.GroupProductId === t.GroupProductId);
                    const updateTierItemIndex = updatedTierSetting.findIndex(c => c.TierId === t.TierId);

                    if (updateTierItemIndex !== -1 && updateTierItemIndex === currentTierIndex && updatedTierSetting[updateTierItemIndex][name] === tierSetting[currentTierIndex][name]) {
                        return { ...t, [name]: newValue };
                    }
                }

                return t;
            });

            setDealInfo({ CPATierSetting: newTierSetting });
        }
    };

    const _handleChangeMinTurnover = (e, groupProductId, tierId) => {
        const { name, value } = e.target;
        const numericValue = parseValue(value);
        const oldValue = tier[name];

        const newValue = getValidatedValue(value, numericValue, oldValue, 0);

        updateTierSetting(
            (t) => t.GroupProductId === groupProductId && t.TierId === tierId,
            (t) => ({ ...t, [name]: newValue })
        );
    };

    const _handleChangeCpaAmount = (e, groupProductId, tierId) => {
        const { name, value } = e.target;
        const numericValue = parseValue(value);
        const oldValue = tier[name];

        const newValue = getValidatedValue(value, numericValue, oldValue, 0);

        updateTierSetting(
            (t) => t.GroupProductId === groupProductId && t.TierId === tierId,
            (t) => ({ ...t, [name]: newValue })
        );
    };

    const _handleAddTierItem = (groupProductId) => {
        const { CheckedMinFdm, CheckedMinTotalDeposit, CheckedMinTurnover } = dealInfo;

        const lastTier = tierSetting[tierSetting.length - 1];

        let minFdm = 0;
        let minTotalDeposit = 0;
        let minTO = lastTier.MinTO + 1;

        if (isFirstItem) {
            minFdm = CheckedMinFdm ? lastTier.MinFdm + 1 : 0;
            minTotalDeposit = CheckedMinTotalDeposit ? lastTier.MinTotalDeposit + 1 : 0;
            minTO = CheckedMinTurnover ? lastTier.MinTO + 1 : 0;
        } else {
            const firstGroupProductId = dealInfo.ProductGroup[0].GroupProductId;
            const firstTierList = dealInfo.CPATierSetting.filter(
                t => t.GroupProductId === firstGroupProductId
            );
            const nextTier = firstTierList[tierSetting.length];

            minFdm = nextTier
                ? nextTier.MinFdm
                : CheckedMinFdm
                    ? lastTier.MinFdm + 1
                    : 0;

            minTotalDeposit = nextTier
                ? nextTier.MinTotalDeposit
                : CheckedMinTotalDeposit
                    ? lastTier.MinTotalDeposit + 1
                    : 0;
        }

        const newTierItem = {
            TierId: lastTier.TierId + 1,
            GroupProductId: isFirstItem ? lastTier.GroupProductId : groupProductId,
            MinFdm: minFdm,
            MinTotalDeposit: minTotalDeposit,
            MinTO: minTO,
            CpaAmount: lastTier.CpaAmount + 1
        };

        setDealInfo({
            CPATierSetting: [...dealInfo.CPATierSetting, newTierItem]
        });
    };

    const _handleDeleteTierItem = (groupProductId, tierId) => {
        setDealInfo({
            CPATierSetting: dealInfo.CPATierSetting.filter(t => t.GroupProductId !== groupProductId || t.TierId !== tierId)
        });
    }

    const _getErrorClass = (value, checkedField = true, defaultValue = 1) => {
        if (isSubmitted && checkedField) {
            return Number.isNaN(value) || value < defaultValue || value >= INFINITY_MONEY ? 'has-error' : '';
        }

        return '';
    }

    return (
        <tr key={index}>
            <td className="text-center">{index + 1}</td>
            <td className="text-center">
                <Input
                    className={_getErrorClass(tier.MinFdm, isFirstItem && dealInfo.CheckedMinFdm)}
                    disabled={!isFirstItem || !dealInfo.CheckedMinFdm}
                    type="text"
                    name="MinFdm"
                    id={"MinFdm" + tier.TierId}
                    value={format(tier.MinFdm)}
                    onChange={(e) => _handleChangeValue(e, tier.TierId)}
                />
            </td>
            <td className="text-center">
                <Input
                    className={_getErrorClass(tier.MinTotalDeposit, isFirstItem && dealInfo.CheckedMinTotalDeposit)}
                    disabled={!isFirstItem || !dealInfo.CheckedMinTotalDeposit}
                    type="text"
                    name="MinTotalDeposit"
                    id={"MinTotalDeposit" + tier.TierId}
                    value={format(tier.MinTotalDeposit)}
                    onChange={(e) => _handleChangeValue(e, tier.TierId)}
                />
            </td>
            <td className="text-center">
                <Input
                    className={_getErrorClass(tier.MinTO, dealInfo.CheckedMinTurnover)}
                    disabled={!dealInfo.CheckedMinTurnover}
                    type="text"
                    name="MinTO"
                    id={"MinTO" + tier.TierId}
                    value={format(tier.MinTO)}
                    onChange={(e) => _handleChangeMinTurnover(e, tier.GroupProductId, tier.TierId)}
                />
            </td>
            <td className="text-center">
                <Input
                    className={_getErrorClass(tier.CpaAmount, true, 0)}
                    type="text"
                    name="CpaAmount"
                    id={"CpaAmount" + tier.TierId}
                    value={format(tier.CpaAmount)}
                    onChange={(e) => _handleChangeCpaAmount(e, tier.GroupProductId, tier.TierId)}
                />
            </td>
            <td className="text-center">
                {isFirstTier
                    ? <button className="btn btn-tier" onClick={() => _handleAddTierItem(tier.GroupProductId)}>+</button>
                    : <button className="btn btn-tier" onClick={() => _handleDeleteTierItem(tier.GroupProductId, tier.TierId)}>-</button>}
            </td>
        </tr>
    )
}

const mapStateToProps = ({ dealInfo, isSubmitted }) => {
    return {
        dealInfo,
        isSubmitted
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ setDealInfo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(TierSettingDataItem));