module.exports = function(env, configs) {
  return {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            browsers: configs.browsers
          },
          modules: false,
          // 松散模式生成的代码更少
          loose: true,
          useBuitIns: 'usage',
          debug: env === 'development'
        }
      ],
      ['@babel/preset-react'],
      ['@babel/preset-typescript']
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      ['import', { libraryName: 'antd', style: true }]
    ],
    env: {
      production: {
        plugins: [
          [
            'transform-react-remove-prop-types',
            { removeImport: true, ignoreFilenames: ['node_modules'] }
          ]
        ]
      }
    }
  };
};