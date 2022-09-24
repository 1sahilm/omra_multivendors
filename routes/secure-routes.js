const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const UserModel = require("../model/model");

const Product = require("../model/products/product");
const ProductProfile = require("../model/products/product_profile");
const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");
const CustomerQueryByProduct = require("../model/products/CustomerQuery");
// const fs = require("fs");
// const { sendEmail } = require("../lib/mailer");
// const { request } = require("http");

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

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Please upload a Image"));
        }
        cb(undefined, true);
    },
});

// const videoUpload = multer({
//   storage: videoStorage,
//   limits: {
//   fileSize: 10000000 // 10000000 Bytes = 10 MB
//   },
//   fileFilter(req, file, cb) {
//     // upload only mp4 and mkv format
//     if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
//        return cb(new Error('Please upload a video'))
//     }
//     cb(undefined, true)
//  }
// })

router.get("/profile", (req, res, next) => {
    res.json({
        message: "You made it to the secure route",
        user: req.user,
        token: req.query.secret_token,
    });
});
router.get("/test", (req, res, next) => {
    res.json({
        message: "You made it to the secure route",
        user: req.user,
        token: req.query.secret_token,
    });
});

//===================deactivate users==================
//===================deactivate users==================
router.patch("/deactivate/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const user = await UserModel.findOne({ _id });
        user.isActive = req.body.isActive;
        const data = await Product.updateMany(
            { auther_Id: _id },
            { $set: { isActive: req.body.isActive } }
        );

        await user.save();
        console.log({ user: user, product: data });
        res.status(200).send({ user: user, product: data });
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});
//=======================

router.patch("/deactivat1111111/:_id", async (req, res) => {
    const { _id } = req.params;
    console.log("userIddddddd", _id);
    console.log("hello babba ksie ho");
    try {
        const User = await UserModel.updateOne(
            {
                _id: _id,
            },
            {
                isActive: req.body.isActive,
            },
            {
                new: true,
                upsert: true,
            }
        );
        res.json({
            message: "User Updated Sucessfully",
            User,
        });
    } catch (error) {
        res.json({
            message: error?.message,
        });
    }
});

router.patch("/details", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: _id },
            {
                Merchant_Name: req.body.Merchant_Name,
                Merchant_Address: req.body.Merchant_Address,
                TypesOf_Bussiness: req.body.TypesOf_Bussiness,
                SubTypeOf_bussiness: req.body.SubTypeOf_bussiness,
                Merchant_Designation: req.body.Merchant_Designation,
                Year_of_establishment: req.body.Year_of_establishment,
                Merchant_ServiceArea_Pincodes:
                    req.body.Merchant_ServiceArea_Pincodes,
                GST_No: req.body.GST_No,
                PAN_No: req.body.PAN_No,
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
});

router.get("/details", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOne({ _id: _id });
        // const user = await UserModel.find({ role: "Admin" });
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

router.get("/userDetails", async (req, res) => {
    const { _id, password, email } = req.user;

    try {
        await UserModel.find({}, { password: 0 })
            .lean()
            .then(async (data) => {
                const newdata = await Promise.all(
                    data.map(async (user) => ({
                        ...user,
                        leadCount:
                            (await CustomerQueryByProduct.countDocuments({
                                merchant_Id: user._id,
                            })) || 0,
                    }))
                );

                res.json({
                    success: "Sucessfully",
                    user: newdata,
                });
            });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});

router.get("/userActivity", async (req, res) => {
    const { _id, password, email } = req.user;

    const isActive = req.params.isActive;

    try {
        const user = await UserModel.find({}, { isActive: 1 });
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

router.patch("/companyprofile", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOneAndUpdate(
            { _id },
            {
                Merchant_Name: req.body.Merchant_Name,
                company_Name: req.body.company_Name,
                description: req.body.description,
                Category1: req.body.Category1,
                Category2: req.body.Category2,
                Category3: req.body.Category3,
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
});

router.get("/companyprofile", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOne({ _id });
        //Fields

        res.json({
            success: true,
            user,
        });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});
const upload = multer({ storage: imageStorage });

router.post(
    "/upload_product",
    upload.fields([
        { name: "product_image1" },
        { name: "product_image2" },
        { name: "product_image3" },
        { name: "product_image4" },
        { name: "product_image5" },
    ]),
    async (req, res) => {
        // const { user } = req.user;
        const { _id } = req.user;
        const {
            product_name,
            manufacturer_name,
            manufacturer_phone_no,
            manufacturer_address,
            brand,
            videos,
            category,
            sub_category,
            price,
            product_Specification,
            additionalSpecification,
            product_description,
            capacity,
            product_code,
            delivery_time,
            model_no,
            type,
            made_in,
        } = req.body;

        const userData = await UserModel.findOne(
            { _id: _id },
            {
                GST_No: 1,
                Merchant_Name: 1,
                TypesOf_Bussiness: 1,
                SubTypeOf_bussiness: 1,
                Merchant_Address: 1,
                mobile_no: 1,
                isActive: 1,
            }
        );
        if (!product_name || !category) {
            res.json({
                success: false,
                data: "product name and category is compulsory",
            });
        } else {
            const autocomplete = await Product.findOne({
                product_name: product_name,
                category: category,
            });

            if (autocomplete) {
                res.json({
                    success: false,
                    data: "This Product already created",
                });
            } else {
                try {
                    const product = await new Product({
                        auther_Id: _id,
                        Vendor_Id: userData.GST_No,
                        vendors_name: userData.Merchant_Name,
                        mobile_no: userData.mobile_no,
                        isActive: userData.isActive,
                        TypesOf_Bussiness: userData.TypesOf_Bussiness,
                        SubTypeOf_bussiness: userData.SubTypeOf_bussiness,
                        Merchant_Address: userData.Merchant_Address,
                        product_name: product_name,
                        manufacturer_name: manufacturer_name,
                        manufacturer_phone_no: manufacturer_phone_no,
                        manufacturer_address: manufacturer_address,
                        brand: brand,

                        product_image1:
                            req.files.product_image1?.length > 0
                                ? `${process.env.BASE_URL}/product-image/${req.files.product_image1[0].filename}`
                                : undefined,
                        product_image2:
                            req.files.product_image2?.length > 0
                                ? `${process.env.BASE_URL}/product-image/${req.files.product_image2[0].filename}`
                                : undefined,
                        product_image3:
                            req.files.product_image3?.length > 0
                                ? `${process.env.BASE_URL}/product-image/${req.files.product_image3[0].filename}`
                                : undefined,
                        product_image4:
                            req.files.product_image4?.length > 0
                                ? `${process.env.BASE_URL}/product-image/${req.files.product_image4[0].filename}`
                                : undefined,
                        product_image5:
                            req.files.product_image5?.length > 0
                                ? `${process.env.BASE_URL}/product-image/${req.files.product_image5[0].filename}`
                                : undefined,

                        // product_image2: req.files.product_image2[0].filename,
                        videos: videos,
                        category: category,
                        sub_category: sub_category,
                        price: price,
                        product_Specification: product_Specification,
                        additionalSpecification: JSON.parse(
                            additionalSpecification
                        ),
                        product_description: product_description,
                        capacity: capacity,
                        product_code: product_code,
                        delivery_time: delivery_time,

                        model_no: model_no,
                        made_in: made_in,
                        type: type,
                    });

                    await product.save();
                    res.status(200).send(product);
                } catch (err) {
                    res.status(500).send({ message: err?.message });
                }
            }
        }
    }
);

//=============================================

router.patch(
    "/update_product_By/:_id",
    upload.fields([
        { name: "product_image1" },
        { name: "product_image2" },
        { name: "product_image3" },
        { name: "product_image4" },
        { name: "product_image5" },
    ]),
    async (req, res) => {
        const { _id } = req.params;
        const {
            product_name,
            manufacturer_name,
            manufacturer_phone_no,
            manufacturer_address,
            brand,
            videos,
            category,
            sub_category,
            price,
            product_Specification,
            additionalSpecification,
            product_description,
            capacity,
            product_code,
            delivery_time,
            model_no,
            type,
            made_in,
        } = req.body;

        try {
            const user = await Product.updateOne(
                { _id },
                {
                    product_name: product_name,
                    manufacturer_name: manufacturer_name,
                    manufacturer_phone_no: manufacturer_phone_no,
                    manufacturer_address: manufacturer_address,
                    brand: brand,

                    product_image1:
                        req.files.product_image1?.length > 0
                            ? `${process.env.BASE_URL}/product-image/${req.files.product_image1[0].filename}`
                            : undefined,
                    product_image2:
                        req.files.product_image2?.length > 0
                            ? `${process.env.BASE_URL}/product-image/${req.files.product_image2[0].filename}`
                            : undefined,
                    product_image3:
                        req.files.product_image3?.length > 0
                            ? `${process.env.BASE_URL}/product-image/${req.files.product_image3[0].filename}`
                            : undefined,
                    product_image4:
                        req.files.product_image4?.length > 0
                            ? `${process.env.BASE_URL}/product-image/${req.files.product_image4[0].filename}`
                            : undefined,
                    product_image5:
                        req.files.product_image5?.length > 0
                            ? `${process.env.BASE_URL}/product-image/${req.files.product_image5[0].filename}`
                            : undefined,

                    // product_image2: req.files.product_image2[0].filename,
                    // videos: videos,
                    category: category,
                    sub_category: sub_category,
                    price: price,
                    product_Specification: product_Specification,
                    additionalSpecification: JSON.parse(
                        additionalSpecification
                    ),
                    product_description: product_description,
                    capacity: capacity,
                    product_code: product_code,
                    delivery_time: delivery_time,
                    made_in: made_in,

                    model_no: model_no,
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

router.get("/get_products", async (req, res) => {
    // const { user } = req.user;
    // const userData = await UserModel.findOne(
    //   { _id: user._id },
    //   { GST_No: 1, Merchant_Name: 1 ,TypesOf_Bussiness: 1}
    // );
    try {
        const product1 = await Product.find().sort({ createdAt: -1 });
        const userData = await UserModel.find({}, { _id: 1, isActive: 1 });
        const product = { ...product1, ...userData };
        console.log("babagdtbftfshgf", product);

        res.status(200).json(product1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
///
router.get("/get_product/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// update product====================================Update product for Approved==

router.patch("/approved_product/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;
    console.log(req.body.category);
    console.log(_id);

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const product = await Product.findOne({ _id });
        product.isApproved = req.body.isApproved;

        await product.save();
        console.log(product);
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});

router.get("/getApprovedCount", async (req, res) => {
    try {
        const product = await Product.find({ isApproved: true }).count();
        console.log({ "helloo babab": product });

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//===================================  declined

router.patch("/declined_product/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;
    console.log("declinesd yeseees", req.body);
    console.log(_id);

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

router.get("/getDeclinedProductCount", async (req, res) => {
    try {
        const product = await Product.find({ isDeclined: true }).count();

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/// product profile

router.post("/company_profile", async (req, res) => {
    const { user } = req;

    const userData = await ProductProfile.findOne(
        { _id: user.id },
        { GST_No: 1, Merchant_Name: 1 }
    );

    try {
        const product = new ProductProfile({
            Vendor_Id: userData.GST_No,
            vendors_name: userData.Merchant_Name,
            product_name: req.body.product_name,
            description: req.body.description,

            type: req.body.type,
        });
        await product.save();
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});

module.exports = router;
