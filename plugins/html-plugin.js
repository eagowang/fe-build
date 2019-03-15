const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

// 生成模板页面入口插件
// 支持多模板页面
// 在configs中指定`template`，来指定模板相关配置
// 其中：
// views: [{ view: 'views/store.ejs', ext: '.ejs', filename: 'store.ejs', chunks: ['store'] }, ...]
// 其中：view是模板视图，ext指定页面扩展名，默认是'.html'，filename是编译后文件名（当不指定时，根据view和ext自动生成），chunks是此视图要引入的模块（同名的js和css模块）
module.exports = function(env, configs) {
  let template = configs.template;
  if (template.target) {
    // 末尾补充/
    template.target += /\/$/.test(template.target) ? '' : '/';
  }

  let plugins = template.views.map(item => {
    let template_path = `${template.source}/${item.view}`;
    let filename =
      item.filename || item.view.replace(/\.(\w+)$/, item.ext || '.html');
    let options = {
      // 模板源文件
      template: template_path,
      // 输出的页面文件名
      filename: (template.target || '') + filename,
      // 需要注入资源，css注入在head底部，js注入在body底部
      inject: true,
      // 开启xhtml严格规范
      xhtml: true,
      // 注入的资源模块
      chunks: item.chunks,
      // manual - 按chunks指定的顺序排序
      chunksSortMode: 'manual'
    };

    // 使用模板内容而不是模板文件
    if (template.content) {
      // 模板内容
      options.templateContent = fs.readFileSync(template_path, 'utf-8');
      delete options.template;
    }

    // 有传递favicon进来
    if (template.favicon) {
      options.favicon = template.favicon;
    }

    // 非本地开发环境
    if (env !== 'development') {
      // 内嵌manifest和inline资源包
      options.inlineSource = template.inline || '.inline(.*?).(js|css)$';
      // 压缩页面内嵌的js/css，并删除注释和空白符
      options.minify = {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        collapseWhitespace: true
      };
    } else {
      options.alwaysWriteToDisk = true;
    }
    return new HtmlWebpackPlugin(options);
  });
  if (env === 'development') {
    plugins.push(
      new HtmlWebpackHarddiskPlugin({
        outputPath: template.target
      })
    );
  }
  return plugins;
};
