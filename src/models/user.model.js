import {mongoose , Schema} from "mongoose";
import jwt from "jsonwebtoken"


const UserSchema = new Schema(
    {
        fullName: {
            type:String,
            required:true,
            trim:true,
            index:true
        }
        ,
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            
        },
        isaFaculty:{
            type:Boolean,
            required:true
        },

        avatar :{
            type:String,

        },

        coverImage:{
            type:String
        },

        projects :[
            {
                type: Schema.Types.ObjectId,
                ref : "Project"
            }
        ],

        password :{
            type:String,
            required:[true , 'Password is required!!']
        },

        refreshToken:{
            type:String
        }


    },{timestamps:true}

);


//pre is a mongoose hook that helps to modify any data just before saving into db
//encrypt password
// UserSchema.pre("save" , async function (next){
//     if(!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password , 20);
//     next()
// })


// if you want to use encrypted password which 
// should be ideally be used then enable this
UserSchema.methods.isPasswordCorrect = async function(password){
    // return await bcrypt.compare(password, this.password)
    console.log(password , this.password)
    return password === this.password
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this.id,
            email:this.email,
            username:this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this.id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User' , UserSchema)