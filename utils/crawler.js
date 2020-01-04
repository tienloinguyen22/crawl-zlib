const crawlBookInfo = require('./crawlBookInfo');
const BooksModel = require('../models/book.model');
const logger = require('../utils/logger');
const axios = require('axios').default;
const cheerio = require('cheerio');
const configs = require('../configs');

const crawler = async (url) => {
  const existedBook = await BooksModel.findOne({referer: url});
  if (existedBook) {
    logger.warn(`[${existedBook._id}] Book already exist: ${existedBook.title}`)
    return;
  }

  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  await crawlBookInfo($, url);
  
  $('div.brick').each(async function (index) {
    const bookId = $(this).children().first().attr('href');
    const bookUrl = `${configs.domain}${bookId}`;
    await crawler(bookUrl);
  });
};

module.exports = crawler;