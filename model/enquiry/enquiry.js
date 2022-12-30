const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EnquirySchema = new Schema(
  {
    merchant_Id: {
      type: String,
      required: false,
    },
    name:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    mobile:{
        type:String,
        required:false
    },
    business_name: {
        type:String,
        required:false,
      },

   
  
    process: {
      type: String,
      required: false,
    },
    date:{
        type:String,
        required:false
    },
    product_category:{
        type:String,
        required:false
    },


    comment: {
        type:String,
        required:false,
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

const Enquiry = mongoose.model(
  "Enquiry",
  EnquirySchema
);

module.exports = Enquiry;
