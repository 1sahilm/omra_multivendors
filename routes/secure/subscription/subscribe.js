const express = require("express");

const router = express.Router();



const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");

const Services = require("../../../model/pricing/service");

const UserModel = require("../../../model/model");
const Subscription = require("../../../model/pricing/subscription");

//=====================================================

const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: "public/billing",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "_" + Date.now() + path.extname(file.originalname)
        );
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    },
});

const upload = multer({ storage: imageStorage });

router.post(
    "/add_subscribe",
    upload.fields([
        { name: "category_image", maxCount: 1 },
        { name: "category_image2", maxCount: 1 },
    ]),
    async (req, res) => {
        // const {_id}= req.user
        // console.log("ggg",req.user)
        // const test= await UserModel.find({role: 'Admin'},{password:0,Merchant_Designation:0,SubTypeOf_bussiness:0,TypesOf_Bussiness:0,description:0,PAN_No:0,
        // Year_of_establishment:0})
        // const datatArray= [];
        // const user= test.filter((item)=>datatArray.push({id:item._id}))

        // console.log("helloo",datatArray)
        const {
            auther_Id,
            mobile_no,
            vendors_name,
            email,
            GST_No,
            address,
            name,
            plan,
            plan2,
            payment_mode,
            start_date,
            end_date,
            price,
            benifits,
            validity,
            gst,
            total,
            Amount,
            payment_link,
            payment_status
        } = req.body;
        console.log("daringbaba", auther_Id)

        if (!auther_Id) {
            res.json({ success: false, message: "user select Name is mandatory" });
        } else {
            const isSubscribe = await Subscription.findOne({
                auther_Id: auther_Id
            });
            if (isSubscribe) {
                res.json({ success: false, message: `${isSubscribe?.vendors_name} has Already Subscribe try with new` });
            }


            try {
                const subscribe = await new Subscription({
                    auther_Id: auther_Id,
                    mobile_no: mobile_no,
                    vendors_name: vendors_name,
                    email: email,
                    GST_No: GST_No,
                    address: address,
                    name: name,
                    plan: JSON.parse(plan),
                    plan2: plan2,
                    payment_mode: payment_mode,
                    start_date: start_date,
                    end_date: end_date,
                    price: price,
                    benifits: benifits,
                    validity: validity,
                    gst: gst,
                    total: total,
                    Amount: Amount,
                    payment_link: payment_link,
                    payment_status: payment_status
                    // category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
                });
                await subscribe.save();
                res.status(200).json({ success: true, data: subscribe, message: `${subscribe?.vendors_name} whose mobile no:${subscribe?.mobile_no} has  created Successfully` });
            } catch (err) {
                res.status(500).send({ message: err?.message });
            }


        }
    }

);

router.patch(
    "/upload_payment_details/:_id",
    upload.fields([
        { name: "image", maxCount: 1 },

    ]),
    async (req, res) => {
        const { _id } = req.params;




        try {
            const payment = await Subscription.updateOne(
                { _id },
                {

                    auther_Id: req.body.auther_Id,


                    payment_mode: req.body.payment_mode,
                    payment_status: req.body.payment_status,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    price: req.body.price,
                    benifits: req.body.benifits,
                    image: `${process.env.BASE_URL}/billing-image/${req.files.image[0].filename}`,

                    validity: req.body.validity,

                    Amount: req.body.Amount




                },
                {
                    new: true,
                    upsert: true,
                }
            );
            //Fields

            res.json({
                success: true,
                message: `
                 ${payment?.name}
                 Service  has Updated Sucessfully`,
                data: payment,
            });
        } catch (err) {
            res.json({
                message: err?.message,
            });
        }
    }
);

router.patch(
    "/update_subscription/:_id",
    upload.fields(
        [
            { name: "category_image", maxCount: 1 },
            { name: "category_image2", maxCount: 1 },
        ]
        // upload.fields('banner_image1',5
    ),
    async (req, res) => {
        const { _id } = req.params;

        try {
            const service = await Subscription.updateOne(
                { _id },
                {
                    auther_Id: req.body.auther_Id,
                    mobile_no: req.body.mobile_no,
                    vendors_name: req.body.vendors_name,
                    email: req.body.email,
                    GST_No: req.body.GST_No,
                    address: req.body.address,
                    name: req.body.name,
                    plan: JSON.parse(req.body.plan),
                    plan2: req.body.plan2,
                    payment_mode: req.body.payment_mode,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    price: req.body.price,
                    benifits: req.body.benifits,
                    validity: req.body.validity,
                    gst: req.body.gst,
                    total: req.body.total,
                    Amoun: req.body.Amount,
                    payment_link: req.body.payment_link
                },
                {
                    new: true,
                    upsert: true,
                }
            );
            //Fields

            res.json({
                success: true,
                message: `
                 ${service?.name}
                 Service  has Updated Sucessfully`,
               
            });
        } catch (err) {
            res.json({
                message: err?.message,
            });
        }
    }
);


router.patch(
    "/resend-pay-link/:_id",
    upload.fields(
        [
            { name: "category_image", maxCount: 1 },
            { name: "category_image2", maxCount: 1 },
        ]
        // upload.fields('banner_image1',5
    ),
    async (req, res) => {
        const { _id } = req.params;
        const {payment_link}=req.body
        console.log(_id,payment_link)

        try {
            const service = await Subscription.updateOne(
                { _id },
                {
                
                  
                    payment_link: req.body.payment_link
                },
                {
                    new: true,
                    upsert: true,
                }
            );
            //Fields

            res.json({
                success: true,
                message: `${service?.payment_link} Service  has Updated Sucessfully`,
                data:service
              
            });
        } catch (err) {
            res.json({
                message: err?.message,
            });
        }
    }
);



///=====================

router.delete("/delete_subscription/:_id", async (req, res) => {
    const { _id } = req.params;

    try {
        const service = await Subscription.findOneAndDelete({ _id: _id });

        res.json({
            success: true,
            message: `${service?.name} has deleted Sucessfully`,
            service,
        });
    } catch (error) {
        res.json({ message: error?.message, success: false });
    }
});

router.get("/get_subscribe", async (req, res) => {
    try {
        const service = await Subscription.find({});

        res.status(200).json({ data: service, success: true });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



module.exports = router;