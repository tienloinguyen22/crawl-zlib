const bunyan = require('bunyan');

const logger = bunyan.createLogger({
  name: 'Z-lib',
  streams: [{
    stream: process.stdout,
    level: 'trace',
  }],
});

module.exports = logger;