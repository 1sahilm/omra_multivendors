const express = require("express");
const { default: mongoose } = require("mongoose");
const UserModel = require("../../model/model");
const Product = require("../../model/products/product");
const Category = require("../../model/products/category");
const { hashPassword } = require("../../functions/passwordHash");
const CustomerQueryByProduct = require("../../model/products/CustomerQuery");
const router = express.Router();

// Superadmin DashboardTab user services
router.get("/getting-user-services", async (req, res) => {
  const { _id } = req.user;
  const _testid = req;
  try {
    const user = await UserModel.findOne(
      { _id },
      {
        isDashboardTab: 1,
        isMerchantTab: 1,
        isUersTab: 1,
        isCategoryTab: 1,
        isSubcategoryTab: 1,
        isBlogsTab: 1,
        isListingsTab: 1,
        isPricingTab: 1,
        isBannerTab: 1,
        isLeadsTab: 1,
      }
    );
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.json({
      message: err?.message,
    });
  }
});

router.get("/emailLeadsPaginate?", async (req, res) => {
  let { page = 1, limit = 20 } = req.query;
  page = Number(page);
  limit = Number(limit);

  try {
    const user = await CustomerQueryByProduct.find({ type: "Email Query" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalDocuments = await CustomerQueryByProduct.countDocuments({
      type: "Email Query",
    });

    const pages = Math.ceil(totalDocuments / 20);
    res.json({
      success: true,
      user: user,
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

router.get("/callingLeadsPaginate?", async (req, res) => {
  let { page = 1, limit = 20 } = req.query;
  page = Number(page);
  limit = Number(limit);

  try {
    const user = await CustomerQueryByProduct.find({ type: "Calling Query" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalDocuments = await CustomerQueryByProduct.countDocuments({
      type: "Calling Query",
    });

    const pages = Math.ceil(totalDocuments / 20);
    res.json({
      success: true,
      user: user,
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
      .populate(populateQuery)
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

router.get("/demo-enquiry-by-search/:key", async (req, res) => {
  try {
    const data = await Enquiry.find({
      $or: [
        { name: { $regex: req.params.key, $options: "$i" } },
        { mobile: { $regex: req.params.key, $options: "$i" } },
        { business_name: { $regex: req.params.key, $options: "$i" } },
      ],
      type: "demo",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/demo-enquiryFilterByDate/:key", async (req, res) => {
  try {
    const data = await Enquiry.find({
      updatedAt: {
        $gte: new Date(req.params.key),
        // $lte: new Date(),
      },
      type: "demo",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/demo-enquiryFilterByDateRange", async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  try {
    const data = await Enquiry.find({
      updatedAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
      type: "demo",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

//=================================================Supplires centers=========
router.get("/supplier-enquiry-by-search/:key", async (req, res) => {
  try {
    const data = await Supplier.find({
      $or: [
        { name: { $regex: req.params.key, $options: "$i" } },
        { email: { $regex: req.params.key, $options: "$i" } },
        { company_name: { $regex: req.params.key, $options: "$i" } },
      ],
      // type: "demo"
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/supplier-enquiryFilterByDate/:key", async (req, res) => {
  try {
    const data = await Supplier.find({
      createdAt: {
        $gte: new Date(req.params.key),
        // $lte: new Date(),
      },
      // type: "demo",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/supplier-enquiryFilterByDateRange", async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  try {
    const data = await Supplier.find({
      createdAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
      // type: "demo",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/get_subscribe", async (req, res) => {
  const testdata = await Subscription.find({}).sort({ createdDate: "asc" });
  length = testdata.length;
  const invoice = testdata[testdata.length - 1];

  try {
    const service = await Subscription.find({});

    res.status(200).json({ data: service, success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
