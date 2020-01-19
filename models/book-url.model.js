const mongoose = require('mongoose');

const BookUrlSchema = new mongoose.Schema({
  url: {
    type: String,
    unique: true,
  },
  crawled: {
    type: Boolean,
    default: false,
  },
  errorMessage: String,
}, {
  timestamps: true,
});
BookUrlSchema.index({url: 1});

const BookUrlsModel = mongoose.model('BookUrl', BookUrlSchema);

module.exports = BookUrlsModel;