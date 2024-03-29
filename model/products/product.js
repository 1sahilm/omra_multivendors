const mongoose = require("mongoose");
const UserModel = require("../model");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    Vendor_Id: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: false,
    },
    auther_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mobile_no: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
    company_description: {
      type: mongoose.Schema.Types.String,
      // default: UserModel.description,
      ref: "User",
    },

    // true all above
    SubTypeOf_bussiness: { type: mongoose.Schema.Types.String, ref: "User" },
    Merchant_Address: { type: mongoose.Schema.Types.String, ref: "User" },
    product_name: {
      type: String,
      required: false,
      //  index: true
      trim: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    manufacturer_name: {
      type: String,
      required: false,
    },
    manufacturer_phone_no: {
      type: String,
      required: false,
    },
    manufacturer_address: {
      type: String,
      required: false,
    },
    brand: {
      type: String,
      required: false,
      index: true,
      trim: true,
    },
    product_image: {
      type: Array,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: false,
    },
    sub_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategories",
      required: false,
    },
    product_image1: {
      type: Array,
      required: false,
    },
    product_image2: {
      type: Array,
      required: false,
    },
    product_image3: {
      type: Array,
      required: false,
    },
    product_image4: {
      type: Array,
      required: false,
    },
    product_image5: {
      type: Array,
      required: false,
    },
    videos: { type: String, required: false },
    video_url: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },

    product_Specification: {
      type: String,
      required: false,
    },
    additionalSpecification: {
      type: Array,
      required: false,
    },
    product_description: {
      type: String,
      required: false,
    },
    capacity: {
      type: String,
      required: false,
    },
    model_no: {
      type: String,
      required: false,
    },
    product_code: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    delivery_time: {
      type: String,
      required: false,
    },
    made_in: {
      type: String,
      required: false,
    },
    source_type: {
      type: String,
      required: false,
    },
    source: {
      type: String,
      required: false,
    },
    image_source_pdf: {
      type: String,
      required: false,
    },
    image_source_image: {
      type: String,
      required: false,
    },
    image_source_url: {
      type: String,
      required: false,
    },
    image_source_other: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    message: { type: String, required: false },
    status: {
      type: String,
      required: false,
    },
    isDeclined: {
      type: Boolean,
      default: false,
    },
    approved_date: {
      type: Date,
      required: false,
    },
    declined_date: {
      type: Date,
      required: false,
    },
    isActive: {
      type: mongoose.Schema.Types.Boolean,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({
  product_name: "text",
  category: "text",
  brand: "text",
  sub_category: "text",
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
