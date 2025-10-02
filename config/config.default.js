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

  // 安全配置
  config.security = {
    csrf: {
      enable: false, // 关闭 csrf 检测
    },
  };

  // 中间件配置
  config.middleware = ["errorHandler"];

  // 统一身份认证接口配置
  config.auth = {
    base: "https://auth.hbut.edu.cn/authserver",
    url: {
      login: "/login",
      getCaptcha: "/getCaptcha.htl",
    },
  };

  // OCR 接口配置
  config.ocr = {
    base: "http://127.0.0.1:8000",
    url: {
      ocr: "/ocr",
    },
  };

  return {
    ...config,
  };
};
