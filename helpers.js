'use strict';

module.exports = {
  loglevel: env => {
    if (typeof env !== 'string') {
      return;
    }
    switch (env.toLowerCase()) {
      case 'local':
        return 'trace';
      case 'dev':
      case 'devel':
      case 'develop':
      case 'development':
        return 'info';
      case 'integration':
      case 'uat':
        return 'warn';
      case 'staging':
      case 'production':
      default:
        return 'error';
    }
  },

  toBoolean: value => {
    if (typeof value === 'string') {
      return !~['false', 'no'].indexOf(value.toLowerCase());
    }
    return !!value;
  },
};
