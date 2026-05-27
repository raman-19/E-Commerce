import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema= new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true,

        },
        password:{
            type:String,
            required:true,
            minlength:8,
            match:[
                /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
                "Password must contain uppercase, number and special charater"
            ]
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        refreshToken:{
            type:String
        }


    },
    {
        timestamps:true
    }
)   

    // in modern mongoose allow to skip next() completely if using async function.
    // “Before saving user document, run this function first.”
    
    userSchema.pre("save", async function(){
        if(!this.isModified("password"))
            return;
        this.password = await bcrypt.hash(this.password,10)

    })

    userSchema.methods.isPasswordMatch = async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password)
    }

    userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                username:this.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        ) 
    }

    userSchema.methods.generateRefreshToken = function(){
        return jwt.sign(
            {
                _id:this._id,
                

            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
        )

    }
   

export const User = mongoose.model("User",userSchema)