const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
   
   
    category_name: { type: String, required: false },
    category_image: { type: Array , required: false},
   
    
   

   
    

   

    
    
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
