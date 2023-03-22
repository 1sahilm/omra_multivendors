const express = require("express");
const { default: mongoose } = require("mongoose");
const AMC = require("../../model/enquiry/amc");
const Enquiry = require("../../model/enquiry/enquiry");
const Supplier = require("../../model/enquiry/supplier");
const UserModel = require("../../model/model");
const CustomerQueryByProduct = require("../../model/products/CustomerQuery");
const Product = require("../../model/products/product");
const router = express.Router();

router.get("/user-catalog/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UserModel.find({ _id });
    const data = await Product.find({ auther_Id: _id });

    res.json({ user: user, products: data });
  } catch (error) {}
});

router.get("/bulk-enquiry-by-search/:key", async (req, res) => {
  try {
    const data = await Enquiry.find({
      $or: [
        { name: { $regex: req.params.key, $options: "$i" } },
        { mobile: { $regex: req.params.key, $options: "$i" } },
        { business_name: { $regex: req.params.key, $options: "$i" } },
      ],
      type: "bulk-enquiry",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});
//=================================================
router.get("/bulk-enquiryFilterByDate/:key", async (req, res) => {
  try {
    const data = await Enquiry.find({
      updatedAt: {
        $gte: new Date(req.params.key),
        // $lte: new Date(),
      },
      type: "bulk-enquiry",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/bulk-enquiryFilterByDateRange", async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  try {
    const data = await Enquiry.find({
      updatedAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
      type: "bulk-enquiry",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

// ============================ For Demo =====================Demo===============

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

//=================================================Amc requirement=========
router.get("/amc-enquiry-by-search/:key", async (req, res) => {
  console.log(req.user);
  console.log(req.params.key, "keyyyy");
  try {
    const data = await AMC.find({
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
router.get("/amc-enquiryFilterByDate/:key", async (req, res) => {
  try {
    const data = await AMC.find({
      updatedAt: {
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

router.get("/amc-enquiryFilterByDateRange", async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  try {
    const data = await AMC.find({
      updatedAt: {
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

// ==================== Email Leads Pagination API =============================
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

// ==================== Calling Leads Pagination API =============================
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

//================================================Email Leads=========
router.get("/email-enquiry-by-search/:key", async (req, res) => {
  const query = req.params.key;
  try {
    const data = await CustomerQueryByProduct.find({
      $or: [
        { buyer_Mob: { $regex: query, $options: "$i" } },
        { buyer_Email: { $regex: query, $options: "$i" } },
        { product_name: { $regex: query, $options: "$i" } },
      ],
      type: "Email Query",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/email-enquiryFilterByDate/:key", async (req, res) => {
  try {
    const data = await CustomerQueryByProduct.find({
      createdAt: {
        $gte: new Date(req.params.key),
        // $lte: new Date(),
      },
      // type: "demo",
      type: "Email Query",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/email-enquiryFilterByDateRange", async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  try {
    const data = await CustomerQueryByProduct.find({
      updatedAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
      // type: "demo",
      type: "Email Query",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

//================================================Mobile Leads=========
router.get("/calling-enquiry-by-search/:key", async (req, res) => {
  console.log(req.params.key, "search queryy");
  try {
    const data = await CustomerQueryByProduct.find({
      $or: [
        { buyer_Mob: { $regex: req.params.key, $options: "$i" } },
        { buyer_Email: { $regex: req.params.key, $options: "$i" } },
        { product_name: { $regex: req.params.key, $options: "$i" } },
      ],

      type: "Calling Query",
    });

    res.json(data);
  } catch (error) {
    res.json(404);
  }
});
router.get("/calling-enquiryFilterByDate/:key", async (req, res) => {
  try {
    const data = await CustomerQueryByProduct.find({
      createdAt: {
        $gte: new Date(req.params.key),
        // $lte: new Date(),
      },
      // type: "demo",
      type: "Calling Query",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.get("/calling-enquiryFilterByDateRange", async (req, res) => {
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;
  try {
    const data = await CustomerQueryByProduct.find({
      createdAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
      type: "Calling Query",
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

module.exports = router;
