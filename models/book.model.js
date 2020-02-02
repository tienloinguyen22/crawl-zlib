const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  category: [String],
  year: String,
  publisher: String,
  language: String,
  pages: Number,
  fileInfo: String,
  downloadUrl: String,
  referer: String,
  coverUrl: String,
  downloadCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});
BookSchema.index({downloadUrl: 1, referer: 1});

const BooksModel = mongoose.model('Book', BookSchema);

module.exports = BooksModel;