const express = require("express");

const router = express.Router();

const path = require("path");

const multer = require("multer");
// const fs = require("fs");

const Blogs = require("../model/blogs");

//=====================================================

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "public/blog",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

const upload = multer({ storage: imageStorage });

router.post(
  "/upload",
  upload.fields([{ name: "blog_image", maxCount: 1 }]),
  async (req, res) => {
    const { blog_heading, blog_paragraph, blog_image } = req.body;

    if (!blog_heading) {
      res.json({ success: false, data: "Headings is mandatory" });
    } else {
      const isBlog = await Blogs.findOne({
        blog_heading: blog_heading,
      });
      if (isBlog) {
        res.json({ success: false, data: "Already created try with new" });
      } else {
        try {
          const blog = await new Blogs({
            blog_heading: blog_heading,
            blog_paragraph: blog_paragraph,
            blog_image: `${process.env.BASE_URL}/blog-image/${req.files.blog_image[0].filename}`,
          });
          await blog.save();
          res.status(200).send(blog);
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    }
  }
);

router.patch(
  "/update_blog/:_id",
  upload.fields(
    [{ name: "blog_image", maxCount: 1 }]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;

    try {
      const blog = await Blogs.updateOne(
        { _id },
        {
          blog_heading: req.body.blog_heading,
          blog_paragraph: req.body.blog_paragraph,
          blog_image:
            req.files.blog_image?.length > 0
              ? `${process.env.BASE_URL}/blog-image/${req.files.blog_image[0].filename}`
              : undefined,
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        message: "Blog Updated Sucessfully",
        blog,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);

router.delete("/delete_blog/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const blog = await Blogs.findOneAndDelete({ _id });
    res.json({
      message: "blog has been deleted Sucessfully",
      blog,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

router.get("/get_blogs", async (req, res) => {
  try {
    const blog = await Blogs.find({});

    res.status(200).json(await blog);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_home_blog", async (req, res) => {
  let { page = 1, limit = 3 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  try {
    const blogs = await Blogs.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.status(200).json(blogs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//

//Fields

//

// router.get("/get_subcategory-lazy", async (req, res) => {
//   let { page = 1, limit = 50 } = req.query;

//   page = parseInt(page);
//   limit = parseInt(limit);

//   try {
//     const product = await SubCategory.find()
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();
//     const count = await SubCategory.countDocuments();

//     const totalPages = Math.ceil(count / limit);

//     res.status(200).json({
//       product,
//       totalPages,
//       nextPage: page < totalPages ? page + 1 : null,
//     });
//   } catch (error) {
//     res.status(404).json({ message: error.message });
//   }
// });
//=======================get SubCat By Category================

//====================

module.exports = router;
