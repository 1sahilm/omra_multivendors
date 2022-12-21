const express = require("express");
// const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();
// const ProductModel = require("../model/sellerProduct/product");
const res = require("express/lib/response");
const UserModel = require("../model/model");
const bcrypt = require("bcrypt");
const sendEmail = require("../lib/mailer");
const axios = require("axios")

const { hashPassword, comparePassword } = require("../functions/passwordHash");
// const { sendEmail } = require("../lib/mailer");
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

router.post("/signup", async (req, res) => {
  const { email, mobile_no, password, role } = req.body;

  const data = {
    email: email,
    mobile_no: mobile_no,
    password: hashPassword(password),
    role: role,
  };

  if (!email || !mobile_no) {
    return res.json({ success: false, data: "email and mobile no requied" });
  }

  const isUser = await UserModel.findOne({
    email: email,
    mobile_no: mobile_no,
  });

  if (isUser) {
    return res.json({ success: false, data: "user created Already" });
  }

  try {
    const user = await UserModel.create(data);

    const JWTPayload = {
      email: user.email,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");

    res.status(201).json({
      success: true,
      data: "created successfully",
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: err?.message });
  }
});

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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }

    const checkPassword = comparePassword(password, user.password);


    const checkIsActive = user.isActive;

    if (!checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "invalid email or password" });
    }

    if (!checkIsActive) {
      return res
        .status(400)
        .json({ success: false, message: "user is deactivated" });
    }

    const JWTPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isRegistered: user?.company_Name ? true : false,
    };

    const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });
    console.log("token".token)

    res.status(200).json({
      user: JWTPayload,
      token,
      message: "You are Logged in Successfully",

      sucess: true,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      data: "logout successfully",
    });
  } catch (err) {
    console.log({ error: err.message });
  }
});
router.patch("/forgotpassword/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    // Check If User Exists
    const findUser = await UserModel.findOne({ _id }).lean();

    if (!findUser) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    // UPDATE PASSWORD
    const updatePassword = await UserModel.updateOne(
      { _id },
      { $set: { password: hashPassword(req.body.password) } }
    );

    res
      .status(200)
      .json({ success: true, message: "password updated successfully" });

  } catch (error) {
    console.log({ error: error.message });
  }
});

router.post("/send-mail", async (req, res) => {
  const { description, phoneNumber, email, merchantId } = req.body;
  console.log("merchant Id", merchantId);
  // const {id} = req.query.merchantId
  // console.log("iddddd",id)

  const merchant = await UserModel.findOne({ _id: merchantId });
  console.log("userdata", merchant);

  if (!merchant) {
    return res
      .status(404)
      .json({ message: "merchant not found", success: false });
  }

  try {
    await sendEmail({
      merchantEmail: merchant.email,
      merchantId: merchantId,
      email,
      phoneNumber,
      description,
    });
    res.status(200).json({ message: "email sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error?.message, success: false });
  }
});

router.post("/send-sms", async (req, res) => {
  const { mobileno, vendors_name } = req.body

  const message = `Dear ${vendors_name}, You have received a New Lead from a buyer for your product inquiry. Please check your registered email for more information. Regards, E-Laundry Marketplace. OMRA Solutions`

  try {
    const { data } = await axios({
      url: "http://sms.tyrodigital.com/api/mt/SendSMS",

      params: {
        user:"omra1",
        // "Laundriz",
        //  "omra1",
        password:"omra1@1234",
        //  "Laundriz@1234",
        // "omra1@1234",
        senderid: "ELDRYD",
        channel: "Trans",
        // "Transactional",
        DCS: 0,
        flashsms: 0,
        number: mobileno,
        text: message,
        // "DLTAPPROVEDTEMPLATE",
        // message,
        route: 05,
        Peid: "1201159168754003726",
        DLTTemplateId: "1707166747148902896",
      },

      responseType: "json",
      method: "get",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },





    })


    console.log("SMS DATA", data);
  } catch (error) {
    console.log(error);
  }
}
)



module.exports = router;
