'use strict';

// Third-party packages.
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const retry = require('async-retry');

const middleware = require('./middleware');
const get = require('./get');

const config = require('./config');

// Initialization.
const app = express();
const logger = pino();

const cache = middleware.cache;
const fetch = middleware.fetch;
const locate = middleware.locate;
const allocate = middleware.allocate;
const respond = middleware.respond;

if (config.app.loglevel) {
  logger.level = config.app.loglevel;
}

app.locals.polygons = {
  type: 'FeatureCollection',
  features: [],
};

app.use(expressPino({ logger }));

app.get('/cars', cache, fetch, locate, respond);

app.get('/polygons', cache, fetch, allocate, respond);

app.use((err, req, res, next) => {
  req.log.error(err);
  return res.sendStatus(500);
});

// We won't start until we _finally_ get initial data.
(async () => retry(async () => get(config.polygons)))()
  .then(polygons => {
    app.locals.polygons.features = polygons;
    app.listen(config.app.port, () => logger.debug(`Listening on port ${config.app.port}`));
  });
