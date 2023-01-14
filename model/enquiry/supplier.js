const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema(
  {
    
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

   
  
  

    type:{
      type:String,
      required:false

    }

  },

  {
    timestamps: true,
  }
);

const Supplier = mongoose.model(
  "Supplier",
  SupplierSchema
);

module.exports = Supplier;
