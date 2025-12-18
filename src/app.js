import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()
//used for cross origin policy of browsers

//origin for allowed origin 
//credentials are used for allowing to send credentials via http
app.use(cors({
    origin : ["https://archivex-frontend.onrender.com/" ,"http://localhost:5173"],
    credentials : true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
})) 
//allow json
app.use(express.json()) //can have many options like {limit :"16kb"}

//using url encoder 
//extended is used to allow sending objects of objects 
// option like {limit : "16kb"} can also be used 
app.use(express.urlencoded({
    extended  :true
}))
//creating a static file folder to store public assets
app.use(express.static("public"))
//initializing cookie-parser
app.use(cookieParser())



//routing
import userRouter from "./routes/user.routes.js"
import testRouter from "./routes/project.routes.js"
app.use("/api/v1/users" , userRouter)
app.use("/api/v1/projects" , testRouter)




export default app;