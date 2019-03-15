const path = require('path');
const webpack = require('webpack');

module.exports = function(env, configs) {
  return new webpack.LoaderOptionsPlugin({
    minimize: env !== 'development',
    debug: env === 'development',
    options: {
      context: path.resolve(configs.srcDir, '../'),
    },
  });
};
