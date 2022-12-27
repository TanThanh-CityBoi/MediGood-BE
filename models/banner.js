const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Banner = new Schema(
  {
    slides: [
      { imgURL: String, title: String, description: String, path: String },
    ], // Danh sách các hình
    type: Number, // 1: Home , 2:
  },
  { timestamps: true }
);

module.exports = mongoose.model("banner", Banner);
