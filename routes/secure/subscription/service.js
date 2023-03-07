const express = require("express");

const router = express.Router();



const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");

const Services = require("../../../model/pricing/service");
const MRP_Rate = require("../../../model/pricing/pricing");

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
      mrp_id,
      rate,
      unit,
      mrp,

      quantity,
      price,
      benifits,
      type
    } = req.body;

   

    if (!name) {
      res.json({ success: false, message: "Service Name is mandatory" });
    }  const mrpData = await MRP_Rate.findOne({ _id: mrp_id }, { price: 1, unit: 1 })
    if (!mrpData) {
      res.status(400).json({ message: "Mrp Rate is Mandatory" })
    }else {
      const isService = await Services.findOne({
        name: name,
       });
     
      if (isService) {
        res.json({ success: false, message: `${isService?.name} has Already created try with new` });
      } else {
    
          try {
          

            const service = await new Services({
              name: name,
              mrp_id: mrp_id,
              rate: mrpData?.price,
              unit: mrpData?.unit,
              mrp: mrpData,
              quantity: quantity,
              price: price,
              benifits: benifits,
              type: type
              // category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
            });
            await service.save();
            res.status(200).json({ success: true, data: service, message: `${service?.name} services has  created Successfully` });
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
    const { name, mrp_id, rate, unit, mrp, quantity, price, benifits } = req.body
    const mrpData = await MRP_Rate.findOne(
      { _id: mrp_id }, {
      price: 1,
      unit: 1
    }
    )
    
    const serviceData= await Services.find({_id:_id})

    // if(mrpData?.price==(serviceData?.rate)){
     
    //   res.status(403).json({success:false,message:`${mrpData?.price} is already exist`})

    // }else{
      try {
        const service = await Services.updateOne(
          { _id },
          {
            name: name,
            mrp_id: mrp_id,
            rate: mrpData?.price,
            unit: mrpData?.unit,
            mrp: mrpData,
            quantity: quantity,
            price: price,
            benifits: benifits
          },
          {
            new: true,
            upsert: true,
          }
        );
        //Fields
        res.json({
          success: true,
          message: `${service?.name} Service  has Updated Sucessfully`,
          data: service,
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
    const service = await Services.findOneAndDelete({ _id: _id });

    res.json({
      success: true,
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