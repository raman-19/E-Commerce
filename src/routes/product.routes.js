import{Router} from "express"
import { createProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct } from "../controllers/product.controller.js"
import { verifyJWT } from "../middlewarre/auth.middleware.js"
import {upload} from "../middlewarre/multer.middleware.js"



const router=Router()

router.route("/").post(upload.single("image"), createProduct)
router.route("/").get(getAllProducts)
router.route("/:id").get(getSingleProduct)
router.route("/:id").patch(verifyJWT,updateProduct)
router.route("/:id").delete(verifyJWT,deleteProduct)

export default router
