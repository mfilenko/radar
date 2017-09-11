'use strict';

const config = require('./package').config;

const helpers = require('./helpers');

module.exports = {
  polygons: 'https://gist.githubusercontent.com/codeofsumit/6540cdb245bd14c33b486b7981981b7b/raw/73ebda86c32923e203b2a8e61615da3e5f1695a2/polygons.json',
  source: 'www.car2go.com',
  location: process.env.LOC || 'stuttgart',
  app: {
    port: process.env.PORT || process.env.npm_package_config_listen || config.listen,
    loglevel: helpers.loglevel(process.env.NODE_ENV),
  },
};
