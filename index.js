'use strict';

// Third-party packages.
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const middleware = require('./middleware');
const get = require('./get');

const config = require('./config');

// Initialization.
const app = express();
const logger = pino();

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

app.get('/cars', fetch, locate, respond);

app.get('/polygons', fetch, allocate, respond);

app.use((err, req, res, next) => {
  req.log.error(err);
  return res.sendStatus(500);
});

// Get initial data before start.
(async () => get(config.polygons))()
  .then(polygons => {
    app.locals.polygons.features = polygons;
    app.listen(config.app.port, () => logger.debug(`Listening on port ${config.app.port}`));
  });
