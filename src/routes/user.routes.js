import {Router} from "express"
import {registerUser, 
    updateUserCoverImage,
    getUserInfo,loginUser, logoutUser, refreshAccessToken, getAllUsers, getUserInfoWithToken } from "../controllers/user.controller.js"
import {imageUpload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

// router.route('/register').post(upload.fields([
//     {
//         name:"avatar",
//         maxCount:1
//     }
//     ,
//     {
//         name:"coverImage",
//         maxCount:1
//     }
// ]),registerUser)


router.route('/login').post(loginUser)
router.route('/register').post(registerUser);
router.route('/get-all-users').get(getAllUsers)


//secured routes
router.route('/update-user-coverImage').post(verifyJWT , imageUpload.single('coverImage'),updateUserCoverImage)
router.route('/get-user-info').get(verifyJWT , getUserInfo)
router.route('/logout').post(verifyJWT , logoutUser)
router.route('/verifyUser').get(verifyJWT , getUserInfoWithToken)
router.route('/refreshyourtokens')
.post(refreshAccessToken)

export default router