import{Router} from "express"
import {addToCart, getUserCart, removeFromCart, updateCartQuantity} from "../controllers/cart.controller.js"
import { verifyJWT } from "../middlewarre/auth.middleware.js"




const router=Router()
router.route("/add").post(verifyJWT, addToCart);
router.route("/").get(verifyJWT, getUserCart);
router.route("/:productId").delete(verifyJWT,removeFromCart);
router.route("/:productId").patch(verifyJWT,updateCartQuantity)

export default router
