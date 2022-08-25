const express = require("express");
const router = express.Router();
const ProductModel = require("../model/sellerProduct/product");
const multer = require("multer");
const app = express();
const path = require("path");

//=====================================================

const publicpath = path.join(__dirname, "./public");
app.use(express.static("publicpath"));

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

router.post(
  "/uploadBulkImage",
  imageUpload.array("images", 4),
  (req, res) => {
    res.send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

const videoStorage = multer.diskStorage({
  destination: "public/videos", // Destination to store video
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/uploadVideo",
  videoUpload.single("public/videos"),
  (req, res) => {
    res.send(req.file);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// For Single image upload
// router.post('/uploadImage', imageUpload.single('image'), (req, res) => {
//   res.send(req.file)
// }, (error, req, res, next) => {
//   res.status(400).send({ error: error.message })
// })

// For multiple image upload

router.post(
  "/uploadBulkImage",
  imageUpload.array("public/images", 4),
  (req, res) => {
    res.send(req.files);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

var upload = multer({ storage: imageStorage });

router.post(
  "/uploadproduct",
  upload.fields([
    { name: "pic1", maxCount: 1 },
    { name: "pic2", maxCount: 1 },
  ]),
  async (req, res) => {
    // const {user} = req.body;

    // const userData = await ProductModel.findOne({_id:user.id},{GST_No:1,Merchant_Name:1})

    try {
      console.log(req.body.file);

      const product = new ProductModel({
        Vendor_Id: req.body.Vendor_Id,
        vendors_name: req.body.vendors_name,
        product_name: req.body.product_name,
        pic1: req.files.pic1[0].filename,
        category: req.body.category,
        price: req.body.price,
        product_Specification: req.body.product_Specification,
        type: req.body.type,
        // videos:req.files.filename
      });
      await product.save();
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send({ message: err?.message });
    }
  }
);

router.get("/uploadproduct", async (req, res) => {
  try {
    const product = await ProductModel.find();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//   const getStudents = async (req, res) => {
//     try {
//         const student= await Student.find();

//         res.status(200).json(student);
//     } catch(error) {
//         res.status(404).json({message: error.message});
//     }
// }

module.exports = router;
