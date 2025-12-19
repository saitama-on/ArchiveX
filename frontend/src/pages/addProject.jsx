import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import '../styles/addProject.css';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../const.js';

const AddProject = () => {
  const {authUser
  } = useAuth();
  const [allUsers, setAllUsers] = useState(null);
  const [filePreviewUrl , setFilePreviewUrl] = useState(null);
  const [searchTerm , setSearchTerm] = useState(null);
  const [selectedStudents , setSelectedStudents] = useState(null);
  const [filteredStudents , setFilteredStudents] = useState(null);
  const [formData , setFormData] = useState({
    title:"",
    faculty:"",
    groupMembers:[],
    semester:"2",
    description:"",
    researchArea:"",
    projFile:""

  })
  const [showSearch , setShowSearch] = useState(true);
  const [facultyArray , setFacultyArray] = useState([]);
  const navigate = useNavigate();
  const notify_err = (msg) => toast.error(msg);
  const notify_suc = (msg) => toast.success(msg);
  console.log(authUser)

  useEffect(() => {
    
  const fetchUsers = async()=>{
        const response = await fetch(`${API_URL}/api/v1/users/get-all-users`,{
            method:'GET'
        });

        const names = await response.json();
        // console.log(names.data)
        console.log(names.data);
        
        setAllUsers(names.data);
        setFacultyArray(names.data.filter(item => item.isaFaculty));
    }
    fetchUsers();
    // fetchFacultyData();
  }, []);

  useEffect(()=>{
    setFormData(prev =>{
      return {...prev ,
        'faculty' : facultyArray.length > 0 ? facultyArray[0]._id : ""
      }
    })
  },[allUsers])


  useEffect(() => {
    if (searchTerm) {
      const filtered = allUsers.filter(student => 
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && !student.isaFaculty
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [searchTerm]);

  const handleAddMember = () => {
    setShowSearch(true);
    setSearchTerm('');
  };

  const handleRemoveMember = (index) => {
    // Prevent removing the first member (current user)
    if (index === 0) return;
    const updatedMembers = groupMembers.filter((_, i) => i !== index);
    setGroupMembers(updatedMembers);
  };

  const handleMemberChange = (student) => {
    // if (index === 0) return;
    setFormData(prev=>{
    
      return {...prev ,
        groupMembers:[...prev.groupMembers , student._id]
      }
    })
    setSearchTerm('');
    setShowSearch(false);
    setSelectedStudents(prev=>{
      return [...(prev || [] ),  student ]
    })
    
  };

  const handleRemoveSelectedStudent = (student) => {
    setSelectedStudents(selectedStudents.filter(item => item !== student));
    setFormData(prev=> {
      return {...prev , 
        groupMembers : prev.groupMembers.filter(item => item!= student._id)
      }
    })
    // setGroupMembers(groupMembers.filter(member => member !== studentName));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    // toast.info("uplaoduing")
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      // setFile(uploadedFile);
      const temp_url = URL.createObjectURL(uploadedFile);
      setFormData(prev =>{
        return {...prev , 
          'projFile': uploadedFile
        }
      })
      setFilePreviewUrl(temp_url)
      // setError('');
    } else {
      // setError('Please upload a PDF file');
      // setFile(null);
    }
  };

  const handleChange = (e)=>{
    // console.log(e.target);
    setFormData(prev =>{

      const key = e.target.name;
      const val = e.target.value;
      return {...prev , 
        [key]:val

      }
    })
  }

  const handleSubmit = () => {
    // if(!form)
    console.log(formData);
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("faculty", formData.faculty);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("semester", formData.semester);
    formDataToSend.append("researchArea", formData.researchArea);
    formDataToSend.append("groupMembers", JSON.stringify(formData.groupMembers)); 
    formDataToSend.append("projFile", formData.projFile); // FILE OBJECT


    const sendData = async()=>{
      try {

        const response = await fetch(`${API_URL}/api/v1/projects/create-new-project`,{
          method:'POST',
          credentials:'include',
          body:formDataToSend
        });

        const data = await response.json();
        if(data.status == 400){
          // alert('upload failed');
          notify_err(data.message);
        }
        else{
          notify_suc("Sent for approval!!");
          setTimeout(()=>{
            navigate('/home')
          },2000)
          
        }
      } catch(error){
        console.log(error);
      }
    }
    sendData();
  };

  return (
    <div className="add-project-page">
      <nav className="navbar">
        <h1>Add New Project</h1>
        <div className="nav-buttons">
          <button onClick={() => navigate('/search')} className="nav-button">
            Back to Projects
          </button>
          <button onClick={() => navigate('/home')} className="nav-button">
            Dashboard
          </button>
        </div>
      </nav>

      <div class="main-div">

        <div className="add-project-form">
        <div className="form-group">
          <label>Project Title*</label>
          <input
            type="text"
            value={formData.title}
            name="title"
            onChange={(e) => handleChange(e)}
            placeholder="Enter project title"
          />
        </div>

        <div className="form-group">
          <label>Research Area*</label>
          <input
            type="text"
            name="researchArea"
            value={formData.researchArea}
            onChange={(e) => handleChange(e)}
            placeholder="Enter research area"
            required
          />
        </div>

        <div className="form-group">
          <label>Description*</label>
          <textarea
            type='input'
            style={{width:"100%"}}
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e)}
            placeholder="Enter a short Description"
            required
          />
        </div>

        <div className="form-group">
          <label>Faculty*</label>
          <select value={formData?.faculty}  name="faculty" onChange={(e) => handleChange(e)} required>
            {/* <option value="">Select Faculty</option> */}
            {allUsers?.map((user , key) => (
              
              user.isaFaculty && <option value={user._id} key={key}>{user.fullName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Semester</label>
          <select value={formData?.semester} onChange={(e)=> handleChange(e)} name="semester" required>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          </select>
        </div>

        {/* <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Other">Other</option>
            <option value="Web/App Dev">Web/App Development</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Hardware/Electronics">Hardware/Electronics</option>
            <option value="Math/Physics">Math/Physics</option>
          </select>
        </div> */}

         <div className="form-group">
          <label>Group Members*</label>
          <div className="selected-members">
            {selectedStudents?.map((student, index) => (
              <div key={index} className="member-item">
                <span>{student.fullName}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSelectedStudent(student)}
                  className="remove-member"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {showSearch ? (
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search student..."
                className="search-input"
              />
              {filteredStudents?.length > 0 && (
                <div className="search-results">
                  {filteredStudents.map((student) => student.id!=authUser._id && (
                    <div
                      key={student.id}
                      className="search-result-item"
                      onClick={() => handleMemberChange(student)}
                    >
                      {student.fullName}
                    </div>
                  ))}
                </div>
              )}
              <button 
                type="button" 
                onClick={() => setShowSearch(false)} 
                className="cancel-search"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleAddMember} className="add-member">
              Add Member
            </button>
          )}
        </div>

        

        {/* {error && <div className="error-message">{error}</div>} */}

        <button type="button" className="submit-button" onClick={handleSubmit}>
          {/* {loading ? 'Adding Project...' : 'Add Project'} */}
          Send for Approval
        </button>
        </div>
      <div class="file-preview">
          <div className="form-group">
          <label>Project Report (PDF)*</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => handleFileChange(e)}
          
          />
          
          {filePreviewUrl ? (
            <div class="main-preview-div">
            <iframe
              src={filePreviewUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            ></iframe>
            </div>
          ) : (
            <div className="preview-placeholder">
              <p>Upload a PDF file to see the preview here.</p>
            </div>
          )}
        </div>
      </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AddProject; 