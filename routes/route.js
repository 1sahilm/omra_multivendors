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
    console.log(checkPassword, password, user.password)


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
    console.log("token", token)

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

router.patch("/forgotpassword2", async (req, res) => {
  try {
    const { _id } = req.params;
    const { email } = req.body

    // Check If User Exists
    const findUser = await UserModel.findOne({ _id }).lean();
    const findUser1 = await UserModel.findOne({ email: email }).lean();

    if (!findUser1) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    // UPDATE PASSWORD
    const updatePassword = await UserModel.updateOne(
      { email },
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

router.post("/send-mail-contact-us", async (req, res) => {
  const { name, businessName, description, phoneNumber, email, merchantId } = req.body;

  // const {id} = req.query.merchantId
  // console.log("iddddd",id)
  console.log("hello baba")

  const merchantbyEmail = await UserModel.findOne({ email: email });
  const merchantbymobile = await UserModel.findOne({ mobile_no: phoneNumber })

  console.log("testdata", merchantbyEmail,



    email,
    phoneNumber,
  )




  // if (merchantbyEmail || merchantbymobile) {
  //   res.status(403).json({ message: `this user is exist  `, success: false })
  //   console.log(
  //     "testttts babab"
  //   )

  // }

  try {
    await sendEmail({
      name,
      businessName,
      merchantEmail: email,
      merchantId: merchantId,
      email: email,
      phoneNumber,
      description,
    });
    res.status(200).json({ message: "email sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error?.message, success: false });
  }

}


);

router.post("/send-sms", async (req, res) => {
  const { mobileno, vendors_name, type, price, url, invoiceno,start_date,end_date,plan } = req.body
  console.log(mobileno, vendors_name)
  const url1 = "https://marketplace.elaundry.co.in/"
  let message = ""
  let templateId = ""
  switch (type) {
    case "leads":
      templateId = "1707166747148902896"
      message = `Dear ${vendors_name}, You have received a New Lead from a buyer for your product inquiry. Please check your registered email for more information. Regards, E-Laundry Marketplace. OMRA Solutions`

      break;
    case "payment":
      templateId = "1707167309378301462"
      message = `Dear ${vendors_name} , We have received your payment. Your Receipt No. ${invoiceno} and Amount is ${price}. Thank you to choosing our services. E-Laundry Marketplace. OMRA Solutions`

      break;

    case "subscription":
      templateId = "1707167309358954239"
      message = `Dear ${vendors_name}, Your Service ${plan} has been activated from ${start_date} to ${end_date}. Enjoy the Service! Regards, E-Laundry Marketplace. OMRA Solutions.`
      break;

    case "registration":
      templateId = "1707167309353498718"
      message = `Dear ${vendors_name}, You have registered successfully on E-Laundry Marketplace. Welcome On-boarding !.Regards, E-Laundry Marketplace. OMRA Solutions`
      break;

    case "payment-reminder":
      templateId = "1707167309363253224"
      message = `Dear ${vendors_name}, Your Subscription renewal date is {#var#}. Please renew it. E-Laundry Marketplace. OMRA Solutions`
      break;

    default:
      // templateId = "1707161160651766248"
      // message = `Dear ${vendors_name} , Please use this link to pay your bill for Invoice No. {#var#} and Amount {#var#}, Pay now ${invoiceno}. Thanks for your visit to {#var#}. OMRA SOLUTIONS`
      break;
  }
  console.log("type", type, templateId)

  // const message = `Dear ${vendors_name}, You have received a New Lead from a buyer for your product inquiry. Please check your registered email for more information. Regards, E-Laundry Marketplace. OMRA Solutions`
  console.log(message)
  try {
    const { data } = await axios({
      url: "http://sms.tyrodigital.com/api/mt/SendSMS",

      params: {
        user: "omra1",
        // "Laundriz",
        //  "omra1",
        password: "omra1@1234",
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
        DLTTemplateId: templateId,
      },

      responseType: "json",
      method: "get",
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },





    })


    console.log("SMS DATA", data);
  }
  catch (error) {
    console.log(error);
    res.json({ message: error })
  }
}
)


router.post("/callingApi",async(req,res)=>{
  const {
    Agent_Mob_No,
    buyer_Mob}=req.body
  // try {
   const callingApi= await axios.get(
      // `http://www.apiconnecto.com/UniProUser/Click-2-Call-API.aspx?UserId=DIGIVOICE&pwd=pwd2020&AgentNum=${Agent_Mob_No}&CustomerNum=${buyer_Mob}&CampId=15823`
      // `https://callapi.hrmsomra.com/UniProUser/Click-2-Call-API.aspx?UserId=DIGIVOICE&pwd=pwd2020&AgentNum=${number3}&CustomerNum=${number2}&CampId=15823`
      `http://obd1.nexgplatforms.com/ClickToCallApi?ApiKey=a1fee4a676cd6366100bbaf37cccc0c3&CampaignId=62&ConnectedTo=${Agent_Mob_No}&CalledNum=${buyer_Mob}&disableAgentCheck=1`
    );
    console.log("callingApi",callingApi?.data)
    res.status(200).json({success:true,data:callingApi?.data})


    
    
  
  // catch (error) {
  //   res.status(500).json({success:false,message:error?.message,data:error})
    
  // }
})

module.exports = router;
