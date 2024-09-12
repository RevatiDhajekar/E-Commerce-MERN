const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");


//register a user
exports.registerUser = catchAsyncErrors(async (req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is sample id",
            url:"profileUrl"
        }
    });

    sendToken(user,201,res);
});

//login existing user
exports.loginUser = catchAsyncErrors (async (req,res,next)=>{
    const {email,password} = req.body;
    console.log("pass=>" + password);
    
    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("please Enter Email & Password.",401))
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res);
});


//logout user
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out."
    });
});