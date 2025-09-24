import { resolveClientUrl } from "../../../modules/utils";
import { globalResource } from "../../../modules/globalResource";
import { defaultInsertId } from "../../../modules/constants";

export { globalResource, defaultInsertId };

export const menuKey = {
    generateLink: 'generateLink',
    linkManagement: 'linkManagement'
}

export const relativePath = {
    generateLink: resolveClientUrl('Portal/LinkGenerator'),
    linkManagement: resolveClientUrl('Portal/LinkManagement'),
}