const express = require("express");
// const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
// const ProductModel = require("../model/sellerProduct/product");
const res = require("express/lib/response");
const UserModel = require("../model/model");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../lib/mailer");
require("dotenv").config();

// //=====================================================
// // router.post('/uploadproduct',async (req,res)=> {
// //   // const {user} = req.body;

// //     // const userData = await ProductModel.findOne({_id:user.id},{GST_No:1,Merchant_Name:1})

// //   try{

// //     const product = new ProductModel({
// //       Vendor_Id: req.body.Vendor_Id,
// //       vendors_name: req.body.vendors_name,
// //       product_name:req.body.product_name,
// //       product_image:req.body.product_image,
// //       category:req.body.category,
// //       price:req.body.price,
// //       product_Specification:req.body.product_Specification,
// //       type:req.body.type,
// //     })
// //     await product.save()
// //     res.status(200).send(product)

// //   } catch(err){
// //     res.status(500).send({message:err?.message})
// //   }

// // })

// //=======================================================
// ///  bcrypt.hash(myPlaintextPassword, saltRounds).then(function(hash) {
//     // Store hash in your password DB.
// //});

router.post(
  "/signup",
  // passport.authenticate('signup', { session: false }),
  async (req, res) => {
    const { email, mobile_no, password, role } = req.body;

    const data = {
      email: email,
      mobile_no: mobile_no,
      password: password,
      role: role,
    };

    if (!email || !mobile_no) {
      res.json({ success: false, data: "emai and mobile no requied" });
    } else {
      const isUser = await UserModel.findOne({
        email: email,
        mobile_no: mobile_no,
      });
      if (isUser) {
        res.json({ success: false, data: "user created Already" });
      } else {
        try {
          const verify = UserModel.findOne(email);
          // if(verify){
          //   return res.status(409).json({success:false,message:"account already created"})
          // }
          const user = await UserModel.create(data);
          const payload = {
            email: user.email,

            _id: user._id,
            role: user.role,
          };
          const token = jwt.sign({ user: payload }, "TOP_SECRET");

          res.status(201).json({
            success: true,
            data: "created successfully",
            user: user,
            token: token,
          });
        } catch (err) {
          console.log({ error: err.message });
        }
      }
    }

    // res.json({
    //   message: 'Signup successful',
    //   user: req.user
    // });
  }
);

//   router.post(
//     '/login',
//   async (req,res)=>{
//     const {email,password}=req.body;
//     try{

//     if(!email || !password){
//       return res.status(401).json({success:false,message:"invalid credentials"})
//     }
//     const User= await UserModel.findOne({email})
//     if(User){
//       if(bcrypt.compare(password,User.password)){
//         const jwtvar=jwt.sign(User)
//         return res.status(200).json({success:true,token:jwtvar})
//       }
//       else{
//         return res.status(401).json({success:false,message:"invalid credentials"})

//       }

//     }else{
//       return res.status(401).json({success:false,message:"invalid credentials"})
//     }

//   }

//   catch(err){
//     console.log({"error":err.message})
//   }
// });

// module.exports = router;

// const express = require('express');
// const passport = require('passport');

// const router = express.Router();
// const jwt = require('jsonwebtoken');

// router.post(
//   '/signup',
//   passport.authenticate('signup', { session: false }),
//   async (req, res, next) => {
//     res.json({
//       message: 'Signup successful',
//       user: req.user
//     });
//   }
// );

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ message: "invalid email or password" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "invalid email or password" });
    }

    const checkPassword = bcrypt.compare(password, user.password);
    const checkIsActive = user.isActive;

    if (!checkPassword || !checkIsActive) {
      return res.status(404).json({ message: "invalid email or password" });
    }

    const body = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isRegistered: user?.company_Name ? true : false,
    };

    const token = jwt.sign({ user: body }, "TOP_SECRET");

    res.status(200).json({
      user: body,
      token,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get(
  "/logout",
  // passport.authenticate('signup', { session: false }),
  async (req, res) => {
    try {
      res.clearCookie("jwt");
      const user = await req.user.save();

      res.status(201).json({
        success: true,
        data: "logout successfully",
        user: user,
        token: user,
      });
    } catch (err) {
      console.log({ error: err.message });
    }
    // res.json({
    //   message: 'Signup successful',
    //   user: req.user
    // });
  }
);
router.patch("/forgotpassword", async (req, res) => {
  const { description, phoneNumber, merchantId } = req.body;
  const { email } = req.query;

  const merchant = await UserModel.findOne({ email: email });

  if (!merchant) {
    return res
      .status(404)
      .json({ message: "merchant not found", success: false });
  }

  try {
    const user = await UserModel.updateOne(
      { _id },
      {
        password: req.body.password,
      },
      {
        new: true,
        upsert: true,
      }
    );
  } catch (error) {
    console.log({ error: error.message });
  }
});

router.post("/send-mail", async (req, res) => {
  const { description, phoneNumber, email, merchantId } = req.body;

  const merchant = await UserModel.findOne({ _id: merchantId });

  if (!merchant) {
    return res
      .status(404)
      .json({ message: "merchant not found", success: false });
  }

  console.log(merchant.email);
  try {
    await sendEmail({
      merchantEmail: merchant.email,
      email,
      phoneNumber,
      description,
    });
    res.status(200).json({ message: "email sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error?.message, success: false });
  }
});
module.exports = router;
