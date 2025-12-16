import React, { useState, useEffect } from 'react';
import '../styles/UserProfile.css';
import { Link, useAsyncError, useNavigate, useParams } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import InfoModal from '../components/modal.jsx'
import { useAuth } from '../context/AuthContext.jsx';
import ProjectCard from '../components/projectCard.jsx';
import ConfirmDelete from '../components/confirmDelete.jsx';

function ImageModal({setImageModal}){


    const [imageFile ,setImageFile] = useState(null);
    const handleImage = (e)=>{
        console.log(e.target.files);
        setImageFile(e.target.files[0]);
    }

    const handleImageSave = async()=>{
        if(imageFile == null){
            alert('Choose an Image')
            return;
        }

        const formData = new FormData();
        formData.append('coverImage' , imageFile);

        try{
            const response = await fetch('http://localhost:8000/api/v1/users/update-user-coverImage',{
                method:'POST',
                credentials:'include',
                body:formData
            });

            const data = await response.json();
            if(data.status == 200){
                alert('success');
            }
            setImageModal(false);
        }catch(err){
            console.log(err);
        }
    }
    return (
        <div className='custom-modal-overlay' onClick={()=>setImageModal(false)}>
            <div className='custom-modal' onClick={(e)=> e.stopPropagation()}>
                <div className='custom-modal-header'>
                    <button onClick={handleImageSave}>Save</button>
                    <button onClick={()=>setImageModal(false)}>Cancel</button>
                </div>
                <div className='custom-modal-body' style={{height:'500px'}}>
                    <input  type='file' hidden onChange={(e)=>handleImage(e)}></input>
                </div>
            </div>
        </div>
    )
}

function UserProfile() {
    const [userProfile, setUserProfile] = useState(null);
    const [selectedProject , setSelectedProject]  = useState(null);
    const [allUsers , setAllUsers]= useState(null);
    const [show , setShow] = useState(false);
    const [info  , setInfo] = useState([]);
    const [userProjects , setUserProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageModal , setImageModal] = useState(false);
    const navigate = useNavigate();
    const {authUser} = useAuth();
    const {userId} = useParams();
    const [showDeleteModal , setShowDeleteModal] = useState(false);

    // console.log(userId)


    const findName = (id)=>{
        if(!Array.isArray(allUsers)) return;
        const user = allUsers.find(item => item._id === id);

        if(!user) return;
        else return user.fullName;
        // console.log(theName)
        // return theName.fullName; 
    }
    useEffect(() => {
        // console.log(userId)
        const fetchProjs = async()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/v1/projects/get-other-user-projects?userId=${userId}` , {
                    method:'GET',
                    headers:{
                        "Content-Type":"application-json"
                    }
                });

                const projs = await response.json();
                setUserProjects(projs.data);
                console.log(projs)
                setLoading(false)
            }
            catch(err){
                setUserProjects(null);
                console.log("err fetching projects");
            }
        }
        const fetchUsers = async()=>{
            const response = await fetch('http://localhost:8000/api/v1/users/get-all-users',{
                method:'GET'
            });

            const names = await response.json();
            // console.log(names.data)
            setAllUsers(names.data);
        }
        const fetchProfile = async()=>{
            try{
                const response = await fetch(`http://localhost:8000/api/v1/users/get-user-info?userId=${userId}`,{
                    method:'GET',
                    credentials:'include',
                    headers:{
                        "Content-Type" :"application-json"
                    }
                });
                const data = await response.json();
                const info = data.data;
                console.log(info)
                setUserProfile(info);


            }catch(err){
                setUserProfile(null);
                console.log(err);
            }
        }

        fetchProjs();
        fetchUsers();
        fetchProfile();
        console.log(authUser?._id , userProfile?._id)
    }, [userId , show]);

    const handleProjClick = (item) =>{
        setShow(true);
        setInfo(item);
    }

    const handleImageChange = ()=>{

        //show image upload modal
        setImageModal(true);
    }

    if (loading) {
        return (
            <div className="loading-container">
                <ThreeDot color="#316dcc" size="medium" text="" textColor="" />
            </div>
        );
    }


    return (
        <div className="profiles-container">
            <nav className="navbar">
                
                <div className="nav-buttons">
                    <button onClick={() => navigate('/home')} className="nav-button">
                        Dashboard
                    </button>
                </div>
            </nav>
            
            <div className="profile-content">
                <div className="profile-header-main">
                    <div className="profile-avatar-div">
                        <div className='profile-avatar-large'>
                            <img src={`http://localhost:8000/${userProfile?.coverImage}`|| null}></img>
                        </div>
                        
                        {authUser?._id == userProfile?._id &&  <button onClick={handleImageChange}>edit image</button>} 
                    </div>
                    <div className="profile-info" style={{width:'50%' ,display:'flex' , flexDirection:'column'}}>
                        <h2>{userProfile?.fullName}</h2>
                        <h4>{userProfile?.email}</h4>
                        <p>{userProjects?.length} Project{userProjects?.length !== 1 ? 's' : ''}</p>
                    </div>
                    
                </div>

                <div className="projects-section">
                    <h3>Projects</h3>
                    <div className="projects-grid">
                        {userProjects?.map((project, index) => (
                            <ProjectCard project={project} 
                            handleModal={handleProjClick}
                             findName={findName} 
                             setSelectedProject={setSelectedProject}
                             setShowDeleteModal={setShowDeleteModal}/>
                        ))}
                    </div>
                </div>
            </div>
            {show && (
                <InfoModal
                show={show}
                setShow={setShow}
                info={info}
                allUsers={allUsers}
                />
             )}

            {
                showDeleteModal && 
                <ConfirmDelete setShowDeleteModal={setShowDeleteModal}
                selectedProject={selectedProject}/>
            }

             {imageModal && <ImageModal setImageModal={setImageModal}/>}
        </div>
    );
}

export default UserProfile; 