// 文件拷贝
module.exports = function() {
  return [
    // 处理字体资源
    {
      test: /\.(eot|ttf|woff)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:10].[ext]',
          },
        },
      ],
    },

    // 处理音频资源
    {
      test: /\.(wav|mp3)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:10].[ext]',
          },
        },
      ],
    },

    // 处理视频资源
    {
      test: /\.(mp4)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:10].[ext]',
          },
        },
      ],
    },
  ];
};
