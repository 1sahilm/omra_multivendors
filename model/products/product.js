const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    Vendor_Id: { type: String, required: true },
    auther_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mobile_no: {
      type: mongoose.Schema.Types.String,
      ref: "User",
    },
    vendors_name: { type: String, required: true },
    TypesOf_Bussiness:{ type: String, required: true },

    // true all above
    SubTypeOf_bussiness:{ type: String, required: true },
    Merchant_Address:{ type: String, required: true },
    product_name: { type: String, required: false },
    manufacturer_name:{
      type:String,
      required:false
    },
    manufacturer_phone_no:{
      type:String,
      required:false
    },
    manufacturer_address:{
      type:String,
      required:false
    },
    brand:{
      type:String,
      required:false
    },
    product_image: {
      type: Array,
      required: false,
    },
    category: {
      type: String,
      required: false,
    },
    sub_category: {
      type: String,
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
    // category: {
    //   type: String,
    //   required: false,
    // },
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
      required: false

    },
    product_description: {
        type: String,
        required: false,
      },
      capacity:{
        type:String,
        required:false
      },
      model_no:{
        type:String,
        required:false
      },
      product_code:{
        type:String,
        required:false

      },
      delivery_time:{
        type:String,
        required:false
      },
      made_in:{
        type:String,
        required:false
      }
      ,

    type: {
      type: String,
      required: false,
    },
    isApproved:{
        type:Boolean,
        default:false,
    },
    message:{ type:String,
      required:false},
    status:{
      type:String,
      required:false
    },
    isDeclined:{
      type:Boolean,
      default:false,
  },
  isActive: {
    type: mongoose.Schema.Types.String,
    ref: "User",
  },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
