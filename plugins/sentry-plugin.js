const url = require('url');
const path = require('path');
const { getReleaseId } = require('./utils');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const sentryCliConfig = path.resolve(__dirname, '../sentry.properties');

// 通过sentry-cli上传sourcemap文件
module.exports = function(env, configs) {
  const appPkg = require(configs.appPackage) || {};
  const cdnPrefix = url.parse(configs.publicPath).pathname;
  const releaseId = getReleaseId(appPkg);

  if (env === 'development') return [];
  return [
    new SentryCliPlugin({
      include: configs.distDir,
      ignore: ['node_modules', 'webpack.config.js', '*.css.map'],
      configFile: sentryCliConfig,
      release: releaseId,
      urlPrefix: '~' + cdnPrefix,
    }),
  ];
};
