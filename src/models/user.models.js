import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        usename:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            index:true,
            trim:true,
        },
        avatar:{
            type:String,
            required:true,
        },
        coverImage: {
            type:String,
        },
        watchHistory: {
            type: mongoose.Schema.ObjectId,
            ref: "video",
        },
        password:{
            type:String,
            required:[true, "Pass is required"]
        },
        refreshToken:{
            type:string
        }
        
    },{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password,10)
    next()
    bcrypt.hash
})

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


// jwt token generation => jwt.sign(data,securityKey,[])
userSchema.method.generateAccesstoken = function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_EXPIRY
        }
    )
}

userSchema.method.generateRefreshToken = function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.REFRESH_TOKEN,
        {
            expiresIn:process.env.REFRESH_EXPIRY
        }
    )
}


export const User = mongoose.Model("User",userSchema)