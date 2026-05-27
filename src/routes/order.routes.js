import{Router} from "express"
import {createOrder,
   getMyOrders,
   getSingleOrder,
   cancelOrder,
   updateOrderStatus,
   getAllOrders} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewarre/auth.middleware.js"
import { verifyAdmin } from "../middlewarre/auth.middleware.js"




const router=Router()
router.route("/").post(verifyJWT, createOrder);
router.route("/my-order").get(verifyJWT,getMyOrders);
router.route("/:id").get(verifyJWT,getSingleOrder);
router.route("/:id/cancel").patch(verifyJWT,cancelOrder);
router.route("/:id/status").patch(verifyJWT,  verifyAdmin,updateOrderStatus);
router.route("/admin/all").get(verifyJWT, verifyAdmin,getAllOrders);

export default router

