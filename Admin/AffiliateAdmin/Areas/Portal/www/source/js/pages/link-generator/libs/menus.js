import React from 'react'
import { Claim, claimResource } from '../../../modules/claim';
import { menuKey, relativePath } from '../libs/constants';

const GenerateLink = React.lazy(() => import('../pages/generate-link/index'));
const LinkManagement = React.lazy(() => import('../pages/link-management/index'));

export const menus = [
    { key: menuKey.generateLink, label: 'Generate Link', href: relativePath.generateLink, component: GenerateLink, renderClaim: new Claim(claimResource.LinkGenerator) },
    { key: menuKey.linkManagement, label: 'Link Management', href: relativePath.linkManagement, component: LinkManagement, renderClaim: new Claim(claimResource.LinkGenerator) },
]
