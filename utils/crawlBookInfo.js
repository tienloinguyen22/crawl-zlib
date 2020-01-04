const he = require('he');
const BooksModel = require('../models/book.model');
const configs = require('../configs');
const logger = require('./logger');

const crawlBookInfo = async ($, url) => {
  try {
    const title = $('h1[itemprop=name]').text().trim();
    const author = $('a[itemprop=author]').first().text().trim();
    const description = he.decode($('div[itemprop=reviewBody]').html().trim());
    const category = $('div.property_categories > a').text().trim();
    const year = $('div.property_year').first().clone().children().remove().end().text().trim();
    const publisher = $('div.property_publisher').first().clone().children().remove().end().text().trim();
    const language = $('div.property_language').first().clone().children().remove().end().text().trim();
    const pages = $('div.property_pages').last().children().last().text().trim();
    const fileInfo = $('div.property__file').first().clone().children().remove().end().text().trim();
    const downloadUrl = $('a.dlButton').first().attr('href');
    const coverUrl = $('a[itemprop=image]').children().first().attr('src');

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

    logger.info(`[${newBook._id}] Success create new book: ${newBook.title}`);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = crawlBookInfo;