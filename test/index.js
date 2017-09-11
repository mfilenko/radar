'use strict';

const fs = require('fs');
const path = require('path');

const Mocha = require('mocha');

const mocha = new Mocha();

const tests = 'test/unit';

fs.readdirSync(tests)
  .filter(file => file.substr(-3) === '.js')
  .forEach(file => mocha.addFile(path.join(tests, file)));

mocha.run(failures => process.on('exit', () => process.exit(failures)));
