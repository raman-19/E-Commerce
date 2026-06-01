import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


const paymentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    amount:{
        type: Number,
        required: true
    },
    method:{
        type:String,
        enum:["COD", "UPI", "Card"],
        default:"COD",
        required: true
    },
    status:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    transactionid:{
        type:String,
    },
     paidAt:{
        type: Date,
    }   

 },{timestamps: true} 
   
    
);

export const Payment = mongoose.model("Payment", paymentSchema)