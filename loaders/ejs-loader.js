// 处理ejs模版文件
// 预编译ejs模版，require进来的将是编译后的模板函数
module.exports = function() {
  return {
    test: /\.(ejs|tpl)$/,
    use: 'ejs-loader'
  };
};
