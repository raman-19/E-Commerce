import {Product} from "../models/product.model.js";
import {uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import mongoose from "mongoose"


const createProduct = asyncHandler(async(req,res)=>{
    const {name, description, price, stock, category} = req.body;

    if([name,description,price,stock,category].some((field)=> !field || field === "")){
        throw new ApiError(400, "All fields are required")
    }

    // get images from req.files
    const imagesLocalPath = req.file?.path;

    if(!imagesLocalPath){
        throw new ApiError(400,"Product image is required")
    }

    // upload image to cloudinary

    const uploadImages = await uploadOnCloudinary(imagesLocalPath);
    if(!uploadImages){
        throw new ApiError(500,"Failed to upload product image")
    }

    // create product

    const product=await Product.create({
        name,
        description,
        price,
        stock,
        category,
        images:[
            {
                url:uploadImages.secure_url,
                public_id:uploadImages.public_id
            }
        ]
    })

    const createdProduct = await Product.findById(product._id);

    if(!createdProduct){
        throw new ApiError(500,"Failed to create product")
    }
    res.status(201).json(new ApiResponse(201, createdProduct,"Product created successfully",)) 




})

// get all products
const getAllProducts = asyncHandler(async(req,res)=>{
    const products = await Product.find();
    res.status(200).json(new ApiResponse(200, products,"Products fetched successfully",)) 
})

// get single product

const getSingleProduct = asyncHandler(async(req,res)=>{

    // get product id from req.params
    const {id} = req.params;

    // Search product in database 
    const product = await Product.findById(id);

    if(!product){
        throw new ApiError(404,"Product not found")
    }   


    res.status(200).json(new ApiResponse(200, product,"Product fetched successfully",)) 

})

// update product

// const updateProduct = asyncHandler(
//    async(req,res)=>{

//       // get updated fields
//       const {
//          name,
//          description,
//          price,
//          stock,
//          category
//       } = req.body;

//       // check at least one field
//       if(
//          !name &&
//          !description &&
//          !price &&
//          !stock &&
//          !category
//       ){

//          throw new ApiError(
//             400,
//             "At least one field is required"
//          )
//       }

//       // find product and update
//       const product =
//          await Product.findByIdAndUpdate(

//             req.params.id,

//             {
//                $set:{

//                   name,
//                   description,
//                   price,
//                   stock,
//                   category
//                }
//             },

//             {
//                new:true
//             }

//          )

//       // check product exists
//       if(!product){

//          throw new ApiError(
//             404,
//             "Product not found"
//          )
//       }

//       // send response
//       return res.status(200).json(

//          new ApiResponse(
//             200,
//             product,
//             "Product updated successfully"
//          )
//       )

// })
const updateProduct = asyncHandler(async (req, res) => {

    const {
        name,
        description,
        price,
        stock,
        category
    } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (price) updateFields.price = price;
    if (stock) updateFields.stock = stock;
    if (category) updateFields.category = category;

    if (Object.keys(updateFields).length === 0) {

        throw new ApiError(
            400,
            "At least one field is required"
        );
    }

    const product = await Product.findByIdAndUpdate(

        req.params.id,

        {
            $set: updateFields
        },

        {
            returnDocument: "after"
        }
    );

    if (!product) {

        throw new ApiError(
            404,
            "Product not found"
        );
    }

    return res.status(200).json(

        new ApiResponse(
            200,
            product,
            "Product updated successfully"
        )
    );

});

// delete product

const deleteProduct = asyncHandler(
   async(req,res)=>{

      // find product
      const product =
         await Product.findById(
            req.params.id
         )

      // check product exists
      if(!product){

         throw new ApiError(
            404,
            "Product not found"
         )
      }

      // delete product
      await product.deleteOne();

      // send response
      return res.status(200).json(

         new ApiResponse(
            200,
            {},
            "Product deleted successfully"
         )
      )

})

export {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}