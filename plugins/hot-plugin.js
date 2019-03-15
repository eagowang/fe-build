const webpack = require('webpack');

// 仅本地开发模式，使用热替换插件
module.exports = function(env) {
  if (env !== 'development') return [];
  return [
    // 热替换
    new webpack.HotModuleReplacementPlugin(),
  ];
};
