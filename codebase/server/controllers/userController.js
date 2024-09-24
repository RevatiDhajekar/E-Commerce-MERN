const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");

//register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "profileUrl",
    },
  });

  sendToken(user, 201, res);
});

//login existing user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("pass=>" + password);

  //checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("please Enter Email & Password.", 401));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//logout user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out.",
  });
});

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });  //The updated user (with the reset token and expiration)
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n
  If you have not requested this email then, please ignore it.`;
  try {
    await sendEmail({
        email:user.email,
        subject:`Ecommerce Password Recovery`,
        message:message

    });
    res.status(200).json({
        success:true,
        message:`Email sent to ${user.email} successfully`
    })
    
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });  // If sending the email fails, the reset token is removed, 
    return next(new ErrorHandler(error.message,500));
  }
});


exports.resetpassword = catchAsyncErrors(async(req,res,next)=>{
  //create hash token
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt : Date.now()}
  });
  if (!user) {
    return next(new ErrorHandler("reset password tokenm is invalid or has been expired.", 404));
  }

  if(req.body.password !== req.body.confirmPasword){
    return next(new ErrorHandler("Password does not matched."));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user ,200,res);
});

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findOne({ _id:req.user.id});
  res.status(200).json({
    success:true,
    user
  })
});