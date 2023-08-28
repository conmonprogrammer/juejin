'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  session: {
    enable: true,
    package: 'egg-session'
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  }
};
