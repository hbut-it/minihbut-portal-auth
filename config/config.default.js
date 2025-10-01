/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.security = {
    csrf: {
      enable: false, // 关闭 csrf 检测
    },
  };

  // add your middleware config here
  config.middleware = ["errorHandler"];

  return {
    ...config,
  };
};
