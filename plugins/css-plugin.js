const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 剥离js-in-css到assets/styles / 输出目录中
// 试和生产环境将会带上md5 hash
module.exports = function(env) {
  return new MiniCssExtractPlugin({
    filename: `[name]${env === 'development' ? '' : '.[contenthash:10]'}.css`,
    chunkFilename:
      env === 'development ' ? '[id].css' : '[id].[contenthash:10].css',
  });
};
