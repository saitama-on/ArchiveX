import { GrLike } from "react-icons/gr"
import { useState } from "react";
import { AiOutlineMore } from "react-icons/ai";
import '../styles/projectCard.css'
import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";
import { MdClose } from "react-icons/md";



function Options({handleOptions}){

  return(
    <div className='options-main-div'>
      <div className="options-main-div-item" name="delete" onClick={handleOptions}>
        <MdDeleteOutline color='red' size={25}/>
      </div>
      <div className="options-main-div-item" name="edit" onClick={handleOptions}>
        <MdOutlineEdit color='blue' size={25}/>
      </div>
    </div>
  )
}
export default function ProjectCard({project  , handleModal , findName , setShowDeleteModal , setSelectedProject}){
    const [showOptions , setShowOptions] = useState(false);
    
    const handleOptions = (e)=>{
        e.stopPropagation();
        const option = e.currentTarget.getAttribute('name');
        setSelectedProject(project)

        //delete
        if(option == 'delete'){
            //popup modal for delete
            // console.log("del")
            setShowDeleteModal(true) 
        }
        else{
            //poup modal for edit
            alert("working on this!!!")
        }

        
        // alert(e.target.name)
    }
    const handleOptionClick = (e)=>{
        e.stopPropagation();
        setShowOptions(prev =>!prev);
        // alert('hioii')
    }
    return (
        <div 
            key={project._id} 
            className="project-card"
            onClick={()=> handleModal(project)}
            style={{ cursor: 'pointer' }}
            >
            <div className='title-and-delete-div'>
                <h2>{project.title}</h2>
                <p onClick={(e) =>handleOptionClick(e)}>
                    {showOptions ? <MdClose size={30}/> : <AiOutlineMore size={30}/>}
                </p>
                 
            </div>
           {showOptions && <Options handleOptions={handleOptions}/>}
            <p><strong>Research Area:</strong> {project.researchArea}</p>
            <p><strong>Semester:</strong> {project.semester}</p>

            <p><strong>Faculty:</strong> {findName(project.faculty)}</p>
            <p><strong>Group Members:</strong> {project.groupMembers.map(item => findName(item)).join(' ,')}
            </p>
                <div className='report-and-like-div'>
                <a 
                href={project.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="view-file"
                // Prevent modal from opening when clicking the link
                >
                View Report
                </a>
                <div 
                 style={{display:'flex' , justifyContent:'space-between' , alignItems:'center', cursor:'pointer'}}>
                    <GrLike/>
                <p style={{margin:'5px' , fontSize:'1rem'}}>{project.likes ? project.likes.length : 0}</p>
                </div>
                </div>
            
            </div>
    )
}