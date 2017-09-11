'use strict';

const config = require('./package').config;

module.exports = {
  app: {
    port: process.env.PORT || process.env.npm_package_config_listen || config.listen,
  },
};
