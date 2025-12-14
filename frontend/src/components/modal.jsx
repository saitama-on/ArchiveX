import { useState, useEffect } from 'react';
import '../styles/modal.css';  
import { ThreeDot } from 'react-loading-indicators';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { GrLike } from 'react-icons/gr';
import { AiFillLike } from "react-icons/ai";
import { useAuth } from '../context/AuthContext';


function InfoModal({ show, setShow, info , allUsers}) {
 
  const [liked , setLiked] = useState(false);
  const navigate = useNavigate();
  const {authUser}  = useAuth();
  // console.log(info)


  const findName = (id)=>{
        if(!Array.isArray(allUsers)) return;
        const user = allUsers.find(item => item._id === id);

        if(!user) return;
        else return user.fullName;
        // console.log(theName)
        // return theName.fullName; 
  }

  const notify_err = (msg) => toast.error(msg);
  const notify_succ = (msg) => toast.success(msg);

  useEffect(()=>{
    // console.log(info);
    // console.log(authUser)
    if(info?.likes?.find(item => item == authUser._id)){
      // console.log('hel;')
      setLiked(true);
    }
    else{
      setLiked(false)
    }
  },[])
  const handleClose = () => {
    setShow(false);
  };
   

  
  const handleMemberClick = (member, e) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Prevent modal from closing
    setShow(false); // Close the modal
    const encodedUsername = encodeURIComponent(member.trim());
    navigate(`/users/${member}`);
    console.log("done") // Navigate to member's profile
  };

  const handleLike = async()=>{
    //send a post request to like 
    const updateLikeFetch = async(del)=>{

      try{
        const response = await fetch(`http://localhost:8000/api/v1/projects/update-like?projectId=${info._id}`,{
          method:'POST',
          credentials:'include',
          headers:{
            'Content-Type':'application/json'
          }
          ,
          body : JSON.stringify({
            del  : del
          })
        });

        const data = await response.json();
        if(response.status == 200){
          return data;
        }
      }catch(err){
        console.log(err)
      }
    }
    if(liked){
      const updatedLike = await updateLikeFetch(true);
      console.log(updatedLike)
      if(updatedLike.success == true){
        setLiked(false);
      }

    }
    else{
      const updatedLike = await updateLikeFetch(false);
      if(updatedLike.success ==true){
        setLiked(true);
      }
    }
  }


  return (
    <>
      <div className="custom-modal-overlay" onClick={handleClose}>
        <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
          <div className="custom-modal-header">
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
          </div>
          
          {info===null ? (
            <div className="loading-container">
              <ThreeDot color="#316dcc" size="medium" text="" textColor="" />
            </div>
          ) : (
          <div className="custom-modal-body">
            <div className='left-modal-body'>
              <div className="inside-modal-div">
                <span className="span-text">Title of Project:</span>
                <span >{info['title']}</span>
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Area of Research:</span>
                <span >{info['researchArea']}</span> 
              </div>
              <div className="inside-modal-div">
                <span className="span-text" >Faculty:</span>
                <span className='member-link' onClick={()=> {
                  navigate(`/users/${info.faculty}`)
                  setShow(false)
                  }}><span className='span-value'>{findName(info['faculty'])}</span></span>
              </div>
              <div className="inside-modal-div">
                <span className="span-text">Description:</span>
                <span >{info.description}</span>
              </div>
              {info['category'] && (
                <div className="inside-modal-div">
                  <span className="span-text">Category:</span>
                  {info['category']}
                </div>
              )}
              
              {info.yearOfSubmisson && <div className="inside-modal-div">
                  <span className="span-text">Year of Submission:</span>
                  <span>{info['yearOfSubmisson']}</span>
              </div>
              }
              
              <div className="inside-modal-div">
                <span className="span-text">Group Members:</span>
                <div className="members-list">
                  {info['groupMembers'].map((member, idx) => (
                    <span key={idx}>
                      <span 
                        className="member-link"
                        onClick={(e) => handleMemberClick(member, e)}
                      >
                        <span className='span-value'>{findName(member)}</span>
                      </span>
                      {idx < info['groupMembers'].length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{display:'flex' , alignItems:'center'}}>
                <p style={{marginRight:'10px'}}>Like this project</p>
                <div onClick={handleLike} style={{cursor:'pointer'}} className='like-div'>
                {liked ? <AiFillLike color='#519fe9ff' size={30}/> : <AiFillLike color='grey' size={30}/>}
                </div>
                </div>
            </div>
              <div className='right-modal-body'>
              
              {info.projLink ? (
                <div className='main-preview-div'>
                  <span className="span-text">Report</span>
                  <a href={`http://localhost:8000/${info.projLink}`} target="_blank" rel="noopener noreferrer">View Report</a>
                  <div className='preview-report-div'>
                    <iframe
                    src={`http://localhost:8000/${info.projLink}`}
                    title=" Preview"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    >

                    </iframe>
                    </div>
                </div>
                
                
              ) : <div className="no-report-div">No report uploaded!</div>
            }
            </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

export default InfoModal;