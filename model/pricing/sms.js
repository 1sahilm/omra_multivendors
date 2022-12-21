const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SmsQurySchema = new Schema(
  {
    merchant_Id: {
      type: String,
      required: false,
    },
    product_Id: { type: String, required: false },
    product_name:{ type: String, required: false},
   
    sms:{
        type: String,
        required: false,
    },
    buyer_Mob: { type: String, required: false },
    isCompleted:{
     type:Boolean,
     default:false
    },
    isDeclined:{
      type:Boolean,
      default:false
     },

    type:{
      type:String,
      required:false

    }

  },

  {
    timestamps: true,
  }
);

const SmsQueryProduct = mongoose.model(
  "SmsQuryProduct",
  SmsQurySchema
);

module.exports = SmsQueryProduct;
