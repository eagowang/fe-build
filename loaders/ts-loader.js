const path = require('path');

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
    use: 'happypack/loader?id=tex',
  };
};
