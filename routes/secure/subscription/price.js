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
  "/add_price",
 
  async (req, res) => {
    const { 
   price,
   unit,
  type,
} = req.body;
console.log("price",price)

    if (!price ||!unit) {
      res.json({ success: false, message: "Price in RS is mandatory" });
    } else {
      const isRate = await MRP_Rate.findOne({
        price: price,
      });
      if (isRate) {
        res.json({ success: false, message: `${isRate?.price} has Already created try with new` });
      } else {
        try {
          const pricing = await new MRP_Rate({
           
            price: price,
            unit:unit,
       
            type:type
         
          });
          await pricing.save();
          res.status(200).json({success:true,data:pricing,message:`${pricing?.price} services has  created Successfully`});
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    }
  }
);

router.patch(
  "/update_price/:_id",
  
  async (req, res) => {
    const { _id } = req.params;

    try {
      const price = await MRP_Rate.updateOne(
        { _id },
        {
       
          price:req.body.price,
          unit:req.body.unit,
       

       
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success:true,
        message: `${price?.name} price  has Updated Sucessfully`,
        data:price,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);



///=====================

router.delete("/delete_price/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const rate =await MRP_Rate.findOneAndDelete({ _id:_id });
    
    res.json({
        success:true,
      message: `${rate?.name} has deleted Sucessfully`,
      data:rate,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

router.get("/get_price", async (req, res) => {
  try {
    const price = await MRP_Rate.find({});

    res.status(200).json({data:await price,success:true,});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});



module.exports = router;