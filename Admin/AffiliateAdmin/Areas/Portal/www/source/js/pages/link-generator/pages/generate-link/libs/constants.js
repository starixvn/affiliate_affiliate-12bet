import { globalResource } from '@/modules/globalResource';

export { globalResource };

export const restrictedCharactersPattern = /[;\/\?:@=&"<>#%{}\|\\^~\[\]`\s+]/;

export const pageBuilderLabels = {
    campaignName: 'Campaign Name',
    targetCountry: 'Target Country',
    language: 'Language',
    deal: 'Deal',
    pageName: 'Page Name',
    pageCode: 'Page Code',
    status: 'Status',
    moduleComponents: 'Module Components',
    orderId: 'Order',
    module: 'Module',
    source: 'Source',
    preview: 'Preview',
    create: 'Create',
    update: 'Update',
    reset: 'Reset',
    copyLink: 'Copy Link',
    add: 'Add +',
    remove: 'Remove'
};