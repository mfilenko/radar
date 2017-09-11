'use strict';

// Third-party packages.
const express = require('express');
const pino = require('pino');
const expressPino = require('express-pino-logger');

const config = require('./config');

// Initialization.
const app = express();
const logger = pino();

if (config.app.loglevel) {
  logger.level = config.app.loglevel;
}

app.use(expressPino({ logger }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use((err, req, res, next) => {
  req.log.error(err);
  return res.sendStatus(500);
});

app.listen(config.app.port);
