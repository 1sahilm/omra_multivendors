const express = require("express");

const router = express.Router();

const Category = require("../model/products/category");

const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");
// const fs = require("fs");
const SubCategory = require("../model/products/subcategory");

const CustomerQueryByProduct = require("../model/products/CustomerQuery");
const sendEmail = require("../lib/mailer");
const Product = require("../model/products/product");

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

const upload = multer({ storage: imageStorage });

router.post(
  "/upload",
  upload.fields([
    { name: "category_image", maxCount: 1 },
    { name: "category_image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const { category_name } = req.body;

    if (!category_name) {
      res.json({ success: false, message: "Category is mandatory" });
    } else {
      const isCategory = await Category.findOne({
        category_name: category_name,
      });
      if (isCategory) {
        res.json({ success: false, message: `${category_name} has Already created try with new` });
      } else {
        try {
          const category = await new Category({
            category_name: category_name,
            category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
          });
          await category.save();
          res.status(200).json({success:true,data:category,message:`${category_name} has been Successfully created`});
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    }
  }
);

router.patch(
  "/update_category/:_id",
  upload.fields(
    [
      { name: "category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;
    const {category_name}=req.body

    if(!category_name){
      res.json({success:false,message:`Category name is required`})

    } 
    // else{
    //   const isCategory =await Category.findOne({category_name:category_name})
    //   if(isCategory?.length>1){
    //     res.json({success:false,message:`${category_name} has Already created try with new `})

    //   }
    //   else{
        try {
          const user = await Category.updateOne(
            { _id },
            {
              category_name: req.body.category_name,
              category_image:
                req.files.category_image?.length > 0
                  ? `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`
                  : undefined,
            },
            {
              new: true,
              upsert: true,
            }
          );
          //Fields
    
          res.json({
            success:true,
            message: `${category_name} has been Successfully Created `,
            data:user
          });
        } catch (err) {
          res.json({
            message: err?.message,
          });
        }

      }
    // }


    
  // }
);

//=========Hide/UnHide Category===>
router.patch(
  "/hide-category/:_id",
  upload.fields(
    [
      { name: "category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;
    const {isHide} = req.body

    try {
      const user = await Category.updateOne(
        { _id },
        {
          isHide: isHide,
        },

        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success:true,
        message: `Category is ${isHide} Sucessfully`,
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

router.delete("/delete_category/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log("hellotest",_id)
  try {
    const category =await Category.findOneAndDelete({ _id:_id });
    console.log("categoryyy",category)
    // category.delete()
    res.json({
      success:true,
      message: `${category?.category_name} category deleted Sucessfully`,
      data:category,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

router.get("/get_category", async (req, res) => {
  try {
    const product = await Category.find({isHide: false});
    console.log("categorydata",product)

    res.status(200).json(await product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// for use of uploading Product
router.get("/product_category", async (req, res) => {
  try {
    const product = await Category.find({  });

    res.status(200).json(await product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_home_cat", async (req, res) => {
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  try {
    const product = await Category.find({isHide:false})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.get("/get_postionCat", async (req, res) => {
  try {
    const product = await Category.find({}, { category_name: 1 }).limit(5);

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

///  SubCategory Product==========================SubCategory Product============

// router.post(
//   "/add_subcategory",
//   upload.single("sub_category_image"),
//   async (req, res) => {
//     try {
//       const subcategory = await new SubCategory({
//         category_Id: req.body.category_Id,
//         category_name: req.body.category_name,
//         sub_category_name: req.body.sub_category_name,
//         sub_category_image:
//           req.files.sub_category_image.filename > 0
//             ? `${process.env.BASE_URL}/category-image/${req.files.sub_category_image.filename}`
//             : undefined,
//       });
//       await subcategory.save();
//       res.status(200).send(await subcategory);
//     } catch (error) {
//       res.json(error.message);
//     }
//   }
// );

router.post(
  "/add-subcategory",
  upload.fields([
    { name: "sub_category_image", maxCount: 1 },
    { name: "category_image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      category_Id,
      category_name,
      sub_category_name,
      sub_category_image,
    } = req.body;
    if (!sub_category_name) {
      res.json({ message: "Sub Category name must be Enter" });
    } else {
      const isSubCategoryName = await SubCategory.findOne({
        sub_category_name: sub_category_name, category_name: category_name,
      });
      console.log("hellotest",isSubCategoryName)
      
     
      if (isSubCategoryName) {
        res.json({
          success: false,
          message: `${sub_category_name} is Already Created in ${category_name} please Try with new`,
        });
      } else {
        
        try {
          const category = await new SubCategory({
            category_Id: category_Id,
            category_name: category_name,
            sub_category_name: sub_category_name,
            sub_category_image:
              // req.files.sub_category_image.length > 0
              `${process.env.BASE_URL}/category-image/${req.files.sub_category_image[0].filename}`,
            // : undefined,
          });
          await category.save();
          res.status(200).json({success:true, message: `${sub_category_name} has been Successfully Created in ${category_name}`, data:category });
        } catch (err) {
          res.status(500).send({ message: err?.message });
        }
      }
    }
  }
);
// Update SubActegory
router.patch(
  "/update_sub_category/:_id",
  upload.fields(
    [
      { name: "sub_category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;

    const {sub_category_name} = req.body

    // if(!sub_category_name){
    //   res.json({success:false,message:"SubCategory Name is required"})
    // }else{
    //   const catName =await SubCategory.findOne({_id:_id,sub_category_name:sub_category_name,sub_category_image:sub_category_image})
    //    console.log("sucatNam",catName)
    //   if(catName){
    //     res.json({success:false,message:`${sub_category_name} is Already Created in ${catName?.category_name} `})
    //   }
    //   else{
        try {
          const user = await SubCategory.updateOne(
            { _id },
            {
              sub_category_name: sub_category_name,
              sub_category_image:
                req.files.sub_category_image?.length > 0
                  ? `${process.env.BASE_URL}/category-image/${req.files.sub_category_image[0].filename}`
                  : undefined,
            },
            {
              new: true,
              upsert: true,
            }
          );
          //Fields
    
          res.status(201).json({
            success: true,
            message: `${sub_category_name} is  Updated Sucessfully`,
            data:user,
          });
        } catch (err) {
          res.json({
            message: err?.message,
          });
        }

      }
    // }
    
   


   
  // }
);

//=========Hide/UnHide SubCategoryCategory===>
router.patch(
  "/hide-subcategory/:_id",
  upload.fields(
    [
      { name: "category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;
    const {isHide}=req.body;

    try {
      const user = await SubCategory.updateOne(
        { _id },
        {
          isHide: isHide,
        },

        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success:true,
        message: "SubCategory is Updated Sucessfully",
        data:user,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);

//Fields

router.get("/get_subcategory", async (req, res) => {
  try {
    const product = await SubCategory.find({});

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/catebycount",async(req,res)=>{
  try {
    const cat= await Product.aggregate( [
      {
        $sort:{ category : 1 }
      },
      { $group: {  _id : "$category", count: { $count: { } }}},
      // { $project: { _id: 0, category: 1 }}]]
    ]
     )

     res.json({data:cat,message:"success"})
    
  } catch (error) {
    console.log(error)
    
  }
})

router.get("/catebycount1",async(req,res)=>{
  try {
    const cat= await Product.aggregate( [
      {
        $sort:{ category : 1 }
      },
      { $group: {  _id : "$category", count: { $count: { } }}},
      // { $project: { _id: 0, category: 1 }}]]
    ]
     )

     const categoryData= await Category.find({}).lean()
     const arrayData= []
      categoryData.map((item)=>arrayData.push({_id:item.category_name,category_image:item.category_image,count:0}))
      const countArray=[...cat,...arrayData]
     
      

     res.json({data:countArray,message:"success"})
    
  } catch (error) {
    console.log(error)
    
  }
})

/// sorting subcategory by name
router.get("/get_subcategory-sort-by-name", async (req, res) => {
  try {
    const product = await SubCategory.find({isHide:false}).collation({locale:'en',strength: 2}).sort({sub_category_name:1}).limit(50)
    

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


//=================== delete SubCategory=============

router.delete("/delete_subcategory/:_id", async (req, res) => {
  const { _id } = req.params;
  console.log("hellotest",_id)
  try {
    const category =await SubCategory.findOneAndDelete({ _id:_id });
    console.log("categoryyy",category)
    // category.delete()
    res.json({
      message: "category deleted Sucessfully",
      category,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

//========================end Here =========
router.get("/get_subcategory-for-upload", async (req, res) => {
  try {
    const product = await SubCategory.find({ isHide: false });

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/get_subcategory-lazy", async (req, res) => {
  let { page = 1, limit = 50 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const product = await SubCategory.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await SubCategory.countDocuments();

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      product,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//===============================Get Subcategory by Category in SuperAdmin============

router.get("/get_subcategory-list", async (req, res) => {
  let { page = 1, limit = 100 ,_id} = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const category= await Category.find({})
    const product = await SubCategory.find({})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await SubCategory.countDocuments();

    const totalPages = Math.ceil(count / limit);
    console.log("category",category)

    res.status(200).json({
      product,
      totalPages,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
//=======================get SubCat By Category================
router.get("/get_subcategoryByCat", async (req, res) => {
  category_name = req.query.category_name;

  try {
    const product = await SubCategory.find({ category_name: category_name }).limit(15);

    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//===============================Category Search ==========================
router.get("/searchCategory/:key", async (req, res) => {
  try {
    const data = await Category.find({
      $or: [
        { category_name: { $regex: req.params.key, $options: "$i" } },
        // { GST_No: { $regex: req.params.key, $options: "$i" } },
        // { Merchant_Address: { $regex: req.params.key, $options: "$i" } },
        // { company_Name: { $regex: req.params.key, $options: "$i" } },
      ],
    });
    res.json(data);
  } catch (error) {
    res.json(404);
  }
});
//====================

router.post(
  "/connect_to_buy",

  async (req, res) => {
    try {
      const product = await new CustomerQueryByProduct({
        product_Id: req.body.product_Id,

        customer_mob: req.body.customer_mob,
      });
      await product.save();
    // sendEmail({
        
    //   })  
      res.status(200).send(product);
    } catch (err) {
      res.status(500).send({ message: err?.message });
    }
  }
);

module.exports = router;
