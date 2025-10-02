const merge = require("webpack-merge");

const { environment } = require("./config-utils/constant");
const config = require("./webpack.config");

const { projectPath } = require("./config-utils/constant");

const jsDist = projectPath.relativeOutputPath + "/js";
const styleDist = projectPath.relativeOutputPath + "/style";

const clientRoot = projectPath.clientInputPath;

const devConfig = config(environment.development)[0];

devConfig.entry = {
    //Campaign Management
    [`${jsDist}/pages/link-management`]: clientRoot + "/js/pages/link-management/index.jsx",
    [`${styleDist}/pages/link-management`]: clientRoot + "/style/pages/link-management.scss",
}

module.exports = devConfig;