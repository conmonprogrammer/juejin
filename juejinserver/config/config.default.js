/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1692175592765_4566';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // 配置安全验证
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    }
  }
  // config/config.${env}.js
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: 'localhost',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '20020505',
      // 数据库名
      database: 'juejin',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  config.session = {
    key: 'SESSION_ID',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true
  };
  config.multipart = {
    mode: 'file',
    fileSize: '100mb',
    files: '10'
  };
  // egg-jwt配置  生成token
  config.jwt = {
    secret: "adaffwf34654ht65hgbt"
  };
  // socket.io的配置
  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [],//需要走中间件，在这儿配置中间件的js文件名
        packetMiddleware: [],
      }
    },
  };
  return {
    ...config,
    ...userConfig,
  };

};
