const express = require("express");

const router = express.Router();



const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");

const Services = require("../../../model/pricing/service");

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
  "/add_service",
  upload.fields([
    { name: "category_image", maxCount: 1 },
    { name: "category_image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const { 
      name,
      rate,
      unit,
      quantity,
      price,
      benifits,
      type
} = req.body;

    if (!name) {
      res.json({ success: false, message: "Service Name is mandatory" });
    } else {
      const isService = await Services.findOne({
        name: name,
      });
      if (isService) {
        res.json({ success: false, message: `${isService?.name} has Already created try with new` });
      } else {
        try {
          const service = await new Services({
            name: name,
            rate:rate,
            quantity:quantity,
            unit:unit,
            price: price,
            benifits: benifits,
            type:type
            // category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
          });
          await service.save();
          res.status(200).json({success:true,data:service,message:`${service?.name} services has  created Successfully`});
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    }
  }
);

router.patch(
  "/update_service/:_id",

  async (req, res) => {
    const { _id } = req.params;

    try {
      const service = await Services.updateOne(
        { _id },
        {
          name: req.body.name,
          rate:rate.body.rate,
          unit:req.body.unit,
          quantity:req.body.quantity,
          price:req.body.price,
          benifits:req.body.benifits

       
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success:true,
        message: `${service?.name} Service  has Updated Sucessfully`,
        data:service,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);



///=====================

router.delete("/delete_service/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const service =await Services.findOneAndDelete({ _id:_id });
    
    res.json({
      success:true,
      message: `${service?.name} has deleted Sucessfully`,
      service,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

router.get("/get_service", async (req, res) => {
  try {
    const service = await Services.find({});

    res.status(200).json(await service);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});



module.exports = router;