// 处理json5数据文件
module.exports = function() {
  return {
    test: /\.json5$/,
    use: 'json5-loader'
  };
};
