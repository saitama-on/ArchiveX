import { asyncHandler } from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import {Project} from "../models/project.model.js"
import jwt from "jsonwebtoken"
import { uploadToCloudinary } from "../utils/cloudinary.js"

//options for cookie
//if httpOnly and secure true , only sever can modify cookie
const options ={
    
    secure:true,
    sameSite:'none'
}


const registerUser = asyncHandler(async (req, res) => {
    // 1. get detials from API call
    // 2. check if fields are non-empty else throw err
    // 3. check for duplicate email or username
    // 4. check for image and avatar
    // 5. upload image to cloudinary
    // 6. create a user object and upload uiser data
    // 7. send details to user without password and reres token

    // 1. get details
    // console.log(req.body)
    const { fullname, email, password , isaFaculty} = req.body
    console.log(email);

    // 2. checking for empty fields
    if (
        [fullname, email, password].some((field) => {
            return field?.trim() === ""
        })

    ) {
        throw new apiError(400, "Enter all fields!!");
    }


    // 3. Check for duplicate emails or username 

    const existingUser = await User.findOne({email})

    if (existingUser) {
        throw new apiError(400, "email or username already taken")
    }

    // console.log(avatarLocalPath)

    const avatarLocalPath = req.files && req.files.avatar && req.files.avatar[0] && req.files.avatar[0].path
    const coverImageLocalPath = req.files && req.files.coverImage && req.files.coverImage[0] && req.files.coverImage[0].path

    console.log(avatarLocalPath)


    // if (!avatarLocalPath) {
    //     throw new apiError(400, "Avatar image not found!!")
    // }

    // //upload on cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    // if (!avatar) {
    //     throw new apiError(400, "Avatar is required Field")
    // }

    // //create new user

    const user = await User.create({
        fullName : fullname,
        email,
        password,
        isaFaculty,
        avatar: avatar?.url || "",
        coverImage: coverImage?.url || "",

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while user regsitration ")
    }


    return res.status(201).json(
        new apiResponse(201, createdUser, "Account Registerd Successfully!!")
    )

    // console.log(req.files)

    return res.status(200).json({
        message:"ok"
    })


    // res.status(200).json({
    //     message:"ok"
    // });

})

const loginUser = asyncHandler(async(req,res)=>{

    //get data from req.body
    //use usernaem or email
    //find user from db
    //check for pass
    //assign access and refresh token to user 
    //send cookies 

    //1
    const { email , password} = req.body
    console.log(req.body)

    if(!( email)){
        throw new apiError(400 , "username or email required")
    }

    //2
    const user = await User.findOne( {email})

    if(!user){
        throw new apiError(400 , "no account with this email or username")
    }

    //4 check for password

    const verifyPass = await user.isPasswordCorrect(password)

    if(!verifyPass){
        throw new apiError(400 , "Incorrect Password!!")
    }

    //generate tokens 
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    //add tokens to user 
    user.refreshToken = refreshToken
    //save token to db 
    user.save({validationBeforeSave :false})

    console.log(user , accessToken , refreshToken)

    //cookie part 




    return res.status(200)
    .cookie("accessToken" ,accessToken ,  options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new apiResponse(200 , {
            user:user
        },
    "User logged in successfully!!"
    ))

})


const logoutUser = asyncHandler(async(req,res)=>{

        User.findByIdAndUpdate(
            req.user._id ,
            {
                $set:{
                    refreshToken:undefined
                }
            }
        )

        return res
        .status(200)
        .clearCookie("accessToken" , options)
        .clearCookie("refreshToken" , options)
        .json(new apiResponse(200 , {} , "User logged out!!"))
})

const refreshAccessToken = asyncHandler(async(req,res) =>{

    const incomingRefreshToken = req.cookies.refreshToken || 
      req.body.refreshToken


    if(!incomingRefreshToken){
        throw new apiError(400 , "Invalid Request")
    }

    // const decodedToken = jwt.verify(incomingRefreshToken
    //     , process.env.REFRESH_TOKEN_SECRET

    // )
    // console.log(incomingRefreshToken)
    // console.log(decodedToken)

    const user = await User.findById(decodedToken._id)

    // console.log(user.refreshToken)

    if(!user){
        throw new apiError(400 , "Invalid refresh token")
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new apiError(400 , "Cannot refresh your\
            token")
    }

    //generate new tokens
    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken

    user.save({validationBeforeSave:false});


    return res
    .status(200)
    .cookie("accessToken" , accessToken)
    .cookie("refreshToken" , refreshToken)
    .json(
        new apiResponse(
            200 , 
            {accessToken , refreshToken}
        ),
        "Tokens refreshed!!"
    )



})

const getAllUsers = asyncHandler(async(req,res)=>{

    try{
        const users = await User.find().select("fullName  _id isaFaculty");
        return res.status(200).json(
            new apiResponse(200 , users , "success")
        );


    }catch(error){
        throw new apiError(400 , "Unable to get all users!")
    }
})


const getUserInfoWithToken = asyncHandler(async(req,res)=>{

    // console.log(req.user)
    const userId = req.user._id;
    // let userData = req.user


    res.status(200).json(
        new apiResponse(200 , req.user , "success")
    );
})

//get public info
const getUserInfo = asyncHandler(async(req,res)=>{

    const userId  = req.query?.userId ? req.query.userId : req.user._id
    console.log("this is usr" ,userId)
    // console.log("userdi si " ,userId)
    try{

        const info  = await User.findById(userId)

        res.status(200).json(new apiResponse(200, info ,"success"))
    }
    catch(error){
        console.log(error)
        throw new apiError(400 , "Can't get Info!")
    }
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    // const {coverImage} = req.body
    console.log(req.body)
    console.log(req.user)
    // console.log(req.file)

    const coverImage_file = req.file;
    const file_name = coverImage_file.filename;

    const file_path = `/coverImages/${file_name}`;
    const updates = {
        'coverImage' : file_path
    }

    try{
    const imageUpload = await User.findByIdAndUpdate(req.user._id , updates , {
        runValidators:true,
        new:true
    });

    res.status(200).json( new apiResponse(200 ,imageUpload , "Success!"))

    }catch(err){
        console.log(err)
        throw new apiError(400 , "Couldn't upload image");
    }

})
export {
        loginUser , 
        registerUser , 
        logoutUser ,
        refreshAccessToken,
        getAllUsers,
        getUserInfo,
        getUserInfoWithToken,
        updateUserCoverImage
    }