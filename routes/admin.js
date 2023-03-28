const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const path = require("path");
const UserModel = require("../model/model");
const CustomerQueryByProduct = require("../model/products/CustomerQuery");

router.post("/connect_to_buy", async (req, res) => {
  try {
    const product = await CustomerQueryByProduct.create({
      merchant_Id: req.body.merchant_Id,
      product_Id: req.body.product_Id,
      product_name: req.body.product_name,
      buyer_Message: req.body.buyer_Message,
      buyer_Email: req.body.buyer_Email,
      buyer_Mob: req.body.buyer_Mob,
      type: req.body.type,
    });
    const CountDocuments = product.CountDocuments;

    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
});

router.patch("/leads_update/:_id", async (req, res) => {
  const { _id } = req.params;

  const { isCompleted, isDeclined } = req.body;
  try {
    const updateQuery = await CustomerQueryByProduct.findByIdAndUpdate(
      _id,
      {
        isCompleted: isCompleted,
        // isDeclined:isDeclined
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.json({
      message: "updated Successfull",
      success: true,
      data: updateQuery,
    });
  } catch (err) {
    res.json({
      message: err?.message,
    });
  }
});

router.patch("/declined_lead/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No post Available");

    const product = await CustomerQueryByProduct.findOne({ _id });
    product.isDeclined = req.body.isDeclined;

    await product.save();
    res.status(200).send(product);
  } catch (err) {
    res.json({
      message: err?.message,
    });
  }
});

router.get("/getbuyerQuery", async (req, res) => {
  try {
    const buyerQuery = await CustomerQueryByProduct.find().sort({
      createdAt: -1,
    });
    res.status(200).json(buyerQuery);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/getbuyerQueryCount", async (req, res) => {
  const { query } = req;

  const { page = 1, limit = 200, toDate, fromDate } = query;
  const id = query._id;
  const user = await UserModel.find({}, { _id: 1 });

  try {
    const merchant_Id = query?.merchant_Id;

    const buyerQuery = await CustomerQueryByProduct.find(
      {},
      { merchant_Id: 1 }
    );
    const count = await CustomerQueryByProduct.countDocuments();

    res
      .status(200)
      .json({ success: true, data: buyerQuery, totalDocuments: count });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
