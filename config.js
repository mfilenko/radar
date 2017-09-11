'use strict';

const config = require('./package').config;

const helpers = require('./helpers');

module.exports = {
  app: {
    port: process.env.PORT || process.env.npm_package_config_listen || config.listen,
    loglevel: helpers.loglevel(process.env.NODE_ENV),
  },
};
