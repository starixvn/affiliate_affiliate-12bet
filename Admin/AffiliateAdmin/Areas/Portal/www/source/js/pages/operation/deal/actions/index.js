import * as types from './types';
import { toggleLoader } from '../../../../actions/loaderAction';
import { setPagingOption } from '../../../../actions/pagingAction';
import { post } from '../../../../modules/ajaxRequest';
import { formatDecimal } from '../../../../modules/numberFormat';
import { productGroupDefault } from '../libs/constants';
import { isCheckedField } from '../libs/service';

export { toggleLoader, setPagingOption };

export const setParam = (data) => {
    return {
        type: types.SET_PARAM,
        data
    };
}

export const setDealInfo = (data) => {
    return {
        type: types.SET_DEAL_INFO,
        data
    };
}

export const setGridData = (data) => {
    return {
        type: types.SET_GRID_DATA,
        data
    };
}

export const setIsSubmitted = (data) => {
    return {
        type: types.SET_IS_SUBMITTED,
        data
    };
}

export const setIsEdit = (data) => {
    return {
        type: types.SET_IS_EDIT,
        data
    };
}

export const fetchData = (param) => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/Operation/GetDeals';
    const response = await post(url, param);

    if (response && response.status === 200) {
        const data = response.data;
        dispatch(setGridData(data ? data.MainData : null));
        dispatch(setPagingOption({ TotalItem: data ? data.TotalItem : 0, PageIndex: param.PageIndex, PageSize: param.PageSize }));
    }

    dispatch(toggleLoader(false));
}

export const getDealDetail = (groupId) => async (dispatch) => {
    dispatch(toggleLoader(true));

    const url = 'Portal/Operation/GetDealDetail';
    const response = await post(url, { groupId });

    let data = response && response.status === 200 ? _buildDealInfo(response.data) : null;

    dispatch(setDealInfo(data));

    dispatch(toggleLoader(false));
}

const _buildDealInfo = (dealInfo) => {
    if (!dealInfo) {
        return null;
    }

    const {
        HoldingDays,
        HoldingTickets,
        Quota,
        RedepositRate,
        RedepositDays,
        ProductGroup,
        CPATierSetting,
        DepositFeeSetting,
        WithdrawalFeeSetting,
        ScheduleId,
        StartDate,
        StartDateString,
        ...rest
    } = dealInfo;

    const isActivePlayerHoldingPeriod = HoldingDays > 0 && HoldingTickets > 0;
    const isQuota = Quota > 0;
    const isRedeposit = RedepositRate > 0 && RedepositDays > 0;
    const productGroup = !ProductGroup || ProductGroup.length === 0 ? [productGroupDefault] : ProductGroup;

    const firstGroupProductId = productGroup?.[0]?.GroupProductId;
    const firstTier = CPATierSetting.filter(t => t.GroupProductId === firstGroupProductId);

    if (WithdrawalFeeSetting) {
        WithdrawalFeeSetting.DeductedAmount = WithdrawalFeeSetting.IsDeductedPercent
            ? ''
            : WithdrawalFeeSetting.DeductedAmount;
    }

    if (DepositFeeSetting) {
        DepositFeeSetting.DeductedAmount = DepositFeeSetting.IsDeductedPercent
            ? ''
            : DepositFeeSetting.DeductedAmount;
    }

    return {
        ...rest,
        RedepositRate: RedepositRate === 0 ? 0 : formatDecimal(RedepositRate * 100) || 0,
        RedepositDays: RedepositDays || 0,
        HoldingDays: HoldingDays || 0,
        HoldingTickets: HoldingTickets || 0,
        Quota: Quota || 0,
        ProductGroup: productGroup,
        CPATierSetting,
        DepositFeeSetting,
        WithdrawalFeeSetting,
        IsActivePlayerHoldingPeriod: isActivePlayerHoldingPeriod,
        IsQuota: isQuota,
        IsRedeposit: isRedeposit,
        CheckedMinFdm: isCheckedField(firstTier, 'MinFdm'),
        CheckedMinTotalDeposit: isCheckedField(firstTier, 'MinTotalDeposit'),
        CheckedMinTurnover: isCheckedField(firstTier, 'MinTO'),
        StartDate: StartDateString,
        ScheduleId
    };
};

export const addDeal = (param) => async () => {
    const url = 'Portal/Operation/AddDeal';
    return await post(url, param);
}

export const deleteDeal = (dealId) => async () => {
    const url = 'Portal/Operation/DeleteDeal';
    return await post(url, { dealId });
}

export const updateDeal = (param) => async () => {
    const url = 'Portal/Operation/UpdateDeal';
    return await post(url, param);
}