import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import mongoose from "mongoose"
import { Order } from "../models/order.models.js";
import { Cart } from "../models/cart.model.js";



/* =========================================
   CREATE ORDER
========================================= */

const createOrder = asyncHandler(async(req,res)=>{

   const { shippingAddress } = req.body;



   // find user cart

   const cart = await Cart.findOne({

      user:req.user._id

   }).populate("items.product");

//    here we use populate because in replace objectId with actual document data




   // check cart exists

   if(!cart || cart.items.length === 0){

      throw new ApiError(
         400,
         "Cart is empty"
      );
   }



   // calculate total price

   let totalPrice = 0;

   cart.items.forEach((item)=>{

      totalPrice +=

         item.product.price *
         item.quantity;

   });



   // prepare order items

   const orderItems =

   cart.items.map((item)=>({

      product:item.product._id,

      quantity:item.quantity,

      price:item.product.price

   }));



   // create order

   const order = await Order.create({

      user:req.user._id,

      orderItems,

      shippingAddress,

      totalPrice

   });



   // clear cart after order

   await Cart.findByIdAndDelete(
      cart._id
   );



   // send response

   return res.status(201).json(

      new ApiResponse(
         201,
         order,
         "Order placed successfully"
      )
   );

});



/* =========================================
   GET MY ORDERS
========================================= */

const getMyOrders = asyncHandler(async(req,res)=>{

   const orders = await Order.find({

      user:req.user._id

   }).populate("orderItems.product");



   return res.status(200).json(

      new ApiResponse(
         200,
         orders,
         "Orders fetched successfully"
      )
   );

});



/* =========================================
   GET SINGLE ORDER
========================================= */

const getSingleOrder = asyncHandler(async(req,res)=>{

   const order = await Order.findById(

      req.params.id

   )
   .populate("user","name email")
   .populate("orderItems.product");



   if(!order){

      throw new ApiError(
         404,
         "Order not found"
      );
   }



   return res.status(200).json(

      new ApiResponse(
         200,
         order,
         "Order fetched successfully"
      )
   );

});



/* =========================================
   CANCEL ORDER
========================================= */

const cancelOrder = asyncHandler(async(req,res)=>{

   const order = await Order.findById(

      req.params.id
   );



   if(!order){

      throw new ApiError(
         404,
         "Order not found"
      );
   }



   // check order belongs to user

   if(

      order.user.toString()

      !==

      req.user._id.toString()

   ){

      throw new ApiError(
         403,
         "Unauthorized action"
      );
   }



   // update status

   order.orderStatus = "Cancelled";

   await order.save();



   return res.status(200).json(

      new ApiResponse(
         200,
         order,
         "Order cancelled successfully"
      )
   );

});



/* =========================================
   UPDATE ORDER STATUS (ADMIN)
========================================= */

const updateOrderStatus = asyncHandler(async(req,res)=>{

   const { status } = req.body;



   const order = await Order.findById(

      req.params.id
   );



   if(!order){

      throw new ApiError(
         404,
         "Order not found"
      );
   }



   order.orderStatus = status;

   await order.save();



   return res.status(200).json(

      new ApiResponse(
         200,
         order,
         "Order status updated"
      )
   );

});



/* =========================================
   GET ALL ORDERS (ADMIN)
========================================= */

const getAllOrders = asyncHandler(async(req,res)=>{

   const orders = await Order.find()

   .populate("user","name email")
   .populate("orderItems.product");



   return res.status(200).json(

      new ApiResponse(
         200,
         orders,
         "All orders fetched successfully"
      )
   );

});



export {

   createOrder,
   getMyOrders,
   getSingleOrder,
   cancelOrder,
   updateOrderStatus,
   getAllOrders
}  