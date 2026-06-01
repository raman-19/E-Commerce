import{Router} from "express"
import { createPayment,
    getMyPayments,
    getSinglePayment,
    updatePaymentStatus
} from "../controllers/payment.controller.js"
import { verifyJWT } from "../middlewarre/auth.middleware.js"
import { verifyAdmin } from "../middlewarre/auth.middleware.js"




const router=Router()
router.route("/")
.post(verifyJWT, createPayment);

router.route("/my-payments")
.get(verifyJWT, getMyPayments);

router.route("/:id")
.get(verifyJWT, getSinglePayment);

router.route("/:id/status")
.patch(
   verifyJWT,
   verifyAdmin,
   updatePaymentStatus
);

export default router

