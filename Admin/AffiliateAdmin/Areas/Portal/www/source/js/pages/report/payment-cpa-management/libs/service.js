import { post } from '../../../../modules/ajaxRequest';
import { headerConfigs } from './constants';
import { SingleHeaderColumn, AggregateHeaderColumn, HeaderRow } from './headerConfigs';

export const getPaymentCpaManagementData = async (params, isExportExcel = false) => {
    const url = 'Portal/PaymentCpaManagement/GetData';

    if (isExportExcel) {
        params = { ...params, isExportExcel };
    }

    const response = await post(url, params);

    return response && response.status === 200 ? response.data : null;
}

export const buildHeader = (isAdjustable) => {
    const headerKeys = Object.keys(headerConfigs).filter(key => {
        const fn = headerConfigs[key].isShowable;
        return typeof fn !== 'function' || fn(false, isAdjustable);
    });

    const cols = [];
    headerKeys.forEach(key => {
        if (!!headerConfigs[key].cols) {
            cols.push(_buildAggregateHeaderCol(key, headerConfigs[key]));
        } else {
            cols.push(_buildSingleHeaderCol(key, headerConfigs[key]));
        }
    });

    return new HeaderRow(cols, 0);
}

const _buildSingleHeaderCol = (key, item) => {
    return new SingleHeaderColumn(key, item.label, true, item.width);
}

const _buildAggregateHeaderCol = (key, header) => {
    const cols = [];
    const headerCols = header.cols;
    const headerKeys = Object.keys(headerCols);

    headerKeys.forEach(colKey => {
        if (!!headerCols[colKey].cols) {
            cols.push(_buildAggregateHeaderCol(colKey, headerCols[colKey]));
        } else {
            cols.push(_buildSingleHeaderCol(colKey, headerCols[colKey]));
        }
    });

    return new AggregateHeaderColumn(key, header.label, cols, header.width);
}

export const groupData = (data) => {
    const grouped = {};

    let index = 0;
    data.forEach(item => {
        const key = `${item.AffUserName}_${item.DealName}`;

        if (!grouped[key]) {
            index++;
            grouped[key] = {
                AffUserName: item.AffUserName,
                DealName: item.DealName,
                subEntries: []
            };
        }

        grouped[key].subEntries.push({ ...item, RowIdx: index });
    });

    return Object.values(grouped);
};