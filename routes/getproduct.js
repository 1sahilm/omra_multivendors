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
    const product = await Product.find().sort({ createdAt: 1 });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/getByCategory", async (req, res) => {
  const category = req.query.category;
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );

  try {
    const product = await Product.find({ category });

    res.status(200).json(product);
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
  try {
    const data = await Product.find({
      $or: [
        { vendors_name: { $regex: req.params.key, $options: "$i" } },
        { product_name: { $regex: req.params.key, $options: "$i" } },
        { Merchant_Address: { $regex: req.params.key, $options: "$i" } },
        { category: { $regex: req.params.key, $options: "$i" } },
      ],
    });
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
