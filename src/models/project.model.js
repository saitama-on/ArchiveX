import {mongoose , Schema} from 'mongoose'

const ProjectSchema = new Schema (
    {
        title : {
            type:String,
            unique:true,
            required:true,
            trim:true
        },

        faculty :{
            type: Schema.Types.ObjectId,
            ref : 'User'
        },
        researchArea:{
            type:String,
            required:true
        }

        ,

        groupMembers:[
            {
                type: Schema.Types.ObjectId,
                ref : 'User'
            }
            
        ],

        description:{
            type: String,
            required:true,
            trim:true
        },

        semester:{
            type:String,
            required:true
        },

        report:{
            type:String,
        },

        projLink:{
            type:String
        }
        ,
        likes:[
            {
                type: Schema.Types.ObjectId,
                ref:'User'
            }
        ]
        
        
        
    
    } ,{timestamps:true}
)


export const Project = mongoose.model('project' , ProjectSchema);