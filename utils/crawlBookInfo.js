const he = require('he');
const BooksModel = require('../models/book.model');
const BookUrlsModel = require('../models/book-url.model');
const configs = require('../configs');
const logger = require('./logger');
const request = require('request-promise');
const cheerio = require('cheerio');

const crawlBookInfo = async () => {
  const bookUrl = await BookUrlsModel.findOne({crawled: false, errorMessage: {$exists: false}}).lean();
  if (!bookUrl) {
    return;
  }
  const url = bookUrl.url;

  try {
    const response = await request({
      url,
      proxy: `http://auto:${configs.apifyPassword}@proxy.apify.com:8000`
    });

    const $ = cheerio.load(response);

    const title = $('h1[itemprop=name]').text().trim();
    const author = $('a[itemprop=author]').first().text().trim();
    const description = he.decode($('div[itemprop=reviewBody]').html().trim());
    const categories = $('div.property_categories > a').text().trim();
    const year = $('div.property_year').first().clone().children().remove().end().text().trim();
    const publisher = $('div.property_publisher').first().clone().children().remove().end().text().trim();
    const language = $('div.property_language').first().clone().children().remove().end().text().trim();
    const pages = $('div.property_pages').last().children().last().text().trim();
    const fileInfo = $('div.property__file').first().clone().children().remove().end().text().trim();
    const downloadUrl = $('a.dlButton').first().attr('href');
    const coverUrl = $('a[itemprop=image]').children().first().attr('src');

    let category;
    if (categories && categories.indexOf(`\\`) > -1) {
      category = categories.split(`\\`).filter((item) => Boolean(item));
    } else {
      category = [categories];
    }

    const newBook = await BooksModel.create({
      title,
      author,
      description,
      category,
      year,
      publisher,
      language,
      pages: Number(pages),
      fileInfo,
      downloadUrl: `${configs.domain}${downloadUrl}`,
      referer: url,
      coverUrl: `https:${coverUrl}`
    });
    await BookUrlsModel.findByIdAndUpdate(bookUrl._id, {$set: {crawled: true}}).lean();

    logger.info(`[${newBook._id}] Success create new book: ${newBook.title}`);
    crawlBookInfo();
  } catch (error) {
    logger.error(error);
    await BookUrlsModel.findByIdAndUpdate(bookUrl._id, {$set: {errorMessage: error.message}}).lean();
    crawlBookInfo();
  }
};

module.exports = crawlBookInfo;