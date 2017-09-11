// Simple HTTP GET client.

'use strict';

// Built-ins.
const https = require('https');

module.exports = url => new Promise((resolve, reject) => https.get(url, data => {
  let response = '';
  data.on('data', chunk => {
    response += chunk;
  });
  data.on('end', () => {
    let result = {};
    try {
      result = JSON.parse(response);
    } catch (e) {
      return reject(e);
    }
    return resolve(result);
  });
}).on('error', error => reject(error)));
