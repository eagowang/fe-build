/**
 * React SSR
 * 打包服务端渲染的React模块
 * @author luoying<luoying@szzbmy.com>
 * @since 18/07/31
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * 配置webpack
 * @param  {Object} configs 配置项，见下面的说明
 * @return {Webpack}        返回Webpack对象
 */
module.exports = function(fn) {
  /**
   * 返回Webpack对象
   * @return {object}       返回详细的webpack配置列表
   */
  return () => {
    // env只有 development 或 production
    const env = process.env.NODE_ENV;
    if (!env) throw new Error('找不到NODE_ENV环境变量');

    const isDev = env === 'development';

    // 调用业务项目的配置函数
    // 返回业务项目的配置列表
    let configs = fn(env, webpack);

    // 整合业务项目配置列表
    configs = {
      // 应用入口，支持多入口
      entry: configs.entry || {},

      // 源代码目录，完整的绝对路径
      srcDir: configs.srcDir,

      // production构建输出目录，完整的绝对路径
      distDir: configs.distDir,

      // 发布配置
      publicPath: configs.publicPath,

      // 是否是动态publicPath，默认是true
      isDynamicPublicPath: configs.isDynamicPublicPath !== false,

      // 模块resolve配置
      resolve: Object.assign(
        {
          // 额外的模块缺省扩展类型
          // 默认已配置：['.ts', '.tsx', '.js', '.jsx', '.coffee', '.json']
          extensions: [],

          // 模块配置
          // 默认已配置的模块:
          // node_modules/
          // static/src/
          // static/node_modules/
          modules: [],

          // 额外的模块别名配置
          alias: [],
        },
        configs.resolve
      ),

      loaderInclude: configs.loaderInclude || [],
    };

    return {
      // 应用入口文件，可以配置多入口
      entry: configs.entry,

      target: 'node',

      // 打包模块输出配置
      output: {
        libraryTarget: 'commonjs2',
        // 资源输出路径
        path: configs.distDir,

        // 资源发布的路径
        publicPath:
          isDev || !configs.isDynamicPublicPath
            ? configs.publicPath
            : '<%= locals.config.cdnPrefix %>',

        // js模块文件名配置
        filename: '[name].js',

        // 输出sourcemap，方便浏览器调试源代码
        sourceMapFilename: 'sourcemaps/[file].map',

        pathinfo: false,
      },

      // 模块解析配置
      // 模块别名配置
      resolve: {
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.coffee',
          '.json',
          ...configs.resolve.extensions,
        ],
        modules: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(configs.srcDir, '../', 'node_modules'),
          configs.srcDir,
        ].concat(configs.resolve.modules),
        alias: configs.resolve.alias,
      },

      module: {
        rules: [
          {
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
                options: getBabelrc(),
              },
              {
                loader: 'ts-loader',
              },
            ],
          },
          {
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
                options: getBabelrc(),
              },
            ],
          },
          {
            test: /\.(css|less)$/,
            use: ['ignore-loader'],
          },
          {
            test: /\.(jpg|png|gif|svg)$/i,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[hash:10].[ext]',
                },
              },
            ],
          },
          {
            test: /\.json5$/,
            use: 'json5-loader',
          },
        ],
      },

      plugins: [
        new CleanWebpackPlugin([configs.distDir], {
          allowExternal: true,
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(env),
          },
        }),
      ],

      stats: {
        children: false,
        timings: true,
      },

      devtool: 'source-map',
    };
  };
};

function getBabelrc() {
  return {
    presets: [
      [
        'env',
        {
          target: {
            node: 'current',
            uglify: false,
          },
          forceAllTransforms: false,
          modules: false,
        },
      ],
      ['react'],
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
    ],
  };
}
