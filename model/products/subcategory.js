const mongoose = require("mongoose");
const schema = mongoose.Schema;

const SubCategorySchema = new schema(
  {
    category: {
      type: schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    category_Id: {
      type: String,
      require: false,
    },

    category_name: {
      type: String,
      require: true,
      trim: true,
      message: "Category name is mandatory",
    },
    sub_category_name: {
      type: String,
      require: false,
      trim: true,
    },
    slug: { type: String, required: false, trim: true, unique: true },
    sub_category_image: {
      type: Array,
      require: false,
    },
    isHide: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const SubCategoy = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoy;
