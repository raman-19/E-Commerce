import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const productSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true
        },
        description:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true
        },
        stock:{
            type:Number,
            required:true,
            min:0
        },
        category:{
            type:String,
            required:true,
            

        },
        images:[
            {
                url:{
                    type:String,
                    required:true
                },
                public_id:{
                    type:String,
                    required:true
                }
            }

        ],
        ratings:{
            type:Number,
            default:0
        }

        
    },
    {
        timestamps:true
    }
)
export const Product = mongoose.model("Product",productSchema)