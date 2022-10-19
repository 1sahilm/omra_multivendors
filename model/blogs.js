const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogsSchema = new Schema(
  {
    blog_heading: { type: String, required: false },
    blog_paragraph: { type: String, required: false },
    blog_image: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);

const Blogs = mongoose.model("Blogs", BlogsSchema);

module.exports = Blogs;
