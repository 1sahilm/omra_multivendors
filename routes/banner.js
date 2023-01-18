const express = require("express");

const router = express.Router();

const upload = require("../config/multer");
const Banners = require("../model/banner/banner");

//=====================================================

router.post(
    "/upload_data",
    upload.fields([{ name: "banner_image" }]),

    async(req, res) => {
        const { type, merchant_name, merchant_id, product_id } = req.body;
        if (!merchant_id) {
            res.json({ success: false, data: "banner type is mandatory" });
        } else {
            const bannerType = await Banners.findOne({ merchant_id: merchant_id });
            if (bannerType) {
                res.json({ success: false, data: "This user's Banner is already created" });
            } else {
                try {
                    const item = {
                        merchant_id: merchant_id,
                        merchant_name:merchant_name,

                        banner_image: req.files.banner_image?.length > 0 ?
                            `${process.env.BASE_URL}/banner-image/${req.files.banner_image[0].filename}` :
                            undefined,

                        type: type,
                    };
                    const banner = await new Banners(item);
                    banner.save();
                    res.status(200).json({success:true,message:"Added Successfully",data:banner});
                } catch (err) {
                    res.status(500).send({ message: err?.message });
                }
            }
        }
    }
);

router.patch(
    "/update_data/:_id",
    upload.fields([{ name: "banner_image" }]),
    async(req, res) => {
        const { _id } = req.params;
        const { type, merchant_name, product_id, merchant_id, category_id } =
        req.body;

        try {
            const user = await Banners.updateOne({ _id }, {
                merchant_id: merchant_id,
                merchant_name:merchant_name,

                banner_image: req.files.banner_image?.length > 0 ?
                    `${process.env.BASE_URL}/banner-image/${req.files.banner_image[0].filename}` :
                    undefined,

                type: type,
            }, {
                new: true,
                upsert: true,
            });
            //Fields

            res.json({
                success:true,message:"Added Successfully",
                user,
            });
        } catch (err) {
            res.json({
                message: err?.message,
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

router.get("/get_teaser_banner", async(req, res) => {
    try {
        const product = await Banners.find({ type: "teaser" });

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
//  =================ShowCase1 is used to advertize by category=======================================
router.post(
    "/showcase1",
    upload.fields([{ name: "banner_image" }]),

    async(req, res) => {
        const { type, category_id,category_name } = req.body;
        if (!category_id) {
            res.json({ success: false, data: "banner type is mandatory" });
        } else {
            const bannerType = await Banners.findOne({ category_id: category_id });
            if (bannerType) {
                res.json({ success: false, data: "This banner is already created" });
            } else {
                try {
                    const item = {
                        category_id: category_id,
                        category_name:category_name,

                        banner_image: req.files.banner_image?.length > 0 ?
                            `${process.env.BASE_URL}/banner-image/${req.files.banner_image[0].filename}` :
                            undefined,

                        type: type,
                    };
                    const banner = await new Banners(item);
                    banner.save();
                    res.status(200).send(banner);
                } catch (err) {
                    res.status(500).send({ message: err?.message });
                }
            }
        }
    }
);

router.patch(
    "/update_showcase1/:_id",
    upload.fields([{ name: "banner_image" }]),
    async(req, res) => {
        const { _id } = req.params;
        const { type, category_name, product_id, merchant_id, category_id } =
        req.body;

        try {
            const user = await Banners.updateOne({ _id }, {
                category_id: category_id,
                category_name:category_name,

                banner_image: req.files.banner_image?.length > 0 ?
                    `${process.env.BASE_URL}/banner-image/${req.files.banner_image[0].filename}` :
                    undefined,

                // type: type,
            }, {
                new: true,
                upsert: true,
            });
            //Fields

            res.json({
                success:true,
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


router.get("/get_category_banner", async(req, res) => {
    try {
        const product = await Banners.find({ type: "showcase1" });

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//  =================ShowCase1 is used to advertize by product=============================
router.post(
    "/showcase2",
    upload.fields([{ name: "banner_image" }]),

    async(req, res) => {
        const { type, product_id,product_name } = req.body;
        if (!product_id) {
            res.json({ success: false, data: "banner type is mandatory" });
        } else {
            const bannerType = await Banners.findOne({ product_id: product_id });
            if (bannerType) {
                res.json({ success: false, data: "This banner is already created" });
            } else {
                try {
                    const item = {
                        product_id: product_id,
                        product_name:product_name,

                        banner_image: req.files.banner_image?.length > 0 ?
                            `${process.env.BASE_URL}/banner-image/${req.files.banner_image[0].filename}` :
                            undefined,

                        type: type,
                    };
                    const banner = await new Banners(item);
                    banner.save();
                    res.status(200).send(banner);
                } catch (err) {
                    res.status(500).send({ message: err?.message });
                }
            }
        }
    }
);

router.patch(
    "/update_showcase2/:_id",
    upload.fields([{ name: "banner_image" }]),
    async(req, res) => {
        const { _id } = req.params;
        const { type, product_name, merchant_id, product_id } = req.body;

        try {
            const user = await Banners.updateOne({ _id }, {
                product_id: product_id,
                product_name:product_name,

                banner_image: req.files.banner_image?.length > 0 ?
                    `${process.env.BASE_URL}/banner-image/${req.files.banner_image[0].filename}` :
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
                message: err?.message,
            });
        }
    }
);


router.get("/get_discount_banner", async(req, res) => {
    try {
        const product = await Banners.find({ type: "showcase2" });

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

module.exports = router;