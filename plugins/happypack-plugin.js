const HappyPack = require('happypack');
const tsImportPluginFactory = require('ts-import-plugin');
const babelrc = require('../babel.config');
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
// hackpack加速代码构建
module.exports = function(env, configs) {
  return new HappyPack(
    {
      // 用id标识处理哪类文件
      id: 'jsx',
      threadPool: happyThreadPool,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: env === 'development',
            ...babelrc(env, configs),
          },
        },
      ],
    },
    {
      id: 'tsx',
      threadPool: happyThreadPool,
      loaders: [
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
    }
  );
};
