// 处理图片（css background图片、img require图片）
// 小于8k的图片，将会被转成base64 code
module.exports = function() {
  return {
    test: /\.(jpg|png|gif|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[hash:10].[ext]'
        }
      }
    ]
  };
};
