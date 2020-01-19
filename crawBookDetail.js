const mongoose = require('mongoose');
const crawlBookInfo = require('./utils/crawlBookInfo');
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
    await crawlBookInfo();
  }
});