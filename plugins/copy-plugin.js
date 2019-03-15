const CopyWebpackPlugin = require('copy-webpack-plugin');

// 复制指定的文件到输出目录中
// 一般是用来复制没有被显示require的资源
module.exports = function(env, configs) {
  return new CopyWebpackPlugin(configs.copy);
};
