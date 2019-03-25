const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');
const babelrc = require('../babel.config');

// 编译typescript
module.exports = function(env, configs) {
  return {
    test: /\.tsx?$/,
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
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers() {
            return {
              before: [tsImportPluginFactory({ style: true })],
            };
          },
          compilerOptions: {
            module: 'es2015',
          },
        },
      },
    ],
  };
};
