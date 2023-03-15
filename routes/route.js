const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const otpGenerator = require("otp-generator");
const UserModel = require("../model/model");
const sendEmail = require("../lib/mailer");
const axios = require("axios");

const { hashPassword, comparePassword } = require("../functions/passwordHash");
require("dotenv").config();

router.post("/signup", async (req, res) => {
  const { email, mobile_no, password  } = req.body;
  const role="Admin"

  const data = {
    email: email,
    mobile_no: mobile_no,
    password: hashPassword(password),
    role: role,
  };

  try {
    if (!email || !mobile_no) {
      return res.json({
        success: false,
        message: "email and mobile no is required",
      });
    } else {
      const isEmail = await UserModel.findOne({
        email: email,
        // mobile_no: mobile_no,
      });
      const isMobile = await UserModel.findOne({
        mobile_no: mobile_no,
      });

      if (isEmail) {
        return res.json({
          success: false,
          message: "This Email is already exists",
        });
      } else if (isMobile) {
        return res.json({
          success: false,
          message: "This Mobile is already exists",
        });
      } else {
        const user = await UserModel.create(data);

        const JWTPayload = {
          email: user.email,
          _id: user._id,
          role: user.role,
        };

        const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");
        console.log("This user is already exists");

        res.status(201).json({
          success: true,
          message: "created successfully",
          data: user,
          // token: token,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ success: false, data: err?.message });
  }
});

let userOtp = 0000;

router.post("/login", async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Enter email or password is required",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Please register your details",
      });
    }
    const checkPassword = comparePassword(password, user.password);
    const checkIsActive = user.isActive;

    if (!checkPassword) {
      return res.json({ success: false, message: "invalid email or password" });
    }

    if (!checkIsActive) {
      return res.json({ success: false, message: "user is deactivated" });
    }

    const JWTPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      isRegistered: user?.company_Name && user.Merchant_Name ? true : false,
      isBusinessDetails:
        user?.Merchant_Name && user?.SubTypeOf_bussiness ? true : false,
      isCompany: user?.company_Name ? true : false,
    };
    const JWTPayload1 = {
      _id: user._id,
      email: user.email,
      role: user.role,
      password: password,
      mobile_no: user.mobile_no,
    };

    const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    if (user.role === "SuperAdmin") {
      
      return res.status(200).json({
        user: JWTPayload1,
        // isAuthenticated:false,
        // token,
        success: true,
      });
    }

    
    res.status(200).json({
      user: JWTPayload,
      token,
      message: "You are Logged in Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
// Super Admin Login Using OTP
router.post("/adminlogin", async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    console.log("print",userOtp == otp)
    console.log("print44",otp,userOtp)

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Enter email or password is required",
      });
    }
    if(!otp){
      return res.json({
        success: false,
        message: "OTP is required",
      });

    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Please register your details",
      });
    }
    const checkPassword = comparePassword(password, user.password);
    const checkIsActive = user.isActive;

    if (!checkPassword) {
      return res.json({ success: false, message: "invalid email or password" });
    }

    if (!checkIsActive) {
      return res.json({ success: false, message: "user is deactivated" });
    }

    const JWTPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      // isRegistered: user?.company_Name && user.Merchant_Name ? true : false,
      // isBusinessDetails:
      //   user?.Merchant_Name && user?.SubTypeOf_bussiness ? true : false,
      // isCompany: user?.company_Name ? true : false,
    };
    

    const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    

  
      if (userOtp == otp) {
        return res.status(200).json({
          user: JWTPayload,
          token,
          message: "You are Logged in Successfully",
          success: true,
        });
      } 
      res.json({
          success: false,
          message: "you have Entered wrong otp",
        });
    
    
    // res.status(200).json({
    //   user: JWTPayload,
    //   token,
    //   message: "You are Logged in Successfully",
    //   success: true,
    // });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "logout successfully",
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
    const { email } = req.body;

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
  const {
    description,
    phoneNumber,
    email,
    merchantId,
    price,
    invoice_Id,
    type,
  } = req.body;

  console.log("userdata", description, phoneNumber, email, merchantId, type);
  const merchant = await UserModel.findOne({ _id: merchantId });

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
      merchantName: merchant?.Merchant_Name,
      price,
      invoice_Id,
      phoneNumber,
      description,
      type,
    });
    res.status(200).json({ message: "email sent successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: error?.message, success: false });
  }
});

router.post("/send-mail-contact-us", async (req, res) => {
  const { name, businessName, description, phoneNumber, email, merchantId } =
    req.body;

  const merchantbyEmail = await UserModel.findOne({ email: email });
  const merchantbymobile = await UserModel.findOne({ mobile_no: phoneNumber });

  console.log("testdata", merchantbyEmail, email, phoneNumber);

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
});

router.post("/send-sms", async (req, res) => {
  const {
    mobileno,
    vendors_name,
    price,
    type,
    url,
    invoice_Id,
    start_date,
    end_date,
    plan,
  } = req.body;
  console.log(mobileno, vendors_name,type,"testtttttype");
  console
  const otp = otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  console.log("otp", otp);
  userOtp = otp;
  function Otp(otp) {
    userOtp = otp;
  }
  Otp(otp);

  const url1 = "https://marketplace.elaundry.co.in/";
  let message = "";
  let templateId = "";
  switch (type) {
    case "leads":
      templateId = "1707166747148902896";
      message = `Dear ${vendors_name}, You have received a new Lead from a buyer
       for your product inquiry.Please check your registered 
       email for more information. Regards, E-Laundry Marketplace.
       OMRA Solutions`;

      break;
    case "payment":
      templateId = "1707167309378301462";
      message = `Dear ${vendors_name} , We have received your payment. Your Receipt No. ${invoice_Id} and Amount is ${price}. Thank you to choosing our services. E-Laundry Marketplace. OMRA Solutions`;

      break;

    case "subscription":
      templateId = "1707167309358954239";
      message = `Dear ${vendors_name}, Your Service ${plan.map(
        (item, index) => {
          return item.label;
        }
      )} has been activated from ${start_date.slice(0, 10)} to ${end_date.slice(
        0,
        10
      )}. Enjoy the Service! Regards, E-Laundry Marketplace. OMRA Solutions.`;
      break;

    case "registration":
      templateId = "1707167309353498718";
      message = `Dear ${vendors_name}, You have registered successfully on E-Laundry Marketplace. Welcome On-boarding !.Regards, E-Laundry Marketplace. OMRA Solutions`;
      break;

    case "payment-reminder":
      templateId = "1707167309363253224";
      message = `Dear ${vendors_name}, Your Subscription renewal date is {#var#}. Please renew it. E-Laundry Marketplace. OMRA Solutions`;
      break;

    case "otp-login":
      templateId = "1707161160681288183";
      message = `Auth code ${otp} to verify your mobile number. OMRA SOLUTIONS`;
      break;

    default:
      // templateId = "1707161160651766248"
      // message = `Dear ${vendors_name} , Please use this link to pay your bill for Invoice No. {#var#} and Amount {#var#}, Pay now ${invoiceno}. Thanks for your visit to {#var#}. OMRA SOLUTIONS`
      break;
  }

  try {
    const { data } = await axios({
      url: "http://sms.tyrodigital.com/api/mt/SendSMS",

      params: {
        user: process.env.SMS_USER,
        // "Laundriz",
        //  "omra1",
        password: process.env.PASSWORD,
        //  "Laundriz@1234",
        // "omra1@1234",
        senderid: process.env.SENDER_ID,
        channel: process.env.CHANNEL,
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
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/callingApi", async (req, res) => {
  const { Agent_Mob_No, buyer_Mob } = req.body;
  // try {
  const callingApi = await axios.get(
    `http://obd1.nexgplatforms.com/ClickToCallApi?ApiKey=a1fee4a676cd6366100bbaf37cccc0c3&CampaignId=62&ConnectedTo=${Agent_Mob_No}&CalledNum=${buyer_Mob}&disableAgentCheck=1`
  );
  console.log("callingApi", callingApi?.data);
  res.status(200).json({ success: true, data: callingApi?.data });
});

module.exports = router;
