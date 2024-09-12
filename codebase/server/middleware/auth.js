const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//This middleware ensures that only authenticated users can access specific routes.
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    return next(new ErrorHandler("Please login to access this resourse."));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decodedData);

  req.user = await User.findById(decodedData.id);

  next(); //if the token is valid ,middleware calls next() to pass control to the next middleware or route handler
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(
        `Role : ${req.user.role} is not allowed to access this resource`,
        403
      ));
    }
    next();
    //req.user object in the authorizeRoles middleware comes from the isAuthenticatedUser middleware that you set up earlier.
  };
};
