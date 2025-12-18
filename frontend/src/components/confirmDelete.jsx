import '../styles/deleteModal.css';  
import { MdClose } from "react-icons/md";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../const.js';




export default function ConfirmDelete({setShowDeleteModal , selectedProject}){
    const [password , setPassword] = useState('');
    const notify_err = (msg) => toast.error(msg);
    const notify_suc = (msg) => toast.success(msg);
    const navigate = useNavigate();
    console.log(selectedProject)

    const handleClose= ()=>{
        setShowDeleteModal(false)
    }

    const handlePassChange = (e)=>{
        setPassword(e.target.value);
    }

    const handleDelete = async() =>{
        if(password.trim() == ''){
            notify_err("Password cant't be empty!");
            return;
        }

        //send a delete request
        console.log('deleting...')
        try{
            
        const response = await fetch(`${API_URL}/api/v1/projects/delete-this-project?id=${selectedProject._id}`,{
            method:'DELETE',
            credentials:'include',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                password:password
            })
        });
        const data = await response.json();
        
        // console.log(response)
        if(!response.ok){
            // console.log(data)
            throw new Error(data.message);
        }
        else{
            notify_suc(data.message);
            setTimeout(()=>{
                setShowDeleteModal(false);
                navigate('/')

            },2500);
        }
        // console.log(data)
    }catch(err){
        notify_err(err.message)
        return;
        // console.log(err.message)
    }

    }
    return (
        <div className="custom-modal-overlay" onClick={handleClose}>
            <div className='custom-modal' onClick={(e)=> e.stopPropagation()}>
                <div className='custom-modal-body'>
                    <div className='close-heading-and-button'>
                        <p>Click on Delete to permanently delete this Project</p>
                        <div id="close-btn-div" onClick={handleClose}>
                             <MdClose size={20}/>
                        </div>
                    </div>  

                    <div className='password-and-delete-div'>
                        
                        <input placeholder='Enter your password '
                        value={password}
                        onChange={handlePassChange}>

                        </input>
                        <button type='button' onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" autoClose={2000} />
        </div>
    )
}