const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const UserModel = require("../model/model");

const Product = require("../model/products/product");
const ProductProfile = require("../model/products/product_profile");
const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");
const CustomerQueryByProduct = require("../model/products/CustomerQuery");
const Category = require("../model/products/category");
const Subscription = require("../model/pricing/subscription");
const SubCategoy = require("../model/products/subcategory");
// const fs = require("fs");
// const { sendEmail } = require("../lib/mailer");
// const { request } = require("http");

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


const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|pdf)$/)) {
            // upload only png and jpg format
            return cb(new Error("Please upload a Image"));
        }
        cb(undefined, true);
    },
});

// const videoUpload = multer({
//   storage: videoStorage,
//   limits: {
//   fileSize: 10000000 // 10000000 Bytes = 10 MB
//   },
//   fileFilter(req, file, cb) {
//     // upload only mp4 and mkv format
//     if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
//        return cb(new Error('Please upload a video'))
//     }
//     cb(undefined, true)
//  }
// })

router.get("/profile", (req, res, next) => {
    res.json({
        message: "You made it to the secure route",
        user: req.user,
        token: req.query.secret_token,
    });
});
router.get("/test", (req, res, next) => {
    res.json({
        message: "You made it to the secure route",
        user: req.user,
        token: req.query.secret_token,
    });
});

//===================deactivate users==================
//===================deactivate users==================
router.patch("/deactivate/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const user = await UserModel.findOne({ _id });
        user.isActive = req.body.isActive;
        const data = await Product.updateMany({ auther_Id: _id }, { $set: { isActive: req.body.isActive } });

        await user.save();

        res.status(200).send({ user: user, product: data });
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});
//=======================

router.patch("/deactivat1111111/:_id", async (req, res) => {
    const { _id } = req.params;

    try {
        const User = await UserModel.updateOne({
            _id: _id,
        }, {
            isActive: req.body.isActive,
        }, {
            new: true,
            upsert: true,
        });
        res.json({
            message: "User Updated Sucessfully",
            User,
        });
    } catch (error) {
        res.json({
            message: error?.message,
        });
    }
});

router.patch("/details", async (req, res) => {
    const { _id } = req.user;
   

    try {
        const user = await UserModel.findOneAndUpdate({ _id: _id }, {
            Merchant_Name: req.body.Merchant_Name,
            Merchant_Address: req.body.Merchant_Address,
            Merchant_City:req.body.Merchant_City,
            TypesOf_Bussiness: req.body.TypesOf_Bussiness,
            SubTypeOf_bussiness: req.body.SubTypeOf_bussiness,
            Merchant_Designation: req.body.Merchant_Designation,
            Year_of_establishment: req.body.Year_of_establishment,
            Merchant_ServiceArea_Pincodes: req.body.Merchant_ServiceArea_Pincodes,
            GST_No: req.body.GST_No,
            PAN_No: req.body.PAN_No,
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
            message: err.message,
        });
    }
});

router.patch("/update-user/:_id", async (req, res) => {
    // const { _id } = req.user;
    const _id= req.params
    const isAdmin = req
  
    if(isAdmin.user.role==="SuperAdmin"){
        try {
            const user = await UserModel.findOneAndUpdate({ _id: _id }, {
                Merchant_Name: req.body.Merchant_Name,
                Merchant_Address: req.body.Merchant_Address,
                Merchant_City:req.body.Merchant_City,
                TypesOf_Bussiness: req.body.TypesOf_Bussiness,
                SubTypeOf_bussiness: req.body.SubTypeOf_bussiness,
                Merchant_Designation: req.body.Merchant_Designation,
                Year_of_establishment: req.body.Year_of_establishment,
                // Merchant_ServiceArea_Pincodes: req.body.Merchant_ServiceArea_Pincodes,
                GST_No: req.body.GST_No,
                PAN_No: req.body.PAN_No,
            }, {
                new: true,
                upsert: true,
            });
            //Fields
    
            res.status(200).json({
                success:true,
                message: "User Updated Sucessfully",
                user,
            });
        } catch (err) {
            res.json({
                message: err.message,
            });
        }

    }

   
});

router.get("/details", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOne({ _id: _id }, { password: 0 });
        // const user = await UserModel.find({ role: "Admin" });
        //Fields

        res.json({
            success: "Sucessfully",
            user,
        });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});

router.patch("/product-upload-services/:_id", async (req, res) => {
    // const { _id } = req.user;
    const {_id} = req.params
    const  _testid= req

   
    if(_testid.user.role=="SuperAdmin"){
        try {
           
            const user = await UserModel.findOneAndUpdate({ _id: _id }, {
                isUpload: req.body.isUpload,
               
               
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
                message: err.message,
            });
        }

    }
});

router.patch("/activate-email-Service/:_id", async (req, res) => {
    // const { _id } = req.user;
    const {_id} = req.params
    const  _testid= req
    const {isEmail}=req.body


   

  
    if(_testid.user.role=="SuperAdmin"){
        try {
       
            const user = await UserModel.findOneAndUpdate({ _id: _id }, {
              
                isEmail:req.body.isEmail,
                
               
            }, {
                new: true,
                upsert: true,
            });
            //Fields
            user.save()
         
    
            res.json({
                message: "Email Service Updated Sucessfully",
                user,
            });
        } catch (err) {
            res.json({
                message: err.message,
            });
        }

    }
});

router.patch("/activate-call-Service/:_id", async (req, res) => {
    // const { _id } = req.user;
    const {_id} = req.params
    const  _testid= req
   

  
    if(_testid.user.role=="SuperAdmin"){
        try {
       
            const user = await UserModel.findOneAndUpdate({ _id: _id }, {
              
                isCall: req.body.isCall,
                
               
            }, {
                new: true,
                upsert: true,
            });
            //Fields
           
    
            res.json({
                message: "Call Service Updated Sucessfully",
                user,
            });
            
        } catch (err) {
            res.json({
                message: err.message,
            });
        }

    }
});

router.patch("/activate-leads-Service/:_id", async (req, res) => {
    // const { _id } = req.user;
    const {_id} = req.params
    

    const  _testid= req
   

   
    if(_testid.user.role=="SuperAdmin"){
        
        try {
           
            const user = await UserModel.findOneAndUpdate({ _id: _id }, {
                isLead: req.body.isLead}, {
                new: true,
                upsert: true,
            });
            //Fields
            

            res.status(201).json({
                success:true,
                message: "Leads Service Updated Sucessfully",
                user,
            });
       
        } catch (err) {
            res.json({
                message: err.message,
            });
        }

    }
});


router.get("/get-services", async (req, res) => {
    const { _id } = req.user;
    const  _testid= req



    try {
        const user = await UserModel.findOne({_id}, { isUpload: 1,isCall:1,isEmail:1,isLead:1 });
        // const user = await UserModel.find({ role: "Admin" });
        //Fields

        res.json({
            success: true,
            data:user,
        });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});

router.get("/userDetails", async (req, res) => {
    const { _id, password, email } = req.user;
    let { page = 1, limit = 5, toDate, fromDate } = req.query;
    page = Number(page);
    limit = Number(limit);

    try {
        await UserModel.find({}, { password: 0 })
            .lean()
            .then(async (data) => {
                const newdata = await Promise.all(
                    data.map(async (user) => ({
                        ...user,
                        leadCount:
                            (await CustomerQueryByProduct.countDocuments({
                                merchant_Id: user._id,
                            })) || 0,
                    }))
                );

                res.json({
                    success: "Sucessfully",
                    user: newdata,
                });
            });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});
router.get("/userDetailsPaginate?", async (req, res) => {
    // const {page} = req.query
   
    
    const { _id, password, email } = req.user;
    let { page = 1, limit = 20, toDate, fromDate } = req.query;

    page = Number(page);
    limit = Number(limit);

    try {
        const user = await UserModel.find({}, { password: 0 })
            .limit(limit*1)
            .skip((page-1)*limit)
            .sort({ createdAt: -1 })
            .lean()
            .then(async (data) => {
                const newdata = await Promise.all(
                    data.map(async (user) => ({
                        ...user,
                        leadCount:
                            (await CustomerQueryByProduct.countDocuments({
                                merchant_Id: user._id,
                            })) || 0,
                    }))
                );
                const totalDocuments = await UserModel.countDocuments({});

                const pages = Math.ceil(totalDocuments / 20);
             


                res.json({
                    success: true,
                    user: newdata,

                    totalPages: pages,
                    count:totalDocuments,
                    min:limit*page-limit,
                    max:limit*page,

                    currentPage: page,
                    nextPage: page < pages ? page + 1 : null,
                });
            });

        //Fields

        // res.json({
        //   success: true,
        //   user: newdata,

        //   totalPages: pages,
        //   currentPage: page,
        //   nextPage: page < pages ? page + 1 : null,
        // });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});

router.get("/userDetailsData", async (req, res) => {
    let { page = 1, limit = 5, toDate, fromDate } = req.query;
    page = Number(page);
    limit = Number(limit);

    try {
        const user = await UserModel.find({})
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });
        //Fields
        const totalDocuments = await UserModel.countDocuments({});

        const pages = Math.ceil(totalDocuments / limit);

        res.json({
            success: true,
            user,
            totalPages: pages,
            currentPage: page,
            nextPage: page < pages ? page + 1 : null,
        });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});

router.get("/get_user", async (req, res) => {
    const _id = req.user;

    try {
        const user = await UserModel.findOne({ _id: _id }, {
            email: 1,
            company_Name: 1,
            mobile_no: 1,
            Merchant_Name: 1,
            Year_of_establishment: 1,
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get("/userActivity", async (req, res) => {
    const { _id, password, email } = req.user;

    const isActive = req.params.isActive;

    try {
        const user = await UserModel.find({}, { isActive: 1 });
        //Fields

        res.json({
            success: "Sucessfully",
            user,
        });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});

router.patch("/companyprofile", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOneAndUpdate({ _id }, {
            Merchant_Name: req.body.Merchant_Name,
            company_Name: req.body.company_Name,
            description: req.body.description,
            Category1: req.body.Category1,
            Category2: req.body.Category2,
            Category3: req.body.Category3,
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
});

router.get("/companyprofile", async (req, res) => {
    const { _id } = req.user;

    try {
        const user = await UserModel.findOne({ _id });
        //Fields

        res.json({
            success: true,
            user,
        });
    } catch (err) {
        res.json({
            message: err?.message,
        });
    }
});
const upload = multer({ storage: imageStorage });

router.post(
    "/upload_product",
    upload.fields([
        { name: "product_image1" },
        { name: "product_image2" },
        { name: "product_image3" },
        { name: "product_image4" },
        { name: "product_image5" },
    ]),
    async (req, res) => {
        // const { user } = req.user;
        const { _id } = req.user;
        const {
            product_name,

            manufacturer_name,
            manufacturer_phone_no,
            manufacturer_address,
            brand,
            videos,
            video_url,
            category,
            sub_category,
            price,
            product_Specification,
            additionalSpecification,
            product_description,
            capacity,
            product_code,
            quantity,
            delivery_time,
            model_no,
            source,
            source_type,
            type,
            made_in,
            image_source,
            image_source_pdf,
            image_source_image,
            image_source_url,
            image_source_other,
        } = req.body;
        const { other, pdf, url } = req.body;
        const { product_image1 } = req.files;
        const source_image = await Product.find({});
   
        

        const userData = await UserModel.findOne({ _id: _id }, {
            GST_No: 1,
            Merchant_Name: 1,
            TypesOf_Bussiness: 1,
            SubTypeOf_bussiness: 1,
            Merchant_Address: 1,
            mobile_no: 1,
            isActive: 1,
        })
        const cattest= await UserModel.findOne({category_name:category})
       

        if (!product_name || !category) {
            res.json({
                success: false,
                message: "product name and category  is compulsory",
            });
        } else {
            const autocomplete = await Product.findOne({
                product_name: product_name,
                category: category,
                sub_category: sub_category,

                auther_Id: _id,
            });

            if (autocomplete) {
                res.json({
                    success: false,
                    message: "This Product already created",
                });
            } else {
                try {
                    const product = await new Product({
                        auther_Id: _id,
                        Vendor_Id: userData?.GST_No,
                        // merchant:userData,
                        vendors_name: userData.Merchant_Name,
                        mobile_no: userData.mobile_no,
                        isActive: userData.isActive,
                        TypesOf_Bussiness: userData.TypesOf_Bussiness,
                        SubTypeOf_bussiness: userData.SubTypeOf_bussiness,
                        Merchant_Address: userData.Merchant_Address,
                        product_name: product_name,
                        manufacturer_name: manufacturer_name,
                        manufacturer_phone_no: manufacturer_phone_no,
                        manufacturer_address: manufacturer_address,
                        brand: brand,

                        product_image1: req.files.product_image1?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.product_image1[0].filename}` :
                            undefined,
                        product_image2: req.files.product_image2?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.product_image2[0].filename}` :
                            undefined,
                        product_image3: req.files.product_image3?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.product_image3[0].filename}` :
                            undefined,
                        product_image4: req.files.product_image4?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.product_image4[0].filename}` :
                            undefined,
                        product_image5: req.files.product_image5?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.product_image5[0].filename}` :
                            undefined,

                        // product_image2: req.files.product_image2[0].filename,
                        videos: videos,
                        video_url: video_url,
                        category: category,
                        cat:category,
                        sub_category: sub_category,
                        price: price,
                        product_Specification: product_Specification,
                        additionalSpecification: JSON.parse(additionalSpecification),
                        product_description: product_description,
                        capacity: capacity,
                        product_code: product_code,
                        quantity: quantity,
                        delivery_time: delivery_time,

                        model_no: model_no,
                        made_in: made_in,
                        source_type: source_type,
                        source: source,
                        image_source: image_source[({ url: url }, { other: other })],
                        image_source_pdf: req.files.image_source_pdf?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.image_source_pdf[0].filename}` :
                            undefined,
                        image_source_image: req.files.image_source_image?.length > 0 ?
                            `${process.env.BASE_URL}/product-image/${req.files.image_source_image[0].filename}` :
                            undefined,
                        image_source_url: image_source_url,
                        image_source_other: image_source_other,
                        type: type,
                    });

                    await product.save();
                    // res.status(200).send(product);
                    res.status(200).json({
                        success: true,
                        message: "product has been uploaded Sucessfully",

                        product,
                    });
                } catch (err) {
                    res.status(500).json({ message: err?.message });
                }
            }
        }
    }
);

// ============update by CategoryName
router.patch("/updatecat",async(req,res)=>{
    const {category}=req.body
    try {
        const cat_id = await Category.findOne({category_name:"pharma"},{category_name:1} )
    
        const product = await Product.updateMany({category:"pharma"},{
            test:cat_id,
            cat:cat_id._id,
            category:cat_id._id
        },{
            upsert:true,
            new:true
        })
    //    await product.save()
        res.status(201).json({success:true,product,message:"updated"})
        
    } catch (error) {
        throw error
        
    }
})

//=============================================

// ============update by CategoryName
router.patch("/updatesubcat",async(req,res)=>{
    const {category}=req.body
    try {
        const cat_id = await SubCategoy.findOne({sub_category:"automobile"},{sub_category:1} )
      
        const product = await Product.updateMany({sub_category:"automobile"},{
            
            sub_category:cat_id._id
        },{
            upsert:true,
            new:true
        })
    //    await product.save()
        res.status(201).json({success:true,product,message:"updated"})
        
    } catch (error) {
        throw error
        
    }
})

router.patch(
    "/update_product_By/:_id",
    upload.fields([
        { name: "product_image1" },
        { name: "product_image2" },
        { name: "product_image3" },
        { name: "product_image4" },
        { name: "product_image5" },
    ]),
    async (req, res) => {
        const { _id } = req.params;
        const {
            product_name,
            manufacturer_name,
            manufacturer_phone_no,
            manufacturer_address,
            brand,
            videos,
            video_url,
            category,
            sub_category,
            price,
            product_Specification,
            additionalSpecification,
            product_description,
            capacity,
            product_code,
            quantity,
            delivery_time,
            model_no,
            type,
            made_in,
            source,
            source_type,
        } = req.body;

        try {
            const user = await Product.updateOne({ _id }, {
                product_name: product_name,
                manufacturer_name: manufacturer_name,
                manufacturer_phone_no: manufacturer_phone_no,
                manufacturer_address: manufacturer_address,
                brand: brand,

                product_image1: req.files.product_image1?.length > 0 ?
                    `${process.env.BASE_URL}/product-image/${req.files.product_image1[0].filename}` :
                    undefined,
                product_image2: req.files.product_image2?.length > 0 ?
                    `${process.env.BASE_URL}/product-image/${req.files.product_image2[0].filename}` :
                    undefined,
                product_image3: req.files.product_image3?.length > 0 ?
                    `${process.env.BASE_URL}/product-image/${req.files.product_image3[0].filename}` :
                    undefined,
                product_image4: req.files.product_image4?.length > 0 ?
                    `${process.env.BASE_URL}/product-image/${req.files.product_image4[0].filename}` :
                    undefined,
                product_image5: req.files.product_image5?.length > 0 ?
                    `${process.env.BASE_URL}/product-image/${req.files.product_image5[0].filename}` :
                    undefined,

                // product_image2: req.files.product_image2[0].filename,
                // videos: videos,
                category: category,
                sub_category: sub_category,
                price: price,
                video_url: video_url,
                product_Specification: product_Specification,
                additionalSpecification: JSON.parse(additionalSpecification),
                product_description: product_description,
                capacity: capacity,
                quantity: quantity,
                product_code: product_code,
                delivery_time: delivery_time,
                made_in: made_in,
                source: source,
                source_type: source_type,

                model_no: model_no,
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

router.get("/get_products", async (req, res) => {
     const { _id } = req.user
  
    try {
        const product1 = await Product.find({auther_Id:_id}).sort({ createdAt: -1 });
        const userData = await UserModel.find({}, { _id: 1, isActive: 1 });
        const product = { ...product1, ...userData };

        res.status(200).json(product1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
router.get("/getproductForApproval", async (req, res) => {
    const populateQuery = [
        {
          path: "auther_Id",
          model: UserModel,
          select:{email:1,mobile_no:1,TypesOf_Bussiness:1,Merchant_Name:1,company_Name:1}
        },
        {
          path: "category",
          model: Category,
          select:{category_name:1}
        },
        {
            path: "sub_category",
            model: SubCategoy,
            select:{sub_category_name:1}
          },
       
      ];
    try {
        const product1 = await Product.find({
            isApproved: false,
            isDeclined: false,
           
        }).populate(populateQuery).sort({ createdAt: -1 })
       

        res.status(200).json(product1);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
///
router.get("/get_product/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/// ===================== Notification Api   ===============================
router.get("/notification", async (req, res) => {
    try {
        const userData = await UserModel.find({}, { password: 0 })
            .lean()
            .then(async (data) => {
                const newdata = await Promise.all(
                    data.map(async (user) => {
                       
                        let test = await Product.find({ auther_Id: user?._id }
                            // { isApproved: 1, isDeclined: 1 }
                        );
                        data = { isApproved: test?.isApproved };
                        // res.json({ success: true, data: test });
                    })
                );
                // res.json({ success: true, data: newdata });
            });
    } catch (error) {
        // message:error?.message
        console.log({ message: " something wrong" });
    }
});

// update product====================================Update product for Approved==

router.patch("/approved_product/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;
    const date = new Date()

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const product = await Product.findOne({ _id },{
            isApproved : req.body.isApproved,
            approved_date:date


        });
        product.isApproved = req.body.isApproved;

        await product.save();

        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});


router.get("/getApprovedCount", async (req, res) => {
    try {
        const product = await Product.find({ isApproved: true }).count();

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

//===================================  declined

router.patch("/declined_product/:_id", async (req, res) => {
    const { _id } = req.params;
    const update_product = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(404).send("No post Available");

        const product = await Product.findOne({ _id });
        product.isDeclined = req.body.isDeclined;
        product.status = req.body.status;
        product.message = req.body.message;

        await product.save();
        res.status(200).send(product);
    } catch (err) {
        res.status(500).send({ message: err?.message });
    }
});

router.get("/getDeclinedProductCount", async (req, res) => {
    try {
        const product = await Product.find({ isDeclined: true }).count();

        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
// ===============Approved Product Search=========================
// ===================================testing==================
router.get("/ApprovedSearch/:key", async (req, res) => {
    try {
        const data = await Product.find({
            // $text: {
            //   $search: req.params.key.toString(),
            // },

            $or: [
                { category: { $regex: req.params.key, $options: "$i" } },
                { sub_category: { $regex: req.params.key, $options: "$i" } },
                { brand: { $regex: req.params.key, $options: "$i" } },
                { product_name: { $regex: req.params.key, $options: "$i" } },
                { vendors_name: { $regex: req.params.key, $options: "$i" } },
            ],
            isActive: true,
            isApproved: true,
        });
        res.json(data);
    } catch (error) {
        res.json(404);
    }
});
//========================
router.get("/ApprovedFilterByDate/:key", async (req, res) => {
    // let today = new date().getTime();
   

    try {
        const data = await Product.find({
            isActive: true,
            isApproved: true,
            updatedAt: { $lte: new Date(), $gte: new Date(req.params.key) },
        });
        res.json(data);
    } catch (error) {
        res.json(404);
    }
});

//========================
router.get("/WaitingFilterByDate/:key", async (req, res) => {
    // let today = new date().getTime();
  

    try {
        const data = await Product.find({
            isActive: true,
            isApproved: false,
            isDeclined:false,
            updatedAt: { $lte: new Date(), $gte: new Date(req.params.key) },
        });
        res.json(data);
    } catch (error) {
        res.json(404);
    }
});




// ===================================waiting for Approval api(unApproved and unDecline)==================
router.get("/waitingApprovalSearch/:key", async (req, res) => {
    try {
        const data = await Product.find({
            // $text: {
            //   $search: req.params.key.toString(),
            // },

            $or: [
                { category: { $regex: req.params.key, $options: "$i" } },
                { sub_category: { $regex: req.params.key, $options: "$i" } },
                { brand: { $regex: req.params.key, $options: "$i" } },
                { product_name: { $regex: req.params.key, $options: "$i" } },
                { vendors_name: { $regex: req.params.key, $options: "$i" } },
            ],
            isActive: true,
            isApproved: false,
            isDeclined: false,
        });
        res.json(data);
    } catch (error) {
        res.json(404);
    }
});
//=================================================
router.get("/waitingproductFilterByDate/:key", async (req, res) => {
    // let today = new date().getTime();
   

    try {
        const data = await Product.find({
            isActive: true,
            isApproved: false,
            isDeclined: false,
            updatedAt: {
                $gte: new Date(req.params.key),
                $lte: new Date(),
            },
        });
        res.json(data);
    } catch (error) {
        res.json(404);
    }
});

// get Leads from Buyer

router.get("/getbuyerQuery", async (req, res) => {
    const { _id }= req.user
    try {
      const buyerQuery = await CustomerQueryByProduct.find({merchant_Id:_id}).sort({
        createdAt: -1,
      });
  
      res.status(200).json(buyerQuery);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
  // for SuperAdmin

  router.get("/getbuyerQueryfor", async (req, res) => {
    const { _id }= req.user
    try {
      const buyerQuery = await CustomerQueryByProduct.find({}).sort({
        createdAt: -1,
      });
  
      res.status(200).json(buyerQuery);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });
//=========================================================
/// product profile

router.post("/company_profile", async (req, res) => {
    const { user } = req;

    const userData = await ProductProfile.findOne({ _id: user.id }, { GST_No: 1, Merchant_Name: 1 });

    try {
        const product = new ProductProfile({
            Vendor_Id: userData.GST_No,
            vendors_name: userData.Merchant_Name,
            product_name: req.body.product_name,
            description: req.body.description,
            type: req.body.type,
        });
        await product.save();
        res.status(200).send(product);
    } catch (err) {
        res.status(500).json({ message: err?.message });
    }
});


// invoice
router.get("/get_invoice", async (req, res) => {
    const {_id}=req.user
    try {
        const service = await Subscription.find({auther_Id:_id});

        res.status(200).json({ data: service, success: true });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
module.exports = router;