import { asyncHandler } from "../utils/asyncHandler.js"
import { Project } from "../models/project.model.js"
import { apiResponse } from "../utils/apiResponse.js"
import apiError from "../utils/apiError.js"




const createNewProject = asyncHandler(async(req,res)=>{
    console.log(req.body , req.file)
    const {title
         , faculty
           , description , semester , researchArea} = req.body

        
    if(!req.file){
        throw new apiError(400 , "No file uploaded");
    }
    const groupMembers = JSON.parse(req.body.groupMembers)
    const fileName = req.file.filename;
    let projLink = `/reports/${fileName}`;
    // console.log(groupMembers)
    groupMembers.push(req.user._id);
    const likes=[]
    // create new proj
    try{
        const newProj = await Project.create({
            title,
            faculty,
            groupMembers,
            description,
            semester,
            researchArea,
            projLink,
            likes

        })

        //update new project in all users projects
        const projId = newProj._id;
        
        return res.status(200).json(
            new apiResponse(200 , newProj , "Success")
        )
    }
    catch(err){
        console.log(err)
        throw new apiError(400 , "Project Upload Failed!!")
    }
})

const getAllProjects = asyncHandler(async(req,res)=>{
    // const userId = req.body.user._id

    try{
        const projects = await Project.find();
        // console.log(projects)
        return res.status(200).json(new apiResponse(200 , projects , "Success!"))
    }
    catch(err){
        // console.log(err)
        throw new apiError(400 , "Can't find Projects!")
    }
})

const getCurrentUserProjects = asyncHandler(async(req,res)=>{
    const user = req.user
    console.log(req.user._id)

    //find user projects
    try{
        const userProjects = await Project.find({
            $or: [ {groupMembers:user._id.toString()} , {faculty:user._id.toString()} ]
        });

        return res.status(200).json(new apiResponse (200 ,userProjects , "Suceess"))

    }
    catch(err){
        throw new apiError(400 , err);
    }
})

const getOtherUserProjects = asyncHandler(async(req,res)=>{
    const userId = req.query.userId
    console.log(req.query)

    //find user projects
    try{
        const userProjects = await Project.find({
            $or: [{groupMembers:userId} , {faculty:userId}]});
        return res.status(200).json(new apiResponse (200 ,userProjects , "Suceess"))

    }
    catch(err){
        throw new apiError(400 , err);
    }
})

const updateLike = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    // console.log(userId)
    const projectId = req.query?.projectId;
    const {del} = req.body
    const updateOperator = del === true ? '$pull' : '$addToSet';
    const updatePayload = {
        [updateOperator]: { likes: userId }
    };
    try{
        const updateProjectLike = await Project.findByIdAndUpdate(projectId ,
            updatePayload, { new:true , runValidators:true});
        console.log(updateProjectLike)
        res.status(200).json({success:true})
    }catch(err){
        console.log(err)
        throw new apiError(400 , "Couldn't update like!")
    }
})

export {
    createNewProject,
    getAllProjects,
    getCurrentUserProjects,
    getOtherUserProjects,
    updateLike
}