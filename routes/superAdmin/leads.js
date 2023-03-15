
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
    const { _id } = req.params
    try {
        const user = await UserModel.find({ _id })
        const data = await Product.find({ auther_Id: _id })


        res.json({ user: user, products: data })

    } catch (error) {

    }
})


router.get("/bulk-enquiry-by-search/:key", async (req, res) => {

    try {
        const data = await Enquiry.find({
            $or: [
                { name: { $regex: req.params.key, $options: "$i" } },
                { mobile: { $regex: req.params.key, $options: "$i" } },
                { business_name: { $regex: req.params.key, $options: "$i" } },
            ],
            type: "bulk-enquiry"
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

    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
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
            type: "demo"
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
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
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
    console.log(req.user)
    console.log(req.params.key, "keyyyy")
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
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
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
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
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

//================================================Email Leads=========
router.get("/email-enquiry-by-search/:key", async (req, res) => {
    try {
        const data = await CustomerQueryByProduct.find({

            $or: [
                { name: { $regex: req.params.key, $options: "$i" } },
                { buyer_Email: { $regex: req.params.key, $options: "$i" } },
                { product_name: { $regex: req.params.key, $options: "$i" } },

            ],
            // type: "demo"
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
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
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
    try {
        const data = await CustomerQueryByProduct.find({

            $or: [
                { name: { $regex: req.params.key, $options: "$i" } },
                { buyer_Email: { $regex: req.params.key, $options: "$i" } },
                { product_name: { $regex: req.params.key, $options: "$i" } },

            ],
            // type: "demo"
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
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
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








