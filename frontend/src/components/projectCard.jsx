import { GrLike } from "react-icons/gr"
import { AiOutlineMore } from "react-icons/ai";
import '../styles/projectCard.css'

export default function ProjectCard({project  , handleModal , findName}){

    const handleOptionClick = (e)=>{
        e.stopPropagation();
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
                <p onClick={(e) =>handleOptionClick(e)}><AiOutlineMore size={30}/></p>
            </div>
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