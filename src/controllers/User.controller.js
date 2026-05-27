import {asyncHandler} from "../utils/asyncHandler.js"
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        // console.log("reresh", refreshToken)
        // console.log("User refrresh",user.refreshToken)
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    }catch(error){
        console.log(error)
        throw new ApiError(500,"Something went wrong generating refresh and access token")

    }
}

const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validation -not empty
    // check if user already exists username,email
    // create user object-create entery in db
    // remove password and refresh token field rom response
    // return response it not than error

    const {username, email, password}=req.body;
    console.log(username)
    if(
        [username,email,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existingUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existingUser){
        throw new ApiError(409,"User with this email or username already exists")
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"User registration failed")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )


})

// login user

const loginUser=asyncHandler(async(req,res)=>{

    const {email, password}=req.body;

    if(!email || !password){
        throw new ApiError(400,"Email and password are required")
    }

    const user=await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User not found ")
    }
    const isPasswordValid = await user.isPasswordMatch(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password")
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={
        httpOnly:true,
        secure:false
    }
    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User Logged In Successfully"
        )
    )
    
   
})


// logout USer

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(   // find currently logged-in user and update data
        req.user._id, // come from auth middleware
        {
            $unset:{     //remove field from mongodb document
                refreshToken:1
            }
        },
        {
            new:true  //it is used for returning updated document
        }
    )

    const options={
        httpOnly:true, //javascript can not access cookie
        secure:false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options) // remove cookie from browser
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})


// refresh access token

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // console.log("incoming",incomingRefreshToken)
    // console.log(typeof incomingRefreshToken)

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        
        
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: false
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})






// change password
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {currentPassword, newPassword}=req.body;

    const user=await User.findById(req.user?._id)
    const isPasswordValid = await user.isPasswordMatch(currentPassword)

    if(!isPasswordValid){
        throw new ApiError(401, "Current password is incorrect")
    }
    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))    
}
)

// get curreent user details
const getCurrentUserdetails = asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"

        )
    )
})

// update to account details
const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {username,email}=req.body;

    if(!username && !email){
        throw new ApiError(400, "At least one field is required to update")
    }
    const user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{ // here $set update only username or email 
                username,
                email:email
            }
        },
        {
            new:true // return updated id
        }

    
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))

})





export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUserdetails,
    updateAccountDetails


}