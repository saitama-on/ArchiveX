import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import InfoModal from '../components/modal';
import ConfirmDelete from '../components/confirmDelete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { GrLike } from "react-icons/gr";
import ProjectCard from '../components/projectCard';
import { API_URL } from '../const';


const Home = () => {
  const [userProjects, setUserProjects] = useState(null);
  const [approvedProjects , setApprovedProjects] = useState(null);
  const [pendingProjects , setPendingProjects] = useState(null);
  const [allUsers , setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pendingApprovalSelected  , setPendingApprovalSelected] = useState(false)
  const navigate = useNavigate();
  const [showDeleteModal , setShowDeleteModal] = useState(false);
  const [deleteProjId , setDeleteProjId] = useState(null);
  const {authUser , setAuthUser,
    isLoggedIn , setIsLoggedIn
  } = useAuth();

  console.log(authUser)

    const findName = (id)=>{
        if(!Array.isArray(allUsers)) return;
        const user = allUsers.find(item => item._id === id);

        if(!user) return;
        else return user.fullName;
        // console.log(theName)
        // return theName.fullName; 
    }
    useEffect(()=>{
      
        const fetchprojs = async()=>{

            try{
            const response = await fetch(`${API_URL}/api/v1/projects/get-user-projects`,{
                method:'GET',
                credentials:'include',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const projs = await response.json()
            // const newprojs = [];
            // for(let i=0 ; i<projs.data.length ; i++){
            //     let curr = projs.data[i];

            //     let instance = allUsers.find(item => item._id === curr.faculty);
            //     curr.faculty = instance.fullName;

            //     for(let j=0 ; j<curr.groupMembers.length ; j++){
            //         let newInst = allUsers.find(item=> item._id === curr.groupMembers[j]);
            //         curr.groupMembers[j] = newInst.fullName
            //     }

            //     newprojs.push(curr);
            // }
            setUserProjects(projs.data);
            const approved = projs.data.filter(proj => proj.isApproved === true);
            const pending = projs.data.filter(proj => proj.isApproved === false);
            setApprovedProjects(approved);
            setPendingProjects(pending);
            // console.log(projs.data)
            }
            catch(err){
                console.log(err);
            }
        }
        fetchprojs();
    },[showModal]);

    useEffect(()=>{
      const fetchUsers = async()=>{
            const response = await fetch(`${API_URL}/api/v1/users/get-all-users`,{
                method:'GET'
            });

            const names = await response.json();
            // console.log(names.data)
            setAllUsers(names.data);
        }
        fetchUsers();
    },[])


    const handleModal = (proj)=>{
        setShowModal(true);
        setSelectedProject(proj)
    }

    const handleLogout = async()=>{
        try{
            const response = await fetch(`${API_URL}/api/v1/users/logout` ,{
                method:'POST',
                credentials:'include',
                headers:{
                    "Content-Type":"application/json"
                }
            });

            setAuthUser(null);
            setIsLoggedIn(false);
            navigate('/');
        }
        catch(err){
            console.log(err);
        }
    }

  return (
    <div className="home-content">
      <nav className="navbar">
        <h1>Project Management System</h1>
        <div className="nav-buttons">
          <button className="manage-students-btn">
            Manage Students
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <button onClick={()=> navigate(`/users/${authUser._id}`)}>Profile</button>
        </div>
      </nav>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <div className="action-card" onClick={()=> navigate("/addProject")}>
            <h3>Add New Project</h3>
            <p>Create and upload a new project</p>
          </div>
          <div className="action-card" onClick={()=> navigate("/search")} >
            <h3>Search Projects</h3>
            <p>Browse and search through all projects</p>
          </div>
          { authUser?.isaFaculty && <div className="action-card" >
            <h3>Approve Projects</h3>
            <p>Check projects that are pending for your approval...</p>
          </div>
          }
        </div>
      </div>

      <div className="projects-section">
        <div className="projects-type-slider">
          <h2 style={{textDecoration:pendingApprovalSelected ? 'none' : 'underline',
            cursor:'pointer' , textDecorationColor:pendingApprovalSelected ? 'none' : '#519fe9ff',
            opacity:pendingApprovalSelected? '0.5' : '1'
          }} 
          onClick={()=>setPendingApprovalSelected(false)}>Your Projects</h2>
          <h2 style={{textDecoration:pendingApprovalSelected ? 'underline' : 'none',
            cursor:'pointer',textDecorationColor:pendingApprovalSelected ? '#519fe9ff' : 'none',
            opacity:pendingApprovalSelected? '1' : '0.5'
          }}
          onClick={()=>setPendingApprovalSelected(true)}>Pending for Approval</h2>
        </div>
        
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : userProjects? (
          <div className="projects-grid">
            {(pendingApprovalSelected ? pendingProjects : approvedProjects).map((project ,key) => (
              <ProjectCard 
              key={key}
              project={project} 
              handleModal={handleModal} 
              findName={findName}
              setShowDeleteModal={setShowDeleteModal}
              setSelectedProject={setSelectedProject}/>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>No projects found.</p>
            <button  className="add-project-btn" >
              Add Your First Project
            </button>
          </div>
        )}
      </div>

      {showModal && selectedProject && (
        <InfoModal
          show={showModal}
          setShow={setShowModal}
          info={selectedProject}
          allUsers = {allUsers}
        />
      )}

      {
        showDeleteModal && 
        <ConfirmDelete setShowDeleteModal={setShowDeleteModal}
         selectedProject={selectedProject}/>
      }
      <ToastContainer position="top-center" />
    </div>
    
  );
};

export default Home; 