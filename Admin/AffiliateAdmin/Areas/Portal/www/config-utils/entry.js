const { projectPath } = require("./constant");

const jsDist = projectPath.relativeOutputPath + "/js";
const styleDist = projectPath.relativeOutputPath + "/style";

const clientRoot = projectPath.clientInputPath;

module.exports = {
    [`${jsDist}/pages/report`]: clientRoot + "/js/pages/report/index.jsx",
    [`${jsDist}/pages/affiliate/affiliate-info`]: clientRoot + "/js/pages/affiliate-info/index.jsx",
    [`${jsDist}/pages/affiliate/marketing-account`]: clientRoot + "/js/pages/marketing-account/index.jsx",
    [`${jsDist}/pages/affiliate/email-history`]: clientRoot + "/js/pages/email-history/index.jsx",
    [`${jsDist}/pages/payment/payment-request`]: clientRoot + "/js/pages/payment-request/index.jsx",
    [`${jsDist}/pages/customer/customer`]: clientRoot + "/js/pages/customer/index.jsx",
    [`${jsDist}/pages/message/message`]: clientRoot + "/js/pages/message/index.jsx",
    [`${jsDist}/pages/member/member-list`]: clientRoot + "/js/pages/member/member-list/index.jsx",
    [`${jsDist}/pages/login`]: clientRoot + "/js/pages/login/index.jsx",
    [`${jsDist}/pages/under-maintenance`]: clientRoot + "/js/pages/under-maintenance/index.jsx",
    [`${jsDist}/pages/change-admin-password`]: clientRoot + "/js/pages/change-admin-password/index.jsx",
    [`${jsDist}/pages/administrator/administrator`]: clientRoot + "/js/pages/administrator/administrator/index.jsx",
    [`${jsDist}/pages/administrator/department`]: clientRoot + "/js/pages/administrator/department/index.jsx",
    [`${jsDist}/pages/home`]: clientRoot + "/js/pages/home/index.jsx",
    [`${jsDist}/pages/operation/deal`]: clientRoot + "/js/pages/operation/index.jsx",
    [`${jsDist}/pages/operation/assign-deal`]: clientRoot + "/js/pages/operation/assign-deal/index.jsx",

    //Media Gallery
    [`${jsDist}/pages/media-gallery/media-gallery`]: clientRoot + "/js/pages/media-gallery/index.jsx",
    [`${styleDist}/pages/media-gallery/landing-page`]: clientRoot + "/style/pages/media-gallery/landing-page.scss",
    [`${styleDist}/pages/media-gallery/banner-list`]: clientRoot + "/style/pages/media-gallery/banner-list.scss",

    //Landing Page
    [`${jsDist}/pages/landing-page`]: clientRoot + "/js/pages/landing-page/index.jsx",
    [`${styleDist}/pages/landing-page`]: clientRoot + "/style/pages/landing-page.scss",

    //Campaign Management
    [`${jsDist}/pages/campaign-management`]: clientRoot + "/js/pages/campaign-management/index.jsx",
    [`${styleDist}/pages/campaign-management`]: clientRoot + "/style/pages/campaign-management.scss",

    [`${jsDist}/pages/asset-modification`]: clientRoot + "/js/pages/asset-modification/index.jsx",
    [`${styleDist}/pages/asset-modification`]: clientRoot + "/style/pages/asset-modification.scss",
    [`${jsDist}/pages/link-generator`]: clientRoot + "/js/pages/link-generator/index.jsx",
    [`${styleDist}/pages/link-generator`]: clientRoot + "/style/pages/link-generator.scss",

    //Domain
    [`${jsDist}/pages/domain`]: clientRoot + "/js/pages/domain/index.jsx",
    [`${styleDist}/pages/domain`]: clientRoot + "/style/pages/domain.scss",

    [`${styleDist}/portalmain`]: clientRoot + "/style/main.scss",
    [`${styleDist}/layout`]: clientRoot + "/style/layout/main-layout.scss",
    [`${styleDist}/user-panel-layout`]: clientRoot + "/style/layout/user-panel-layout.scss",
    [`${styleDist}/pages/report`]: clientRoot + "/style/pages/report/index.scss",
    [`${styleDist}/pages/affiliate-info`]: clientRoot + "/style/pages/affiliate-info.scss",
    [`${styleDist}/pages/email-history`]: clientRoot + "/style/pages/email-history.scss",
    [`${styleDist}/pages/payment/payment-request`]: clientRoot + "/style/pages/payment/payment-request.scss",
    [`${styleDist}/pages/customer`]: clientRoot + "/style/pages/customer/main.scss",
    [`${styleDist}/pages/message/message`]: clientRoot + "/style/pages/message/message.scss",
    [`${styleDist}/login`]: clientRoot + "/style/pages/login.scss",
    [`${styleDist}/under-maintenance`]: clientRoot + "/style/pages/under-maintenance.scss",
    [`${styleDist}/change-admin-password`]: clientRoot + "/style/pages/change-admin-password.scss",
    [`${styleDist}/pages/member/member-list`]: clientRoot + "/style/pages/member/member-list.scss",
    [`${styleDist}/pages/administrator/administrator`]: clientRoot + "/style/pages/administrator/administrator.scss",
    [`${styleDist}/pages/administrator/department`]: clientRoot + "/style/pages/administrator/department.scss",
    [`${styleDist}/home`]: clientRoot + "/style/pages/home.scss",
    [`${styleDist}/12bet`]: clientRoot + "/style/themes/12bet.scss",
    [`${styleDist}/pages/marketing-account`]: clientRoot + "/style/pages/marketing-account/index.scss",
    [`${styleDist}/pages/operation/deal`]: clientRoot + "/style/pages/operation/deal.scss",
};