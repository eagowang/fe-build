/**
 * 声明自由变量
 */

// __webpack_public_path__ 自由变量，用于动态设置模块的publicPath：
// webpack在编译过程中，会自动搜寻并匹配__webpack_public_path__自由变量，
// 并将其设置到entry point模块头部，将__webpack_require__.p指向该值，
// __webpack_require__.p是模块加载器中的publicPath，所有异步模块、动态加载模块，都使用该publicPath。
// 为了使自由变量生效，需要在entry point模块头部第一行，导入本脚本：
// import '@fe-tools/build/free-variable';
if (window.RPCONFIG && window.RPCONFIG.cdnPrefix) {
  var publicPath = window.RPCONFIG.cdnPrefix;
  if (!/\/$/.test(publicPath)) publicPath += '/';
  __webpack_public_path__ = publicPath;
}
