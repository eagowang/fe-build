// 处理pug/jade模板文件
// 预编译pug/jade模板，require进来的将是编译后的模板函数
module.exports = function() {
  return {
    test: /\.(jade|pug)$/,
    use: [
      {
        loader: 'pug-loader',
        options: {
          pretty: true
        }
      }
    ]
  };
};
