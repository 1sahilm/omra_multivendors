const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const otpGenerator = require("otp-generator");
const UserModel = require("../model/model");
const sendEmail = require("../lib/mailer");
const axios = require("axios");

const { hashPassword, comparePassword } = require("../functions/passwordHash");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");
const SendSMS = require("../lib/sms");
const { default: ComposeSms } = require("../lib/compose-Message");

// const { default: ComposeMessage } = require("../lib/compose-Message");

require("dotenv").config();

router.post("/signup", async (req, res) => {
  const { email, mobile_no, password } = req.body;
  const role = "Admin";

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
      });

      const isMobile = await UserModel.findOne({
        mobile_no: mobile_no,
      });

      if (isEmail) {
        return res.json({ success: false, message: "Email is already exists" });
      } else if (isMobile) {
        return res.json({
          success: false,
          message: "Mobile is already exists",
        });
      } else {
        const user = await UserModel.create(data);

        const JWTPayload = {
          email: user.email,
          _id: user._id,
          role: user.role,
        };

        const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");

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

// user login ...
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
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Enter email or password is required",
      });
    }
    if (!otp) {
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
    };

    const token = jwt.sign({ user: JWTPayload }, "TOP_SECRET");
    res.cookie("access_token", token, { maxAge: 1000 * 60 * 60 * 24 * 7 });

    if (userOtp == otp) {
      console.log("Line no 191: ", userOtp == otp);
      return res.status(200).json({
        user: JWTPayload,
        token,
        message: "You are Logged in Successfully",
        success: true,
      });
    }
    res
      .status(400)
      .json({ success: false, message: "You have entered wrong otp" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// verify Otp User
router.post("/verifyOtp", async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.json({
        success: false,
        message: "Enter Otp is required",
      });
    }

    if (userOtp == otp) {
      return res.status(200).json({
        message: "Verified OTP Successfully",
        success: true,
      });
    } else {
      return res.json({
        success: false,
        message: "You are provided wrong otp",
      });
    }
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
    const findUser = await UserModel.findOne({ _id });

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

    res.status(200).json({
      success: true,
      message: "password updated successfully",
      updatePassword,
    });
  } catch (error) {
    console.log({ error: error.message });
  }
});

router.patch("/forgotpassword2", async (req, res) => {
  try {
    const { _id } = req.params;
    const { email, type } = req.body;
    console.log("email", email);
    const otp = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    userOtp = otp;
    function Otp(otp) {
      userOtp = otp;
    }
    Otp(otp);

    // Check If User Exists
    const findUser = await UserModel.findOne({ _id }).lean();
    const findUser1 = await UserModel.findOne({ email: email }).lean();

    if (!findUser1) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const mobileno = findUser1?.mobile_no;
    console.log("mobileno", mobileno);

    await SendSMS({ type: type, mobileno: mobileno, otp: otp });
    const user = { _id: findUser1?._id, email: email };

    res.status(200).json({ message: "success", user: user });
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
  const merchant = await UserModel.findOne(
    { _id: merchantId },
    { Merchant_Name: 1, email: 1 }
  );
  console.log("Merchant: ", { merchant });

  if (!merchant) {
    return res
      .status(404)
      .json({ message: "merchant not found", success: false });
  }

  try {
    await sendEmail({
      merchantEmail: merchant.email,
      merchantId: merchant._id,
      // merchantName:merchant?.Merchant_Name,
      email: merchant.email,
      merchantName: merchant?.Merchant_Name,
      price,
      invoice_Id: invoice_Id,
      phoneNumber: phoneNumber,
      description: description,
      type: type,
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

  console.log(
    "testdata",
    merchantbyEmail,
    email,
    phoneNumber,
    merchantbymobile
  );

  try {
    const demo = await sendEmail({
      name,
      businessName,
      merchantEmail: email,
      merchantId: merchantId,
      email: email,
      phoneNumber,
      description,
    });
    console.log("send email: ", { demo });
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

  // const url1 = "https://marketplace.elaundry.co.in/";
  // ComposeMessage();

  SendSMS({
    vendors_name: vendors_name,
    start_date: start_date,
    end_date: end_date,
    otp: otp,
    plan: plan,
    invoice_Id: invoice_Id,
    type: type,
    mobileno: mobileno,
  });
});

// way 1 for APIIntegration //

router.post("/compose_message", async (req, res) => {
  const {
    message_channel,
    message_route,
    sender_id,
    campaign_name,
    message_text,
    number,
  } = req.body;
    


  try{
     await ComposeSms({
    message_channel: message_channel,
    message_route: message_route,
    sender_id: sender_id,
    campaign_name: campaign_name,
    message_text: message_text,
    number: number,
  });
  res.status(200).json({ message: "composed msg sent successfully", success: true });
  }
 catch(error){
  res.status(500).json({ message: error?.message, success: false })
 }
});

module.exports = router;
