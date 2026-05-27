import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    orderItems: [

        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],



    shippingAddress: {

        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        postalCode: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true
        }
    },



    totalPrice: {
        type: Number,
        required: true
    },



    orderStatus: {

        type: String,

        enum: [
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ],

        default: "Processing"
    },



    paymentStatus: {

        type: String,

        enum: [
            "Pending",
            "Paid",
            "Failed"
        ],

        default: "Pending"
    }

},
{
    timestamps: true
});



export const Order =
mongoose.model("Order", orderSchema);