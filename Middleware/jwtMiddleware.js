const jwt = require("jsonwebtoken");

const verifyJwt = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    // console.log(token)
  
    if (token) {
      try {
        const decoded = jwt.verify(token, "TOP_SECRET");
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
      res
        .status(401)
        .json({
          success: false,
          message: "You are not authorized to perform this action",
        });
    }
  };

  module.exports = { verifyJwt };