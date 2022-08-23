const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const UserModel = require("../model/model");

const Category = require("../model/products/category");
const Banner = require("../model/products/banner");
const verifyJwt = require("../Middleware/jwtMiddleware");

const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const fs = require("fs");
const upload = require("../config/multer");

//=====================================================

router.post(
  "/banner",
  upload.fields(
    [
      { name: "banner_image1", maxCount: 1 },
      { name: "banner_image2", maxCount: 1 },
      { name: "banner_image3", maxCount: 1 },
      { name: "banner_image4", maxCount: 1 },
      { name: "banner_image5", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),

  async (req, res) => {
    console.log({ test: req.body });
    console.log({ amitbaba: req.files });
    console.log({ amitbaba1: req.files });

    // const { user } = req.user;

    // const userData = await UserModel.findOne(
    //   { _id: user._id },
    //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
    // );
    const { type } = req.body;
    if (!type) {
      res.json({ success: false, data: "banner type is mandatory" });
    } else {
      const bannerType = await Banner.findOne({ type: type });
      if (bannerType) {
        res.json({ success: false, data: "This banner is already created" });
      } else {
        try {
          const item = {
            banner_name: req.body.banner_name,
            product : req.body.product,
           

            banner_image1: req.files.banner_image1?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image1[0].filename}`: undefined,

            banner_image2: req.files.banner_image2?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image2[0].filename}`: undefined,
            banner_image3: req.files.banner_image3?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image3[0].filename}`: undefined,
            banner_image4: req.files.banner_image4?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image4[0].filename}`: undefined,
            banner_image5: req.files.banner_image5?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image5[0].filename}`: undefined,
            type: type,
          };
          const banner = await new Banner(item);
          banner.save();
          res.status(200).send(banner);
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    } 
    
  }
);

router.patch(
  "/update_banner/:_id",
  upload.fields(
    [
      { name: "banner_image1", maxCount: 1 },
      { name: "banner_image2", maxCount: 1 },
      { name: "banner_image3", maxCount: 1 },
      { name: "banner_image4", maxCount: 1 },
      { name: "banner_image5", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;
    const { type } = req.body;

    try {
      const user = await Banner.updateOne(
        { _id },
        {
          banner_name: req.body.banner_name,
          product : req.body.product,

          banner_image1: req.files.banner_image1?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image1[0].filename}`: undefined,

            banner_image2: req.files.banner_image2?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image2[0].filename}`: undefined,
            banner_image3: req.files.banner_image3?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image3[0].filename}`: undefined,
            banner_image4: req.files.banner_image4?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image4[0].filename}`: undefined,
            banner_image5: req.files.banner_image5?.length > 0
              ?`${process.env.BASE_URL}/banner-image/${req.files.banner_image5[0].filename}`: undefined,
          type: type,
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

router.get("/get_banner", async (req, res) => {
  // const { user } = req.user;
  // const userData = await UserModel.findOne(
  //   { _id: user._id },
  //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
  // );
  try {
    const product = await Banner.find();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
