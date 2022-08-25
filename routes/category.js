const express = require("express");
// const { default: mongoose } = require("mongoose");
const router = express.Router();
// const UserModel = require("../model/model");

const Category = require("../model/products/category");

const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");
// const fs = require("fs");
const SubCategory = require("../model/products/subcategory");
// const Product = require("../model/products/product");
// const uploadSubCategoryImage = require("../config/multer");
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
    console.log({ test: req.body.category_name });
    const { category_name } = req.body;

    // const { user } = req.user;

    // const userData = await UserModel.findOne(
    //   { _id: user._id },
    //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
    // );
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
            req.files.category_image.length > 0
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
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await Category.find();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_home_cat", async (req, res) => {
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await Category.find().limit(10);

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
    console.log({ imagesss: req.body.sub_category_image });

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

//Fields

router.get("/get_subcategory", async (req, res) => {
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await SubCategory.find();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.post(
  "/connect_to_buy",

  async (req, res) => {
    console.log({ imagesss: req.body.sub_category_image });

    try {
      const product = await new CustomerQueryByProduct({
        product_Id: req.body.product_Id,
        // product_name: req.body.product_name,
        // product_merchant:req.body.product_merchant,
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
