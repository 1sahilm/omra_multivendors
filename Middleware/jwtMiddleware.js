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

  if (token) {
    try {
      const decoded = await jwt.verify(token, "TOP_SECRET");
      req.user = decoded.user;
      if (req.user.role === "SuperAdmin") {
        next();
      }
    } catch (err) {
      res.status(401).json({
        success: false,
        error: err.message,
        message: "You are not authorized to perform this action",
      });
    }
  } else if (token == "") {
    res.status(401).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
};

const isManagerOrExecutive = async (req, res, next) => {
  const authToken = req.headers["authorization"]?.split(" ")[1];
  const cookieToken = req?.cookies?.access_token;
  let token = "";
  if (cookieToken) {
    token = cookieToken;
  } else {
    token = authToken;
  }
  if (token) {
    try {
      const decoded = await jwt.verify(token, "TOP_SECRET");
      req.user = decoded.user;
      if (req.user.role === "Manager" || req.user.role === "Executive") {
        next();
      }
    } catch (err) {
      res.status(401).json({
        success: false,
        error: err.message,
        message: "You are not authorized to perform this action",
      });
    }
  } else if (token == "") {
    res.status(401).json({
      success: false,
      message: "You are not authorized to perform this actionfffff",
    });
  }
};

module.exports = { verifyJwt, verifyJwt1, isManagerOrExecutive };
