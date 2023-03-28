const axios = require("axios");

const SendSMS = async ({
  type,
  mobileno,
  vendors_name,
  otp,
  plan,
  start_date,
  end_date,
  invoice_Id,
}) => {
  console.log(mobileno, type, otp, "Inside sms file :: Line no 16");
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
    console.log(error.message);
  }
};
module.exports = SendSMS;
