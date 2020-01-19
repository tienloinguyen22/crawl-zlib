const logger = require('../utils/logger');
const cheerio = require('cheerio');
const configs = require('../configs');
const request = require('request-promise');
const BookUrlsModel = require('../models/book-url.model');

const crawler = async (url) => {
  try {
    await BookUrlsModel.create({url});

    const response = await request({
      url,
      proxy: `http://auto:${configs.apifyPassword}@proxy.apify.com:8000`
    });

    const $ = cheerio.load(response);

    $('div.brick').each(async function (index) {
      const bookId = $(this).children().first().attr('href');
      const bookUrl = `${configs.domain}${bookId}`;
      crawler(bookUrl);
    });

    logger.info(`Success crawl book: ${url}`);
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = crawler;