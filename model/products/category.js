const mongoose = require("mongoose");
const SubCategoy = require("./subcategory");


const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    category_name: { type: String, required: false,trim:true },
    category_image: { type: Array, required: false },
    position: { type: Number, required: false,trim:true },
    isHide: { type: Boolean, default: false },
    
    sub:{type:Array,required:false}
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
