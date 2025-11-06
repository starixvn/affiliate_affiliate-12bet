import { resolveClientUrl } from "../../../modules/utils"

export const menuKey = {
    affiliateReport: 'affiliateReport',
    playerGgrReport: 'playerGgrReport',
    transferReport: 'transferReport',
    affiliateCpaReport: 'affiliateCpaReport',
    playerCPA: 'playerCPA',
    paymentCpaManagement: 'paymentCpaManagement',
}

export const relativePath = {
    affiliateReport: resolveClientUrl('Portal/Report'),
    playerGgrReport: resolveClientUrl('Portal/PlayerGgrReport'),
    transferReport: resolveClientUrl('Portal/TransferReport'),
    affiliateCpaReport: resolveClientUrl('Portal/AffiliateCpaReport'),
    playerCPA: resolveClientUrl('Portal/PlayerCpaReport'),
    paymentCpaManagement: resolveClientUrl('Portal/PaymentCpaManagement'),
}

export const getMaxHeight = (isMultiRowFilters = false) => {
    const height = window.innerHeight - (isMultiRowFilters ? 325 : 295);
    return height > 300 ? height : 300;
}