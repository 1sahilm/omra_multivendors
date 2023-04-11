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
  const { email, password, mobile_no, Merchant_Name, role } = req.body;
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
      role: role,
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
        // { role: { $regex: req.params.key, $options: "$i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});

// Superadmin Listing role based user...
router.get("/roleBasedUserDetailsPaginate?", async (req, res) => {
  const { _id, password, email } = req.user;
  console;
  let { page = 1, limit = 20, toDate, fromDate } = req.query;
  page = Number(page);
  limit = Number(limit);

  try {
    const user = await UserModel.find(
      { $or: [{ role: "Manager" }, { role: "Executive" }] },
      { password: 0 }
    )
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .lean();
    const totalDocuments = await UserModel.countDocuments(
      { $or: [{ role: "Manager" }, { role: "Executive" }] },
      { password: 0 }
    );

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

// Superadmin get all user services
router.get("/get-user-services", async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await UserModel.find(
      { $or: [{ role: "Manager" }, { role: "Executive" }] },
      { password: 0 }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.json({
      message: err.message,
    });
  }
});

// Superadmin DashboardTab user services

// dashboard-tab-user-services/:id
router.patch("/dashboardTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const dashboardTab = user?.isDashboardTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isDashboardTab: !dashboardTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin MerchantTab user services
router.patch("/merchantTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const merchantTab = user?.isMerchantTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isMerchantTab: !merchantTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin UserServicesTab user services
router.patch("/userTab-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const userTab = user?.isUersTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isUersTab: !userTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin CategoryTab user services
router.patch("/categoryTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const categoryTab = user?.isCategoryTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isCategoryTab: !categoryTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin SubcategoryTab user services
router.patch("/subcategoryTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const subcategoryTab = user?.isSubcategoryTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isSubcategoryTab: !subcategoryTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin BlogsTab user services
router.patch("/blogsTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const blogsTab = user?.isBlogsTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isBlogsTab: !blogsTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin ListingsTab user services
router.patch("/listingTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const listingTab = user?.isListingsTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isListingsTab: !listingTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin PricingTab user services
router.patch("/pricingTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const pricingTab = user?.isPricingTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isPricingTab: !pricingTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin BannerTab user services
router.patch("/bannerTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const bannerTab = user?.isBannerTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isBannerTab: !bannerTab,
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
        message: err.message,
      });
    }
  }
});

// Superadmin LeadsTab user services
router.patch("/leadsTab-user-services/:_id", async (req, res) => {
  const { _id } = req.params;
  const _testid = req;

  const user = await UserModel.findOne({ _id: _id });
  const leadsTab = user?.isLeadsTab;
  if (_testid.user.role == "SuperAdmin") {
    try {
      const user = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          isLeadsTab: !leadsTab,
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
        message: err.message,
      });
    }
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

module.exports = router;
