const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const News = new Schema(
  {
    thumbnailUrl: String,
    title: String,
    description: String,
    content: String,
    views: Number,
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("news", News);
