const mongoose = require('mongoose');
const crawler = require('./utils/crawler');
const logger = require('./utils/logger');

const mongodbConnectionString = 'mongodb://localhost:27017/zlib';
const mongodbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongodbConnectionString, mongodbOptions, async (error) => {
  if (error) {
    logger.error(error);
    process.exit();
  } else {
    logger.info('TCL: Connect to mongodb success');

    const initialUrl = 'https://b-ok.cc/book/1169427/ee2855';
    await crawler(initialUrl);
  }
});