const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BannerSchema = new Schema(
  {
    product_id: { type: String, required: false },
    merchant_id: { type: String, required: false },
    category_id: { type: String, required: false },
    banner_name: { type: String, required: false },
    banner_image: { type: Array, required: false },
    type: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Banners = mongoose.model("Banner", BannerSchema);

module.exports = Banners;
