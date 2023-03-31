const express = require("express");
const { default: mongoose } = require("mongoose");
const UserModel = require("../../model/model");
const Product = require("../../model/products/product");
const Category = require("../../model/products/category");
const { hashPassword } = require("../../functions/passwordHash");
const router = express.Router();

router.get("/user-catalog/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const user = await UserModel.find({ _id });
    const data = await Product.find({ auther_Id: _id });
    res.json({ user: user, products: data });
  } catch (error) {}
});

// Superadmin create role based user...
router.post("/create-user", async (req, res) => {
  const {
    email,
    password,
    mobile_no,
    Merchant_Name,
    SubTypeOf_bussiness,
    TypesOf_Bussiness,
    Merchant_ServiceArea_Pincodes,
    Merchant_Designation,
    Merchant_City,
    Merchant_Address,
    Year_of_establishment,
    GST_No,
    PAN_No,
    Service,
    role,
    company_Name,
  } = req.body;
  try {
    if (!Merchant_Name || !mobile_no || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validation...
    const checkEmail = await UserModel.findOne({ email: email });
    const checkMobile = await UserModel.findOne({ mobile_no: mobile_no });

    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists, Enter a unique Email" });
    } else if (checkMobile) {
      return res
        .status(400)
        .json({ message: "Mobile already exists, Enter a unique Mobile" });
    }

    const payload = {
      Merchant_Name: Merchant_Name,
      email: email,
      password: hashPassword(password),
      mobile_no: mobile_no,
      company_Name: company_Name,
      TypesOf_Bussiness: TypesOf_Bussiness,
      SubTypeOf_bussiness: SubTypeOf_bussiness,
      role: role,
      GST_No: GST_No,
      PAN_No: PAN_No,
      Year_of_establishment: Year_of_establishment,
      Service: Service,
      Merchant_City: Merchant_City,
      Merchant_ServiceArea_Pincodes: Merchant_ServiceArea_Pincodes,
      Merchant_Designation: Merchant_Designation,
      Merchant_Address: Merchant_Address,
    };

    const user = new UserModel(payload);
    user.save();
    res.status(201).json({
      success: true,
      user: user,
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Superadmin Listing role based user by search...
router.get("/searchRoleBasedUser/:key", async (req, res) => {
  try {
    const data = await UserModel.find({
      $or: [
        { Merchant_Name: { $regex: req.params.key, $options: "$i" } },
        { mobile_no: { $regex: req.params.key, $options: "$i" } },
        { email: { $regex: req.params.key, $options: "$i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

router.patch("/update-user/:_id", async (req, res) => {
  const _id = req.params;
  const isAdmin = req;
  const { password } = req.body;

  if (isAdmin.user.role === "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          Merchant_Name: req.body.Merchant_Name,
          Merchant_Address: req.body.Merchant_Address,
          Merchant_City: req.body.Merchant_City,
          TypesOf_Bussiness: req.body.TypesOf_Bussiness,
          SubTypeOf_bussiness: req.body.SubTypeOf_bussiness,
          Merchant_Designation: req.body.Merchant_Designation,
          Year_of_establishment: req.body.Year_of_establishment,
          password: hashPassword(password),
          GST_No: req.body.GST_No,
          PAN_No: req.body.PAN_No,
        },
        {
          new: true,
          upsert: true,
        }
      );

      //Fields
      res.status(200).json({
        success: true,
        message: "User Updated Sucessfully",
        user,
      });
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }
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

// Approved Product Search
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

// All Email Leads Pagination API
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
