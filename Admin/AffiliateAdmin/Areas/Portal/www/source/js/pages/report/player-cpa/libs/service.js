
import { get, post } from '../../../../modules/ajaxRequest';
import { minDate } from '../../../../modules/constants';
import { formatDecimal } from '../../../../modules/numberFormat';
import { decimalFields, dateFields } from './constants';

export const getPlayerCpaData = async (params) => {
    const url = 'Portal/PlayerCpaReport/GetData';

    const response = await post(url, params);

    return response && response.status === 200 ? transformData(response.data) : null;
}

const transformData = (data) => {
    const transformDecimal = (value) =>
        value == null ? '-' : formatDecimal(value);

    const transformField = (key, value) =>
        decimalFields.includes(key) ? transformDecimal(value) : (value ?? '-');

    const transformData = data.mainData.map(item =>
        Object.fromEntries(
            Object.entries(item).map(([key, value]) => [key, transformField(key, value)])
        )
    );

    return {
        ...data,
        mainData: transformData
    };
};

export const getTurnoverDetail = async (memberCpaId) => {
    const url = `Portal/PlayerCpaReport/GetTurnoverDetail?memberCpaId=${memberCpaId}`;
    const response = await get(url);

    return response && response.status === 200 ? response.data : null;
}

export const paginate = (list, pageIndex, pageSize) => {
    if (!list) {
        return [];
    }

    const start = (pageIndex - 1) * pageSize;
    const end = pageIndex * pageSize;
    return list.slice(start, end);
};

export const sortBy = (list, prop = 'affUserName', isAscending = true) => {
    if (!list) return [];

    const normalizer = getNormalizer(prop);

    return [...list].sort((a, b) => {
        const valueA = normalizer(a[prop]);
        const valueB = normalizer(b[prop]);

        if (valueA < valueB) return isAscending ? -1 : 1;
        if (valueA > valueB) return isAscending ? 1 : -1;
        return 0;
    });
};

const getNormalizer = (prop) => {
    if (decimalFields.includes(prop)) {
        return (val) => val === '-' ? 0 : Number(String(val).replace(/,/g, ''));
    }
    if (dateFields.includes(prop)) {
        return (val) => {
            if (val === '-') return minDate;
            const d = new Date(val);
            return isNaN(d) ? minDate : d;
        };
    }
    return (val) => val ?? '';
};