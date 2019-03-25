module.exports = function(env, configs) {
  return [
    ...require('./clean-plugin')(env, configs),
    require('./define-plugin')(env, configs),
    require('./loader-options-plugin')(env, configs),
    require('./css-plugin')(env, configs),
    require('./copy-plugin')(env, configs),
    ...require('./html-plugin')(env, configs),
    ...require('./hot-plugin')(env, configs),
    ...require('./sentry-plugin')(env, configs),
  ];
};
