const path = require('path');

const babelrc = require('../babel.config');

// babel转译ES6/7/8、React、jsx
module.exports = function(env, configs) {
  return {
    test: /\.jsx?$/,
    exclude: /node_modules\/(?!@fe\/)/,
    include: [
      configs.srcDir,
      path.resolve(configs.srcDir, '../node_modules/@fe'),
      ...configs.loaderInclude,
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: env === 'development',
          ...babelrc(env, configs),
        },
      },
    ],
  };
};
