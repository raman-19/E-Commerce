import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import mongoose from "mongoose"
import {Payment} from "../models/payment.model.js";
import { Order } from "../models/order.models.js";

 const createPayment = asyncHandler(async(req,res)=>{
    const {orderId, paymentMethod}= req.body;
    if(!orderId || !paymentMethod){
        throw new ApiError(400, "orderId and paymentMethod are required")
    }
    const order = await Order.findById(orderId);
    if(!order){
        throw new ApiError(404, "Order not found")
    }
    const payment = await Payment.create({
        user: req.user._id,
        order: order._id,
        amount: order.totalPrice,
        paymentMethod,  
        status: "pending"
    })
   return res.status(201).json(new ApiResponse(201,payment, "Payment created successfully", ))
})


const getMyPayments = asyncHandler(async(req,res)=>{
    const payments = await Payment.find({user: req.user._id}).populate("order");
    return res.status(200).json(
        new ApiResponse(
            200,
            payments,
            "Payments fetched successfully"
        )
    )
})

const getSinglePayment = asyncHandler(async (req, res) => {

   const payment = await Payment.findById(
      req.params.id
   );

   if (!payment) {
      throw new ApiError(
         404,
         "Payment not found"
      );
   }

   return res.status(200).json(
      new ApiResponse(
         200,
         payment,
         "Payment fetched successfully"
      )
   );

});

const updatePaymentStatus = asyncHandler(async (req, res) => {

   const { status } = req.body;

   const payment = await Payment.findById(
      req.params.id
   );

   if (!payment) {
      throw new ApiError(
         404,
         "Payment not found"
      );
   }

   payment.paymentStatus = status;

   if (status === "Success") {
      payment.paidAt = new Date();
   }

   await payment.save();

   return res.status(200).json(
      new ApiResponse(
         200,
         payment,
         "Payment updated successfully"
      )
   );

});
export {

    createPayment,
    getMyPayments,
    getSinglePayment,
    updatePaymentStatus

}