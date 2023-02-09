const jwt = require("jsonwebtoken");

const verifyJwt = async (req, res, next) => {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  const cookieToken = req?.cookies?.access_token;
  let token = "";

  if (cookieToken) {
    token = cookieToken;
  } else {
    token = authToken;
  }

  console.log({token})

  if (token) {
    try {
      const decoded = await jwt.verify(token, "TOP_SECRET");
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        error: err.message,
        message: "You are not authorized to perform this action",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
};


const verifyJwt1 = async (req, res, next) => {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  const cookieToken = req?.cookies?.access_token;
  let token = "";

  if (cookieToken) {
    token = cookieToken;
  } else {
    token = authToken;
  }

  console.log({"token1234bfdjfhdhfd":token})

  if (token) {
    try {
      const decoded = await jwt.verify(token, "TOP_SECRET");
      req.user= decoded.user
      console.log("userDataaa",req.user,"decoded",decoded.user)
      if(req.user.role=="SuperAdmin"){
        next();

      }
      
    } catch (err) {
      res.status(401).json({
        success: false,
        error: err.message,
        message: "You are not authorized to perform this action",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
};




module.exports = { verifyJwt,verifyJwt1 };


