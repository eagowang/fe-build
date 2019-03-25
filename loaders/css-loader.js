const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(env, configs) {
  const isDev = env === 'development';
  return {
    test: /\.css$/,
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
    ],
  };
};
