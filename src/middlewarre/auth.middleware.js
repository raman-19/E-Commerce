import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";


// asyncHAndler catches async error automatically.



// middleware to verify jwt token and authenticate user
export const verifyJWT = asyncHandler(async(req,res,next)=>{
// check token exists

    try{
        const token = req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }


// verify jwt token
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

// find user by id in decoded token 
        const user = await User.findById(decoded._id).select("-password")

        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = user;
        next()
    }catch (error) {
        throw new ApiError(401,error?.message || "invalid access Token")
    }
})

// Admin verify middleware

export const verifyAdmin = asyncHandler(
   async(req,res,next)=>{

      if(req.user.role !== "admin"){
         throw new ApiError(
            403,
            "Only admin can access this route"
         )
      }

      next()
})