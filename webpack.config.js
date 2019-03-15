const path = require('path');
const url = require('url');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// dev-server端口号，默认10000
let devServerPort = 10000;

module.exports = function(fn) {
  return () => {
    const env = process.env.NODE_ENV;
    if (!env) throw new Error('找不到环境变量');

    const isDev = env === 'development';
    // 调用业务项目的配置函数，返回业务项目的配置列表
    let configs = fn(env, webpack);

    // dev-server端口号可由外部业务项目的配置文件改写
    if (configs.devServer && configs.devServer.port) {
      devServerPort = configs.devServer.port;
    }

    // 整合业务项目配置列表
    configs = {
      // 业务项目包文件
      appPackage: configs.appPackage,

      // 应用入口
      entry: configs.entry || {},

      // 源代码目录
      srcDir: configs.srcDir,

      // production构建输出目录，完整的绝对路径
      distDir: configs.distDir,

      // 模板配置
      template: Object.assign(
        {
          // 模板的源目录
          // 默认为null，但必须指定真实模板所在目录
          source: null,

          // 模板的目标目录
          // 默认为null，表示输出在当前构建根目录
          target: null,

          // 默认读取模板内容
          content: true,

          // 模板内嵌资源包，配置为正则描述
          // 默认：.inline.(js|css)$
          // 只内嵌.inline.js|.inline.css
          inline: null,

          // 传递给模板的favicon图表地址
          favicon: null,

          // 配置页面模板视图
          // 例如：[{view: 'views/store.ejs', chunks: ['store']}, ...]
          // 其中：view是模板视图，chunks是此视图要引入的模块（同名的js和css模块）
          // view需要`template.source`选项结合起来看
          views: configs.htmls || []
        },
        configs.template
      ),
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
          // 默认已配置的模块
          // node_modules/
          // static/src
          // static/node_modules
          modules: [],

          // 额外的模块别名配置
          alias: []
        },
        configs.resolve
      ),

      // 需要复制的文件或目录
      // 例如：[{from: 'xxx.png', to: 'xxx.png'}, {from: 'favicon.ico'}]
      copy: configs.copy || [],

      // 额外的loader
      // 默认已配置的loader：
      // babel-loader ==> es6 jsx
      // ts-loader ==> ts,tsx
      // less-loader ==> less
      // css-loader、style-loader、postcss-loader ==> css
      // ejs-loader ==> less
      // pug-loader ==> pug模版
      // url-loader ==> jpg|png|gif,
      // file-loader ==> eot|ttf|woff|svg|wav|mp3
      loaders: configs.loaders || [],

      // 额外的plugin
      // 默认已配置的plugin：
      // CleanWebpackPlugin
      // CopyWebpackPlugin
      // MiniCssExtractPlugin
      // DefinePlugin
      // HtmlWebpackPlugin
      // LoaderOptionsPlugin
      plugins: configs.plugins || [],

      // vendor模块的分割依赖模块列表
      // 如果指定了此值，则vendor将对这些依赖模块进行代码分割
      // 如果指定此值，至少指定两个依赖模块
      // 默认为null，将对所有入口模块代码分割到vendor模块
      vendorChunks: configs.vendorChunks || null,

      // 主站域名（一级域名）
      mainDomain: configs.mainDomain || 'rabbitpre.com',

      // 所要支持的浏览器和版本列表
      // 将会影响babel打包和polyfill
      browsers: configs.browsers || [
        'chrome >= 30',
        'firefox >= 30',
        'ie >= 9',
        'safari >= 7',
        'ios >= 6',
        'android >=4'
      ],

      // 本地开发环境，启动dev-server（包含热替换）
      // 可以在业务项目中自有扩展webpack-dev-server模块的配置
      devServer: Object.assign(
        {
          hot: true,
          host: url.parse(configs.publicPath).hostname,
          port: devServerPort,
          publicPath: configs.publicPath,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers':
              'Content-Type,Content-Length,Accept,X-Requested-With',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
          }
        },
        configs.devServer
      ),
      loaderInclude: configs.loaderInclude || []
    };

    return {
      // 打包模式，开发，生产
      // production默认tree-shaking, scopr-hoisting, split-chunks, minimizer
      mode: isDev ? 'development' : 'production',

      // 应用入口文件，可以配置多入口
      entry: configs.entry,

      // 打包模块输出
      output: {
        // 资源输出路径
        path: configs.distDir,

        // 资源发布的路径
        publicPath:
          isDev || !configs.isDynamicPublicPath
            ? configs.publicPath
            : '<%= locals.config.cdnPrefix %>',

        // js模块文件配置名
        // test or prod 环境，带上md5 hash
        filename: `[name]${isDev ? '' : '.[chunkhash:10]'}.js`,

        // 异步js模块文件名配置
        // test or prod环境，带上md5 hash
        chunkFilename: `[name]${isDev ? '' : '.[chunkhash:10]'}.chunk.js`
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
          ...configs.resolve.extensions
        ],
        modules: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(configs.srcDir, '../node_modules'),
          configs.srcDir
        ].concat(configs.resolve.modules),
        alias: configs.resolve.alias
      },

      // 优化
      optimization: {
        minimize: isDev ? false : true,
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true
          }),
          new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
          chunks(chunk) {
            return chunk.name;
          }
        },
        runtimeChunk: true
      },
      module: {
        // 各种默认loader配置
        // 结合其他业务房配置的loader
        rules: [].concat(require('./loaders')(env, configs), configs.loaders)
      },

      plugins: [].concat(require('./plugins')(env, configs), configs.plugins),

      stats: {
        children: false
      },

      // 启动source-map开发工具，方便调试源代码
      devtool: 'source-map',

      //本地开发环境，启动dev-server（包含热替换）
      devServer: configs.devServer
    };
  };
};
