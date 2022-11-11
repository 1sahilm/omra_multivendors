const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GallerySchema = new Schema(
  {
    name: { type: String, required: false },
    file: { type: Array, required: false },
    type: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model("gallery", GallerySchema);

module.exports = Gallery;
