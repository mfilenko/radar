'use strict';

// Third-party packages.
const express = require('express');

const config = require('./config');

// Initialization.
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.sendStatus(500);
});

app.listen(config.app.port);
