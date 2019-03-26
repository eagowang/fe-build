module.exports = function(env, configs) {
  // api.cache.using();
  const isDev = env === 'development';
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: isDev
            ? {}
            : {
                browsers: configs.browsers,
              },
          modules: false,
          // 松散模式生成的代码更少
          loose: true,
          useBuiltIns: isDev ? false : 'usage',
          debug: isDev === 'development',
        },
      ],
      ['@babel/react'],
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-syntax-dynamic-import',
      ['import', { libraryName: 'antd', style: true }],
    ],
    env: {
      production: {
        plugins: [
          [
            'transform-react-remove-prop-types',
            { removeImport: true, ignoreFilenames: ['node_modules'] },
          ],
        ],
      },
    },
  };
};
