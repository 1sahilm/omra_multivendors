const express = require("express");

const router = express.Router();

const Category = require("../model/products/category");

const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");
// const fs = require("fs");
const SubCategory = require("../model/products/subcategory");

const CustomerQueryByProduct = require("../model/products/CustomerQuery");

//=====================================================

const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "public/images",
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
  upload.fields([
    { name: "category_image", maxCount: 1 },
    { name: "category_image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
      res.json({ success: false, data: "Category is mandatory" });
    } else {
      const isCategory = await Category.findOne({
        category_name: category_name,
      });
      if (isCategory) {
        res.json({ success: false, data: "Already created try with new" });
      } else {
        try {
          const category = await new Category({
            category_name: category_name,
            category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
          });
          await category.save();
          res.status(200).send(category);
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    }
  }
);

router.patch(
  "/update_category/:_id",
  upload.fields(
    [
      { name: "category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;

    try {
      const user = await Category.updateOne(
        { _id },
        {
          category_name: req.body.category_name,
          category_image:
            req.files.category_image?.length > 0
              ? `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`
              : undefined,
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        message: "User Updated Sucessfully",
        user,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);

router.delete("/delete_category/:_id", (req, res) => {
  const { _id } = req.params;
  try {
    const category = Category.findOneAndDelete({ _id });
    res.json({
      message: "category deleted Sucessfully",
      category,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

router.get("/get_category", async (req, res) => {
  try {
    const product = await Category.find({});

    res.status(200).json(await product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_home_cat", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  try {
    const product = await Category.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.get("/get_postionCat", async (req, res) => {
  try {
    const product = await Category.find({}, { category_name: 1 }).limit(5);

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

///  SubCategory Product==========================SubCategory Product============

// router.post("/add_subcategory" ,upload.single("sub_category_image"),async(req,res)=>{
//   try {
//     const subcategory=await new SubCategory({
//       category_Id: req.body.category_Id,
//       category_name: req.body.category_name,
//       sub_category_name: req.body.sub_category_name,
//       sub_category_image: req.files.sub_category_image.filename >0 ? `${process.env.BASE_URL}/category-image/${req.files.sub_category_image.filename}`:undefined,

//     })
//    await subcategory.save()
//     res.status(200).send( await subcategory)

//   } catch (error) {
//     res.json(error.message)

//   }
// })

router.post(
  "/add_subcategory",
  upload.fields([
    { name: "sub_category_image", maxCount: 1 },
    { name: "category_image2", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const category = await new SubCategory({
        category_Id: req.body.category_Id,
        category_name: req.body.category_name,
        sub_category_name: req.body.sub_category_name,
        sub_category_image: `${process.env.BASE_URL}/category-image/${req.files.sub_category_image[0].filename}`,
      });
      await category.save();
      res.status(200).send(category);
    } catch (err) {
      res.status(500).send({ message: err?.message });
    }
  }
);
// Update SubActegory
router.patch(
  "/update_sub_category/:_id",
  upload.fields(
    [
      { name: "sub_category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;

    try {
      const user = await SubCategory.updateOne(
        { _id },
        {
          sub_category_name: req.body.category_name,
          category_image:
            req.files.sub_category_image.length > 0
              ? `${process.env.BASE_URL}/category-image/${req.files.sub_category_image[0].filename}`
              : undefined,
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        message: "Subcategory Updated Sucessfully",
        user,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);

//Fields

router.get("/get_subcategory", async (req, res) => {
  try {
    const product = await SubCategory.find();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_subcategory-lazy", async (req, res) => {
  let { page = 1, limit = 50 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const product = await SubCategory.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await SubCategory.countDocuments();

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      product,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//=======================get SubCat By Category================
router.get("/get_subcategoryByCat", async (req, res) => {
  category_name = req.query.category_name;

  try {
    const product = await SubCategory.find({ category_name: category_name });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//====================

router.post(
  "/connect_to_buy",

  async (req, res) => {
    try {
      const product = await new CustomerQueryByProduct({
        product_Id: req.body.product_Id,

        customer_mob: req.body.customer_mob,
      });
      await product.save();
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send({ message: err?.message });
    }
  }
);

module.exports = router;
