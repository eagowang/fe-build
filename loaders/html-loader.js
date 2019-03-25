// 处理html文件
module.exports = function() {
  return {
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
        options: {
          minimize: true,
          removeComments: true,
          collapseWhitespace: true,
        },
      },
    ],
  };
};
