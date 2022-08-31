const mongoose = require("mongoose");
const schema = mongoose.Schema;

const SubCategorySchema = new schema(
  {
    category_Id: {
      type: String,
      require: false,
    },

    category_name: {
      type: String,
      require: false,
      trim: true,
    },
    sub_category_name: {
      type: String,
      require: false,
      trim: true,
    },
    sub_category_image: {
      type: Array,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

const SubCategoy = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoy;
