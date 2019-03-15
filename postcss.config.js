module.exports = function({ env, options }) {
  const isDev = env === 'development';
  return {
    plugins: [
      require('postcss-import')({ path: [options.configs.srcDir] }),
      require('postcss-mixins')(),
      require('postcss-each')(),
      require('postcss-css-variables')(),
      require('postcss-preset-env')({
        browsers: options.configs.browsers,
        features: { customProperties: false }
      }),
      require('postcss-reporter')({ clearAllMessages: true }),
      require('cssnano')({
        preset: isDev ? 'default' : 'advanced'
      })
    ]
  };
};
