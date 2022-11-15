const express = require("express");

const router = express.Router();

const upload = require("../config/multer");
const Banners = require("../model/banner/banner");

//=====================================================

router.post(
    "/upload_data",
    upload.fields([{ name: "image" }]),

    async(req, res) => {
        const { type, name, product_id } = req.body;
        if (!name) {
            res.json({ success: false, data: "File name is mandatory" });
        } else {
            const bannerType = await Banners.findOne({ name: name });
            if (bannerType) {
                res.json({ success: false, data: "This file Name is already created" });
            } else {
                try {
                    const item = {
                        name: name,

                        image: req.files.image ? .length > 0 ?
                            `${process.env.BASE_URL}/banner-image/${req.files.image[0].filename}` :
                            undefined,

                        type: type,
                    };
                    const banner = await new Banners(item);
                    banner.save();
                    res.status(200).send(banner);
                } catch (err) {
                    res.status(500).send({ message: err ? .message });
                }
            }
        }
    }
);

router.patch(
    "/update_data/:_id",
    upload.fields([{ name: "image" }]),
    async(req, res) => {
        const { _id } = req.params;
        const { type, name, category_id } = req.body;

        try {
            const user = await Banners.updateOne({ _id }, {
                name: name,

                image: req.files.image ? .length > 0 ?
                    `${process.env.BASE_URL}/banner-image/${req.files.image[0].filename}` :
                    undefined,

                type: type,
            }, {
                new: true,
                upsert: true,
            });
            //Fields

            res.json({
                message: "User Updated Sucessfully",
                user,
            });
        } catch (err) {
            res.json({
                message: err ? .message,
            });
        }
    }
);

router.get("/get_banner", async(req, res) => {
    try {
        const product = await Banners.find();

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});