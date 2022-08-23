const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const BannerSchema = new Schema(
  {
   
    product:{ type: String, required: false },
    banner_name: { type: String, required: false },
    banner_image1: { type: Array , required: false},
    banner_image2: { type: Array , required: false},
    banner_image3: { type: Array , required: false},
    banner_image4: { type: Array , required: false},
    banner_image5: {type:Array, required: false},
    type:{type:String,required:false}

   },
 {
   timestamps: true,
  }
);

const Banner = mongoose.model("Merchant_Banner", BannerSchema);

module.exports = Banner;
