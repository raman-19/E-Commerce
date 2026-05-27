import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import mongoose from "mongoose"
import { Cart} from "../models/cart.model.js"
import {Product} from "../models/product.model.js"

// add to cart 
const addToCart = asyncHandler(async(req,res)=>{
    const {productId, quantity} = req.body;

    if(!productId){
        throw new ApiError(
            400, "Product id is required"
        )
    }
    // check product exists

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(
            404,
            "Product not found"
        )
    }

    // Find user cart

    let  cart = await Cart.findOne({
        user: req.user._id
    })

    // if cart does not exist
    if(!cart){
        cart=await Cart.create({
            user:req.user._id,
            items:[
                {
                    product:productId,
                    quantity:quantity|| 1
                }
            ]
        })
    }else{
        // check product already exists
        const itemIndex=cart.items.findIndex(
            item=>
                item.product.toString()===productId
        );

        // if product exists increase quqntity
        if(itemIndex >-1){
            cart.items[itemIndex].quantity += quantity || 1;
        }else{
            // add new product

            cart.item.push({
                product:productId,
                quantity:quantity || 1
            })
        }
        await cart.save();
    }
    return res.status(200).json(
        new ApiResponse(
            200,cart,"Product added to cart"
        )
    )
})

// get user Cart
const getUserCart = asyncHandler(async(req, res)=>{
    const cart = await Cart.findOne({user:req.user._id}).populate("items.product");

    if(!cart){
        throw new ApiError(
            404,
            "Cart is empty"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "cart fetched successfully"
        )
    )

})

// Remove Product From Cart

const removeFromCart = asyncHandler(async(req,res)=>{
    const{productId} = req.params;
    const cart = await Cart.findOne({
        user:req.user._id
    })

    if(!cart){
        throw new ApiError(
            404,
            "Cart not found"
        )
    }
    cart.items = cart.items.filter(
    item => String(item.product) !== String(productId)
    );
    
    //    console.log(productId)

     // check if cart becomes empty

    if (cart.items.length === 0) {

        await Cart.findByIdAndDelete(
            cart._id
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                {},
                "Cart deleted because no items left"
            )
        );
    }


    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product removed from cart"
        )
    )
})

const updateCartQuantity = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    const { quantity } = req.body;

    const cart = await Cart.findOne({

        user: req.user._id
    });

    if (!cart) {

        throw new ApiError(
            404,
            "Cart not found"
        );
    }

    const item = cart.items.find(

        item =>
        item.product.toString() === productId
    );

    if (!item) {

        throw new ApiError(
            404,
            "Product not found in cart"
        );
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json(

        new ApiResponse(
            200,
            cart,
            "Cart updated successfully"
        )
    );

});

export {

    addToCart,
    getUserCart,
    removeFromCart,
    updateCartQuantity

};