const express = require("express");

const router = express.Router();

const path = require("path");
// const sharp = require("sharp");
const multer = require("multer");

const Services = require("../../../model/pricing/service");

const UserModel = require("../../../model/model");
const sdk = require("@cashfreepayments/cashfree-sdk");
const Subscription = require("../../../model/pricing/subscription");

const {
  CFConfig,
  CFPaymentGateway,
  CFEnvironment,
  CFLinkCustomerDetailsEntity,
  CFLinkNotifyEntity,
  CFLinkRequest,
  prodCfConfig,
} = require("cashfree-pg-sdk-nodejs");
const getNextSequenceValue = require("./sequence");

//=====================================================

const {} = sdk;

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
  "/add_subscribe",
  upload.fields([
    { name: "category_image", maxCount: 1 },
    { name: "category_image2", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      auther_Id,
      mobile_no,
      vendors_name,
      email,
      GST_No,
      address,
      name,
      plan,
      plan2,
      payment_mode,
      start_date,
      end_date,
      price,
      benifits,
      validity,
      gst,
      total,
      Amount,
      payment_link,
      payment_status,

      isActive,
    } = req.body;

    if (!auther_Id) {
      res.json({ success: false, message: "user select Name is mandatory" });
    } else {
      const isSubscribe = await Subscription.findOne({
        auther_Id: auther_Id,
      });
      // if (isSubscribe) {
      //     res.json({ success: false, message: `${isSubscribe?.vendors_name} has Already Subscribe try with new` });
      // }

      try {
        const subscribe = await new Subscription({
          auther_Id: auther_Id,
          mobile_no: mobile_no,
          vendors_name: vendors_name,
          email: email,
          GST_No: GST_No,
          address: address,
          name: name,
          plan: JSON.parse(plan),
          plan2: plan2,
          payment_mode: payment_mode,
          start_date: start_date,
          end_date: end_date,
          price: price,
          benifits: benifits,
          validity: validity,
          gst: gst,
          total: total,
          Amount: Amount,
          payment_link: payment_link,
          payment_status: payment_status,
          // invoice_no:getNextSequenceValue("_id")

          // category_image: `${process.env.BASE_URL}/category-image/${req.files.category_image[0].filename}`,
        });
        await subscribe.save();
        res
          .status(200)
          .json({
            success: true,
            data: subscribe,
            message: `${subscribe?.vendors_name} whose mobile no:${subscribe?.mobile_no} has  created Successfully`,
          });
      } catch (err) {
        res.status(500).send({ message: err?.message });
      }
    }
  }
);

router.patch(
  "/upload_payment_details/:_id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    const { _id } = req.params;

    const testdata = await Subscription.find({}, { invoice_no: 1 });
    length = testdata.length;
    const invoice = testdata[testdata.length - 2];

    try {
      const payment = await Subscription.updateOne(
        { _id },
        {
          auther_Id: req.body.auther_Id,
          payment_mode: req.body.payment_mode,
          payment_status: req.body.payment_status,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          price: req.body.price,
          benifits: req.body.benifits,
          image: `${process.env.BASE_URL}/billing-image/${req.files.image[0].filename}`,
          validity: req.body.validity,
          Amount: req.body.Amount,
          // invoice_no:getNextSequenceValue("_id")
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success: true,
        message: `
                 ${payment?.name}
                 Service  has Updated Sucessfully`,
        data: payment,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);

router.patch(
  "/update_subscription/:_id",
  upload.fields(
    [
      { name: "category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;

    const { plan, start_date, end_date, validity, isActive } = req.body;

    try {
      const service = await Subscription.updateOne(
        { _id },
        {
          start_date: start_date,
          end_date: end_date,
          plan: JSON.parse(plan),

          validity: validity,
          isActive: isActive,
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success: true,
        message: `
                 ${service?.plan.map((item) => {
                   return item.label;
                 })}
                 Service  has Updated Sucessfully`,
      });
    } catch (err) {
      res.json({
        message: err?.message,
      });
    }
  }
);

router.post("/payment-link", async (req, res) => {
  var apiInstance = new CFPaymentGateway();
  const { email, mobile_no, name, link_id, Amount, currency, purpose } =
    req.body;

  // var cfConfig = new CFConfig(CFEnvironment.PRODUCTION, "2022-01-01", "1304257938ebdc70844f8fe3d8524031", secret="");
  const cfConfig = new CFConfig(
    CFEnvironment.PRODUCTION,
    "2022-01-01",
    "1304257938ebdc70844f8fe3d8524031",
    "f520b71b1f9a44535a6f6029c69f91cae30d6a5f"
  );
  try {
    const customerDetails = new CFLinkCustomerDetailsEntity();
    customerDetails.customerEmail = email;
    customerDetails.customerPhone = "9090407300";
    customerDetails.customerName = name;
    var linkNotify = new CFLinkNotifyEntity();
    linkNotify.sendEmail = true;
    linkNotify.sendSms = true;
    var cFLinkRequest = new CFLinkRequest(); //"link_id_02", 1, "INR", "TESTING", customerDetails, false, null, null, linkNotify, false, null, null;
    cFLinkRequest.linkId = `${35599}`;
    cFLinkRequest.linkAmount = 22;
    cFLinkRequest.linkCurrency = "INR";
    cFLinkRequest.linkPurpose = "payment";
    cFLinkRequest.linkPost = "hello payment";
    // cFLinkRequest.linkamount= Amount,
    cFLinkRequest.customerDetails = customerDetails;
    cFLinkRequest.linkPartialPayments = false;
    cFLinkRequest.linkNotify = linkNotify;
    cFLinkRequest.linkAutoReminders = false;
    var response = await apiInstance.createPaymentLink(cfConfig, cFLinkRequest);

    // var apiInstance = new CFPaymentGateway();

    // var customerDetails = new CFLinkCustomerDetailsEntity();
    // customerDetails.customerEmail = "bhaskar.aggarwal@cashfree.com";
    // customerDetails.customerPhone = "9953844999";
    // customerDetails.customerName = "Bhaskar";
    // var linkNotify = new CFLinkNotifyEntity();
    // linkNotify.sendEmail = true;
    // linkNotify.sendSms = true;
    // var cFLinkRequest = new CFLinkRequest(); //"link_id_02", 1, "INR", "TESTING", customerDetails, false, null, null, linkNotify, false, null, null;
    // cFLinkRequest.linkId = "link_id_102";
    // cFLinkRequest.linkAmount = 1;
    // cFLinkRequest.linkCurrency = "INR";
    // cFLinkRequest.linkPurpose = "TESTING";
    // cFLinkRequest.customerDetails = customerDetails;
    // cFLinkRequest.linkPartialPayments = false;
    // cFLinkRequest.linkNotify = linkNotify;
    // cFLinkRequest.linkAutoReminders = false;
    // var response = await apiInstance.createPaymentLink(
    //     prodCfConfig,
    //     // cfConfig,
    //     cFLinkRequest
    // );

    ///=============================
    // cf_link_id= 1576977,
    //     link_id="payment_ps11",
    //     link_status= "PARTIALLY_PAID",
    //     link_currency= "INR",
    //     link_amount= "200.12",
    //     link_amount_paid= "55.00",
    //     link_partial_payments= true,
    //     link_minimum_partial_amount= "11.00",
    //     link_purpose= "Payment for order 10",
    //     link_created_at= "2021-08-18T07:13:41",
    //     customer_details= {
    //         "customer_phone": "9000000000",
    //         "customer_email": "john@gmail.com",
    //         "customer_name": "John "
    //     },
    //     link_meta= {
    //         "notify_url": "https://ee08e626ecd88c61c85f5c69c0418cb5.m.pipedream.net"
    //     },
    //     link_url= "https://payments-test.cashfree.com/links//U1mgll3c0e9g",
    //     link_expiry_time= "2021-11-28T21:46:20",
    //     link_notes= {
    //         "note_key_1": "note_value_1"
    //     },
    //     link_auto_reminders= true,
    //     link_notify= {
    //         send_sms: true,
    //         send_email: true,
    //     },
    //     order= {
    //         "order_amount": "22.00",
    //         "order_id": "CFPay_U1mgll3c0e9g_ehdcjjbtckf",
    //         "order_expiry_time": "2021-08-18T07:34:50",
    //         "order_hash": "Gb2gC7z0tILhGbZUIeds",
    //         "transaction_id": 1021206,
    //         "transaction_status": "SUCCESS",
    //     }

    if (response != null) {
      console.log(response.cfRefunds.Count);
      console.log(response?.cfLink?.linkUrl);
      console.log(response?.cfHeaders);
    }
  } catch (error) {
    throw error;
  }

  // sdk.server('https://api.cashfree.com/pg');
  // await apiInstance.createPaymentLink({
  //     cfConfig,
  //   customer_details: {
  //     customer_phone: '8210374580',
  //     customer_email: 'kmryvamit78@gmail.com',
  //     customer_name: 'amit kmr'
  //   },
  //   link_notify: {send_sms: true, send_email: true},
  //   link_auto_reminders: true,
  //   link_id: 'jghhgfhgfhff',
  //   link_amount: 100,
  //   link_currency: 'INR',
  //   link_purpose: 'for rent',
  //   link_partial_payments: false,
  //   link_minimum_partial_amount: 10,
  //   link_expiry_time: '2023-01-14T15:04:05+05:30'
  // }, {
  //     xClientId: '1304257938ebdc70844f8fe3d8524031',
  //   x_client_secret: 'f520b71b1f9a44535a6f6029c69f91cae30d6a5f',
  //   x_api_version: '2022-09-01'
  // })
  //   .then(({ data }) => console.log(data))
  //   .catch(err => console.error(err));
});

router.patch(
  "/resend-pay-link/:_id",
  upload.fields(
    [
      { name: "category_image", maxCount: 1 },
      { name: "category_image2", maxCount: 1 },
    ]
    // upload.fields('banner_image1',5
  ),
  async (req, res) => {
    const { _id } = req.params;
    const { payment_link } = req.body;

    try {
      const service = await Subscription.updateOne(
        { _id },
        {
          payment_link: req.body.payment_link,
        },
        {
          new: true,
          upsert: true,
        }
      );
      //Fields

      res.json({
        success: true,
        message: `payment Link has been sent`,
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

router.delete("/delete_subscription/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const service = await Subscription.findOneAndDelete({ _id: _id });

    res.json({
      success: true,
      message: `${service?.name} has deleted Sucessfully`,
      service,
    });
  } catch (error) {
    res.json({ message: error?.message, success: false });
  }
});

router.get("/get_subscribe", async (req, res) => {
  const testdata = await Subscription.find({}).sort({ createdDate: "asc" });
  length = testdata.length;
  const invoice = testdata[testdata.length - 1];

  try {
    const service = await Subscription.find({});

    res.status(200).json({ data: service, success: true });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = router;
