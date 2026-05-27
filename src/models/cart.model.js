import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items:{
   type:[
      {
         product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
         },

         quantity:{
            type:Number,
            default:1
         }
      }
   ],

   default:[]
}

    

},
{
    timestamps: true
});

export const Cart =
mongoose.model("Cart", cartSchema);