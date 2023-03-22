const express = require("express");
const { default: mongoose } = require("mongoose");
const UserModel = require("../../model/model");
const Product = require("../../model/products/product");
const Category = require("../../model/products/category");
const router = express.Router();

router.get("/user-catalog/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UserModel.find({ _id });
    const data = await Product.find({ auther_Id: _id });
    res.json({ user: user, products: data });
  } catch (error) {}
});

router.patch("/approved_product/:_id", async (req, res) => {
  const { _id } = req.params;
  const update_product = req.body;
  const date = new Date();
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No post Available");
    const product = await Product.findOne(
      { _id },
      {
        isApproved: req.body.isApproved,
        approved_date: date,
      }
    );
    product.isApproved = req.body.isApproved;

    await product.save();

    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
});

//===================================  declined
router.patch("/declined_product/:_id", async (req, res) => {
  const { _id } = req.params;
  const update_product = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("No post Available");

    const product = await Product.findOne({ _id });
    product.isDeclined = req.body.isDeclined;
    product.status = req.body.status;
    product.message = req.body.message;

    await product.save();
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({ message: err?.message });
  }
});

// ===============Approved Product Search=========================
// ===================================testing==================
router.get("/ApprovedSearch/:key", async (req, res) => {
  try {
    const populateQuery = [
      {
        path: "auther_Id",
        model: UserModel,
        select: { Merchant_Name: 1, company_Name: 1 },
      },
      {
        path: "category",
        model: Category,
        select: { category_name: 1 },
      },
    ];
    const merchant_name = await UserModel.find({
      $or: [{ Merchant_Name: { $regex: req.params.key, $options: "$i" } }],
    }).limit(5);

    const data = await Product.find({
      $or: [
        { category: { $regex: req.params.key, $options: "$i" } },
        { sub_category: { $regex: req.params.key, $options: "$i" } },
        { brand: { $regex: req.params.key, $options: "$i" } },
        { product_name: { $regex: req.params.key, $options: "$i" } },
        { vendors_name: { $regex: req.params.key, $options: "$i" } },
      ],
      isActive: true,
      isApproved: true,
    }).populate(populateQuery);
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

// ==================== All Email Leads Pagination API =============================
router.get("/approvedProductPaginate?", async (req, res) => {
  let { page = 1, limit = 20 } = req.query;
  page = Number(page);
  limit = Number(limit);

  const populateQuery = [
    {
      path: "auther_Id",
      model: UserModel,
      select: { Merchant_Name: 1, company_Name: 1 },
    },
    {
      path: "category",
      model: Category,
      select: { category_name: 1 },
    },
  ];
  try {
    const user = await Product.find({ isApproved: true })
      // .populate(populateQuery)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const totalDocuments = await Product.countDocuments({
      isApproved: true,
    });
    const pages = Math.ceil(totalDocuments / 20);
    res.json({
      success: true,
      data: user,
      totalPages: pages,
      count: totalDocuments,
      min: limit * page - limit,
      max: limit * page,
      currentPage: page,
      nextPage: page < pages ? page + 1 : null,
    });
  } catch (err) {
    res.json({
      message: err?.message,
    });
  }
});

module.exports = router;
