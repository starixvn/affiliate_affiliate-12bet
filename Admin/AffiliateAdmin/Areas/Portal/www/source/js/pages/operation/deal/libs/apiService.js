import { post } from '../../../../modules/ajaxRequest';

export const getDealDetailInfo = async (groupId) => {
    const url = "Portal/Operation/GetDealDetail";
    return await post(url, { groupId });
};

export const getRevenueDealList = async () => {
    const url = "Portal/Operation/GetRevenueDealList";
    const { data } = await post(url);
    return data ?? null;
};