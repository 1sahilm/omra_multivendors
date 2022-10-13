const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const UserModel = require("../model/model");

const Product = require("../model/products/product");
const ProductProfile = require("../model/products/product_profile");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const fs = require("fs");
const Category = require("../model/products/category");
const SubCategoy = require("../model/products/subcategory");

router.get("/userActivity", async (req, res) => {
  try {
    const user = await UserModel.find();
    //Fields

    res.json({
      success: "Sucessfully",
      user,
    });
  } catch (err) {
    res.json({
      message: err?.message,
    });
  }
});

router.get("/get_products", async (req, res) => {
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await Product.find().sort({ createdAt: -1 });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// api for list of approval product
router.get("/get_productforApproval", async (req, res) => {
  try {
    const product = await Product.find({
      isApproved: false,
      // isActive: true,
      isDeclined: false,
    }).sort({ createdAt: -1 });

    countDocs = await Product.countDocuments({
      isApproved: false,
      // isActive: true,
      isDeclined: false,
    });

    res.status(200).json({ success: true, data: product, count: countDocs });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/getcompanyDescription", async (req, res) => {
  try {
    const cdetails = await UserModel.find({}, { description: 1 });
    res.status(200).json(cdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

///
router.get("/get_publish_product", async (req, res) => {
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await Product.find({
      isApproved: true,
      isActive: true,
      isDeclined: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
/// for published
router.get("/publishproductApi", async (req, res) => {
  // const category = req.query.category;
  const { page = 1, limit = 10, toDate, fromDate } = req.query;
  try {
    const product = await Product.find({
      isActive: true,
      isApproved: true,
      isDeclined: false,
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const totalDocuments = await Product.countDocuments({
      isActive: true,
      isApproved: true,
      isDeclined: false,
    });

    const pages = Math.ceil(totalDocuments / limit);

    res.status(200).json({
      success: true,
      data: product,
      totalPages: pages,
      currentPage: page,
      nextPage: page < pages ? page + 1 : null,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/getByCategory", async (req, res) => {
  let filter = {};

  const category = req.query.category;
  // const sub_category = req.query.sub_category;
  // console.log("categoryyyy", category.split(","));
  // if (req.query.categories) {
  //   filter = { category: [req.query.categories] };
  // }

  try {
    const product = await Product.find(
      {
        category: { $in: category.split(",") },
        // sub_category: { $in: sub_category },

        isActive: true,
        isApproved: true,
        isDeclined: false,
      }
      // { isActive: true, isApproved: true, isDeclined: false }
      // filter
    ).sort({ createdAt: -1 });
    // .filter({ isActive: true, isApproved: true, isDeclined: false });
    // console.log({ category: { $in: category.split(",") } }),
    console.log({ test: category });
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//============ get Brand list ==========
router.get("/brand", async (req, res) => {
  try {
    const brand = await Product.find({}).select({ brand: 1, _id: 0 });
    // .distinct("brand");
    const test = new Set(brand);
    res.status(200).json({ data: brand });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_products_count", async (req, res) => {
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await Product.find({ isApproved: false }).sort([
      ["createdAt", -1],
    ]);

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/search=", async (req, res) => {
  const searchName = req.query.vendors_name;

  const searchName1 = req.query.product_name;

  try {
    await Product.find({
      vendors_name: { $regex: searchName, $options: "$i" },
      product_name: { $regex: searchName1, $options: "$i" },
    }).then((data) => res.send(data));
  } catch (error) {
    res.json(404);
  }
});

router.get("/search/:key", async (req, res) => {
  console.log(req.params.key);
  var regx = new RegExp(req.params.key);
  try {
    const data = await Product.find({
      // $text: {
      //   $search: req.params.key.toString(),
      // },
      $or: [
        {
          product_name: {
            $regex: req.params.key,
            $options: "$i",
          },
        },
        {
          model_no: {
            $regex: req.params.key,
            $options: "$i",
          },
        },
        {
          brand: {
            $regex: req.params.key,
            $options: "$i",
          },
        },
        {
          subcategory: {
            $regex: req.params.key,
            $options: "$i",
          },
        },
        {
          category: {
            $regex: req.params.key,
            $options: "$i",
          },
        },
      ],
    });
    // .limit(10);

    const data2 = await SubCategoy.find({
      $or: [{ category_name: { $regex: req.params.key, $options: "$i" } }],
    }).limit(5);
    // const data = [...data2, ...data1];
    // res.json({ data1, data2 });
    res.send(data);
  } catch (error) {
    res.json(404);
  }
});

//// ==================== Search api for  half/full text search=============
router.get("/product-search/:key", async (req, res) => {
  var search = req.body.search;
  var category = req.body.category;
  var sub_category = req.body.sub_category;
  var brand = req.body.brand;
  let regex = new RegExp(req.params.searchQuery, "i");
  let q = req.query.q;
  // const filterd = await Model.find({ $and: [ { $or: [{title: regex },{description: regex}] }, {category: value.category}, {city:value.city} ] })
  try {
    const data = await Product.find(
      {
        category: { $regex: new RegExp(q) },
      },
      { _id: 0 }
      // (data, error) => {
      //   res.json(data);
      // }
    ).limit(10);
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});
// ======================= search2 api -============
router.get("/autoCompleteSearch/:key", async (req, res) => {
  try {
    const data = await Product.find(
      {
        $text: {
          $search: ".*" + req.params.key.toString() + ".*",
        },
      }
      // { brand: 1, category: 1, sub_category: 1, product_name: 1 }
    ).limit(10);
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

// ===================================testing==================
router.get("/homepageSearch/:key", async (req, res) => {
  try {
    const data = await Product.find({
      // $text: {
      //   $search: req.params.key.toString(),
      // },

      $or: [
        { category: { $regex: req.params.key, $options: "$i" } },
        { sub_category: { $regex: req.params.key, $options: "$i" } },
        { brand: { $regex: req.params.key, $options: "$i" } },
        { product_name: { $regex: req.params.key, $options: "$i" } },
      ],
      isActive: true,
      isApproved: true,
    }).limit(10);
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});
// ====================== User Search in SuperAdmin Panel============//
router.get("/searchUser/:key", async (req, res) => {
  try {
    const data = await UserModel.find({
      $or: [
        { Merchant_Name: { $regex: req.params.key, $options: "$i" } },
        { GST_No: { $regex: req.params.key, $options: "$i" } },
        { Merchant_Address: { $regex: req.params.key, $options: "$i" } },
        { company_Name: { $regex: req.params.key, $options: "$i" } },
      ],
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

module.exports = router;
