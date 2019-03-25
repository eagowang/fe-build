// 编译less、后处理、剥离js-in-css
// 后处理将会调用本目录下的p`ostcss.config.js`配置
// 默认包含的后处理包括：`autoprefixer` `cssnano` `css-sprites`
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(env, configs) {
  const isDev = env === 'development';
  return {
    test: /\.less$/,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve(__dirname, '../postcss.config.js'),
            ctx: { env, configs },
          },
        },
      },
      {
        loader: 'less-loader',
        options: {
          javascriptEnabled: 1,
        },
      },
    ],
  };
};
