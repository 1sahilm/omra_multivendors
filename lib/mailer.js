const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const sendEmail = async ({
  merchantEmail,
  merchantId,
  description,
  invoice_Id,
  merchantName,
  price,

  email,
  phoneNumber,
  type
}) => {
  const CLIENT_ID =
    "366015990698-ur5v59gbh8rbu3jps3uipmv6tfkr3mlj.apps.googleusercontent.com";
  const CLIENT_SECRET = "__bqqQh9xhyLEDTLbLMV4EGP";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground/";
  const REFRESH_TOKEN =
    "1//04OGvkl_CtzQPCgYIARAAGAQSNwF-L9IrGGjy0iKNpRmib-C0LZKB7exYkmxXf8RtlP_MpsqIvU9v2x1Yzn7nR3xe2ARRqbyvZ9I";
  // console.log(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN);

  // const oAuth2Client = new google.auth.OAuth2(
  //   CLIENT_ID,
  //   CLIENT_SECRET,
  //   REDIRECT_URI
  // );

  // oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  // return new Promise(async (resolve, reject) => {
  //   const accessToken = oAuth2Client.getAccessToken((err, token) => {
  //     if (err) {
  //       return;
  //     } else {
  //       return token;
  //     }
  //   });
    const transporter = nodemailer.createTransport({
      service: 'Godaddy',
    host: "smtpout.secureserver.net",   
    secure: false,
    port: 465,
    debug: true,
    auth: {
      
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD 
    }
    });
    const html = ({ description, phoneNumber, email, merchantId,merchantEmail,invoice_Id,
      price,merchantName,type }) => {
      // Insert invisible space into domains and email address to prevent both the
      // email address and the domain from being turned into a hyperlink by email
      // clients like Outlook and Apple mail, as this is confusing because it seems
      // like they are supposed to click on their email address to sign in.
      const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
      const merchant=`${merchantEmail.replace(/\./g, "&#8203;.")}`

      // Some simple styling options
      const backgroundColor = "#fff";
      const textColor = "#000";
      const mainBackgroundColor = "#dadada45";
      const buttonBackgroundColor = "#e5e5e5";
      const buttonBorderColor = "#346df1";
      const buttonTextColor = "#ffffff";

      console.log("heloo email",type)

      // Uses tables for layout and inline CSS due to email client limitations
      switch (type) {
        case "leads":
          return `
          <body style="background: ${backgroundColor};">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                
                </td>
              </tr>
            </table>
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 800px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                 
                  Dear <strong> ${merchantName} </strong>, You have received a New Lead from a buyer (${escapedEmail}) for your product inquiry.
                  Please check your registered email for more information. Regards, E-Laundry Marketplace. OMRA Solutions
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table border="0" cellspacing="0" cellpadding="0">
                  <tr > 
                  <th align="center" style="border-radius: 5px; " >Merchant Name:</th>
                  <th align="center" style="border-radius: 5px; margin-left:20px" > Merchant Email:</th>
                  <th align="center" style="border-radius: 5px; margin-left:20px" > Buyer Email:</th>
                  <th align="center" style="border-radius: 5px; margin-left:20px" > Buyer Mobile:</th>
                  <th align="center" style="border-radius: 5px; margin-left:20px" > Buyer Query:</th>
                  </tr>
                    <tr>
                      <td style=" border:1px solid black; padding:20px !important; border-radius:3px"  bgcolor="${buttonBackgroundColor}" >${merchantName+"  "}</td>
                      <td style=" border:1px solid black; padding:20px !important; border-radius:3px"  bgcolor="${buttonBackgroundColor}" >${merchantEmail}</td>
                      <td style=" border:1px solid black; padding:20px !important; border-radius:3px"  bgcolor="${buttonBackgroundColor}" >${email}</td>
                      <td style=" border:1px solid black; padding:20px !important; border-radius:3px"  bgcolor="${buttonBackgroundColor}" >${phoneNumber}</td>
                      <td style=" border:1px solid black; padding:20px !important; border-radius:3px" bgcolor="${buttonBackgroundColor}" >${description}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          `
         
          
          break;
        case "payment":
          return `
          <body style="background: ${backgroundColor};">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                
                </td>
              </tr>
            </table>
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 800px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  Hello, <strong>${merchant}</strong> </br>Dear ${merchantName} , We have received your payment. Your Receipt No. ${invoice_Id} and Amount is ${price}. Thank you to choosing our services. E-Laundry Marketplace. OMRA Solutions.
                </td>
              </tr>
              
            </table>
          </body>
          `
          
          break;
       case "subscription":
        return `
        <body style="background: ${backgroundColor};">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
              
              </td>
            </tr>
          </table>
          <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 800px; margin: auto; border-radius: 10px;">
            <tr>
              <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                Hello, <strong>${merchant}</strong> </br> Dear ${vendors_name}, Your Service ${plan.map((item,index)=>{ return item.label})} has been activated from ${start_date} to ${end_date}. Enjoy the Service! Regards, E-Laundry Marketplace. OMRA Solutions.
              </td>
            </tr>
            
          </table>
        </body>
        `
          
          break;
        case "registration":
          return `
          <body style="background: ${backgroundColor};">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                
                </td>
              </tr>
            </table>
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 800px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  Hello, <strong> ${vendors_name}</strong> </br> , You have registered successfully on E-Laundry Marketplace. Welcome On-boarding !.Regards, E-Laundry Marketplace. OMRA Solutions.
                </td>
              </tr>
            
            </table>
          </body>
          `
          
          break;
        case "payment-reminder":
          return `
          <body style="background: ${backgroundColor};">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                
                </td>
              </tr>
            </table>
            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 800px; margin: auto; border-radius: 10px;">
              <tr>
                <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
                  Hello, <strong>${merchant}</strong> </br>Dear ${vendors_name}, Your Subscription renewal date is ${""}. Please renew it. E-Laundry Marketplace. OMRA Solutions.
                </td>
              </tr>
              
            </table>
          </body>
          `
          
          break;
      
        default:
          break;
      }
 
    };

    const message = {
      from: "@noreply <leadenquiry@elaundry.co.in>",
      to: [merchantEmail,"leadenquiry@elaundry.co.in"],
      subject: "Elaundry Marketplace - Customer Request",
      html: html({ description, email,merchantName, phoneNumber,merchantEmail,type }),
    };

    transporter.sendMail(message, function (err, info) {
      if (err) {
        // console.log({err})
        throw err
      } else {
        console.log({info})
         return (info);
      }
    });


   

};

module.exports =  sendEmail ;

//================================part2==================


// import nodemailer from "nodemailer";

// export default async (req, res) => {
//   const { fname, lname, email, phone, company } = req.body;
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {
//       // user: 'shyamattryy@gmail.com',
//       // pass: 'zsibiqyspqoncofw'
//       user: "elaundarysolution@gmail.com",
//       pass: "gmdedxwumzplaoic",
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: email,

//       to: "info@omrasolutions.com",
//       cc: "sachin@omrasolutions.com",
//       bcc: "elaundrysolution@gmail.com",
//       bcc: "omra.digitalsolution@gmail.com",

//       // bcc: "alka@omrasolutions.com",
//       // bcc: "anupam.singh@epicglobal.co.in",
//       // bcc: "sahil.mishra@epicglobal.co.in",
//       // bcc: "sahil.mishra@epicglobal.co.in",

//       subject: `Voice Process ${fname + " " + lname}`,
//       html: `<p>You have a contact form submission</p>
//       <p><strong>Name: </strong> ${fname + " " + lname}</p>
//         <p><strong>Email: </strong> ${email}</p>
//         <p><strong>Company: </strong> ${company}</p>
//         <p><strong>Phone: </strong> ${phone}</p>
        
//       `,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
//   return res.status(200).json({ tested: "OKAY" });
// };

