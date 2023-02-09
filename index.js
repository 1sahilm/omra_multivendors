const express = require("express");

const bodyParser = require("body-parser");
const cors = require("cors");

const database = require("./config/database");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

database();

require("./auth/auth");

// const routes  = require('./routes/routes');
const secureRoute = require("./routes/secure-routes");
const upload = require("./routes/upload");
const category = require("./routes/category");
const buyer = require("./routes/buyer");
const { verifyJwt, verifyJwt1 } = require("./Middleware/jwtMiddleware");
const {IsAdmin } = require("./Middleware/isAdmin")
const getProduct = require("./routes/getproduct");
const adminProduct =require("./routes/superAdmin/adminproduct")
// const images = require('./routes/images')
const bannerImage = require("./routes/banner_images");
const blogs = require("./routes/blogs");
const banner = require("./routes/banner");
const service = require("./routes/secure/subscription/service");
const price = require("./routes/secure/subscription/price")
const package = require("./routes/secure/subscription/package");
const subscribe = require("./routes/secure/subscription/subscribe")
const enquiry = require("./routes/enquiry")
const sendMail = require("./lib/mailer")
const cookieParser = require("cookie-parser")

const app = express();

// app.use(express.json());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
// images=================

app.set("view engine", "ejs");

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use("/product-image", express.static("public/images"));
app.use("/category-image", express.static("public/images"));
app.use("/blog-image", express.static("public/blog"));
app.use("/banner-image", express.static("public/banner"));
app.use("/billing-image", express.static("public/billing"));

// app.use(cors({
//   origin:"http://localhost:3000",
//   method:['GET','POST']
// }))

app.get("/", (req, res) => {
  // res.render('index.ejs', {})
  res.json({ message: "Welcome to India bazar. --------------------." });
});

// app.use('/product',upload);
const routes = require("./routes/route");

// app.use('/images', images);
app.use("/upload", upload);
app.use("/api", routes);
app.use("/api", buyer);
app.use("/api/category", category);
app.use("/api", bannerImage);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/api/user", verifyJwt, secureRoute);
app.use("/api/user/blog", verifyJwt, blogs);
app.use("/api/banner", banner);
app.use("/api/pricing",price)
app.use("/api/pricing",service)
app.use("/api/pricing/package",package)
app.use("/api/enquiry",enquiry)
app.use("/api/pricing",subscribe)
// api for SuperAdmin==================
app.use("/api/admin",verifyJwt1,adminProduct)
console.log("hello testbabab",verifyJwt)


app.use("/api", getProduct);

// Handle errors.
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});


//////////////////////==========================


app.post("/api/test-mail",(req,res)=>{
  console.log("test1")

  try{
  const mail = sendMail({
    // merchantEmail:"eklavyasingh12065@gmail.com",
    merchantEmail:"kmryvamit78@gmail.com",
    description:"this is test",
    phoneNumber:"8210374580",
    email:"eklavyasingh12065@gmail.com"
    // email:"kmryvamit78@gmail.com"
  })

  res.status(200).json(mail)
}catch(error){
  res.send(error?.message)
  
}

})

//=================================
app.listen(PORT, () => {
  console.log("Server started.");
});
