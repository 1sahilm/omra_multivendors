const express = require("express");

const router = express.Router();



const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");

const Services = require("../../../model/pricing/service");
const Packages = require("../../../model/pricing/package");

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
    "/add_package",
    upload.fields([
        { name: "category_image", maxCount: 1 },
        { name: "category_image2", maxCount: 1 },
    ]),
    async (req, res) => {
        const {
            name,
            Services,
            price,
            benifits,
            validity,
            gst,
            
            Amount,
            type
        } = req.body;

        if (!name) {
            res.json({ success: false, data: "package Name is mandatory" });
        } else {
            const ispackage = await Packages.findOne({
                name: name,
            });
            if (ispackage) {
                res.json({ success: false, data: `${ispackage?.name} has Already created try with new` });
            } else {
                try {
                    const amount = await new Packages({name:name})
                    // const tttc= [...amount.Services,amount?.Services]
                    // const total1 =[...amount?.price,amount.price].reduce((a, b) => a + b, 0)
                    const package = await new Packages({
                        name: name,
                        price: price,
                        benifits: benifits,
                        Services:Services,
                        validity: validity,
                        gst: gst,
                       
                        Amount: Amount,
                        type:type
                        // category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
                    });
                    await package.save();
                    res.status(200).json({success:true, data: package, message: `${package?.name} has  created Successfully` });
                } catch (err) {
                    res.status(500).send({ message: err?.message });
                }
            }
        }
    }
);

router.patch(
    "/update_package/:_id",
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
            const service = await Packages.updateOne(
                { _id },
                {
                    name: req.body.name,
                    price: req.body.price,
                    benifits: req.body.benifits,
                    validity: req.body.validity,
                    gst: req.body.gst,
                    total: req.body.total,
                    Amount: req.body.Amount,



                },
                {
                    new: true,
                    upsert: true,
                }
            );
            //Fields

            res.json({
                success:true,
                message: `
                 ${service?.name}
                 Package  has Updated Sucessfully`,
                data:user,
            });
        } catch (err) {
            res.json({
                message: err?.message,
            });
        }
    }
);



///=====================

router.delete("/delete_package/:_id", async (req, res) => {
    const { _id } = req.params;

    try {
        const service = await Packages.findOneAndDelete({ _id: _id });

        res.json({
            success:true,
            message: `${service?.name} has deleted Sucessfully`,
            service,
        });
    } catch (error) {
        res.json({ message: error?.message, success: false });
    }
});

router.get("/get_package", async (req, res) => {
    try {
        const service = await Packages.find({});

        res.status(200).json({data:service,success:true});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



module.exports = router;