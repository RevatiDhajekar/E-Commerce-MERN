const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name."],
        maxLength:[30,"Name cannot exceed 30 characters."],
        minLength:[4,"Name should have more than 4 characters"] 
    },
    email:{
        type:String,
        required:[true,"Please Enter your Email."],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter your password."],
        minLength:[8,"Name should have more than 8 characters"],
        select:false
    },
    avatar:{              //uploading to cloudinary   
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

//pre event on userschema
//we cant use this in arrw function
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){  //if password changed then only encrypt bcz we dont want to encrypt the encrypted password again
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

//JWT TOKEN 
//we have stored userId in token 
 userSchema.methods.getJWTtoken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
 }

 userSchema.methods.comparePassword = async function(enteredPassword){
    console.log("this pass=>"+this.password);
    
    return await bcrypt.compare(enteredPassword,this.password);
 }
module.exports = mongoose.model("User",userSchema);