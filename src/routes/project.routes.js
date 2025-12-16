import {Router} from "express"
import { getAllProjects , updateLike, 
    createNewProject,getOtherUserProjects, 
    getCurrentUserProjects , deleteProject} from "../controllers/project.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { pdfUpload } from "../middlewares/multer.middleware.js"


const router = Router()
router.route("/get-all-projects" ).get( getAllProjects);
router.route("/get-user-projects").get(verifyJWT , getCurrentUserProjects)
router.route("/create-new-project").post(verifyJWT , pdfUpload.single('projFile')  ,createNewProject)
router.route("/get-other-user-projects").get(getOtherUserProjects);
router.route("/update-like").post(verifyJWT , updateLike);
router.route("/delete-this-project").delete(verifyJWT , deleteProject );
// console.log("okkk")


export default router