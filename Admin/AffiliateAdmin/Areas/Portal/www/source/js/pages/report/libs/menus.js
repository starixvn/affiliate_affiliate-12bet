import React from 'react'
import { menuKey, relativePath } from './constants'
import { Claim, claimResource } from '../../../modules/claim';

const AffiliateReport = React.lazy(() => import(/* webpackChunkNamw: 'affiliateReport'*/ '../affiliate-report/index'))
const PlayerGgrReport = React.lazy(() => import(/* webpackChunkNamw: 'playerGgrReport'*/ '../player-ggr-report/index'))
const TransferReport = React.lazy(() => import(/* webpackChunkNamw: 'transferReport'*/ '../transfer-report/index'))
const AffiliateCpaReport = React.lazy(() => import(/* webpackChunkNamw: 'affiliateCpaReport'*/ '../affiliate-cpa-report/index'))
const PlayerCPA = React.lazy(() => import(/* webpackChunkNamw: 'playerCPA'*/ '../player-cpa/index'))
const PaymentCpaManagement = React.lazy(() => import(/* webpackChunkNamw: 'paymentCpaManagement'*/ '../payment-cpa-management/index'))

export const menus = [
    { key: menuKey.affiliateReport, label: 'Affiliate', href: relativePath.affiliateReport, component: AffiliateReport, renderClaim: new Claim(claimResource.AffReport) },
    { key: menuKey.playerGgrReport, label: 'Player GGR', href: relativePath.playerGgrReport, component: PlayerGgrReport, renderClaim: new Claim(claimResource.AffReport) },
    { key: menuKey.affiliateCpaReport, label: 'Affiliate CPA', href: relativePath.affiliateCpaReport, component: AffiliateCpaReport, renderClaim: new Claim(claimResource.DisabledFunction) },
    { key: menuKey.playerCPA, label: 'Player CPA', href: relativePath.playerCPA, component: PlayerCPA, renderClaim: new Claim(claimResource.AffReport) },
    { key: menuKey.transferReport, label: 'Transfer Balance For Player', href: relativePath.transferReport, component: TransferReport, renderClaim: new Claim(claimResource.TransferPlayerReport) },
    { key: menuKey.paymentCpaManagement, label: 'Payment CPA Management', href: relativePath.paymentCpaManagement, component: PaymentCpaManagement, renderClaim: new Claim(claimResource.AffReport) },
]