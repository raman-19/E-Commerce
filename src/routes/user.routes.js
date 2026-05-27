import{Router} from "express"
import { loginUser, registerUser,logoutUser, refreshAccessToken, changeCurrentPassword,getCurrentUserdetails, updateAccountDetails } from "../controllers/User.controller.js"
import { verifyJWT } from "../middlewarre/auth.middleware.js"



const router=Router()

router.route("/register").post( registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(verifyJWT,changeCurrentPassword)
router.route("/user").get(verifyJWT,getCurrentUserdetails)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)

export default router
