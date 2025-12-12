import React from 'react'
import '../styles/search.css'
import { useState, useEffect } from 'react'
import InfoModal from "../components/modal.jsx"
import { useNavigate } from 'react-router-dom';
import {ThreeDot} from 'react-loading-indicators';
import { AiFillLike } from "react-icons/ai";



export default function Search() {
  const [show, setShow] = useState(false);
  const [loading , setLoading] = useState(true);
  const [data, setData] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [faculty, setFaculty] = useState(null)
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const [count , setCount] = useState(0);
  const [projects , setProjects ] = useState(null);
  const [allUsers , setAllUsers] = useState(null);


    const findName = (id)=>{
        if(!Array.isArray(allUsers)) return;
        const user = allUsers.find(item => item._id === id);

        if(!user) return;
        else return user.fullName;
        // console.log(theName)
        // return theName.fullName; 
    }
    useEffect(() => {
    // Check authentication
        const fetchprojs = async()=>{

            try{
            const response = await fetch('http://localhost:8000/api/v1/projects/get-all-projects',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            const projs = await response.json()
            
            setProjects(projs.data);
            setFilteredData(projs.data);
            setCount(projs.data.length)
            setLoading(false);
            }
            catch(err){
                console.log(err);
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

        fetchprojs();
        fetchUsers();
        
        

    }, [show]);

  useEffect(() => {
    let filteredData = projects;

    if (searchQuery) {
      
      filteredData = filteredData.filter((item) => {
        // console.log(findName(item.faculty) , searchQuery)
        // const arr = item.groupMembers.filter(it=> findName(it).includes(searchQuery));
        //group members string 
        let groupstr = item.groupMembers.map((itm)=> findName(itm)).join(',');
        // console.log(groupstr)
        return item['title']?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                findName(item?.faculty).toLowerCase().includes(searchQuery.toLowerCase()) ||
                groupstr?.trim().toLowerCase().includes(searchQuery);
      });
    }

    if (category !== 'ALL') {
      filteredData = filteredData.filter((item) => 
        item['category']?.toLowerCase().includes(category?.toLowerCase())
      );
    }

    if (faculty !== 'ALL') {
      filteredData = filteredData
      ?.filter((item) => 
        findName(item['faculty'])?.toLowerCase().includes(faculty?.toLowerCase())
      );
    }

    setFilteredData(filteredData);
    // console.log(filteredData);
  }, [searchQuery, category, faculty]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCategory('ALL');
    setFaculty('ALL');
  }

  const handleClick = (item) => {
    setShow(true)
    setData(item)
  }

  const handleCategory = (e) => {
    setCategory(e.target.value)
  }


  const navigateToHome = () => {
    navigate('/home');
  };

  const navigateToAddProject = () => {
    navigate('/projects/add');
  };

  return (
    <div className="projects-page">
      <nav className="navbar">
        <h1>All Projects</h1>
        <div className="nav-buttons">
          <button onClick={navigateToHome} className="nav-button">
            Dashboard
          </button>
          
        </div>
      </nav>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search projects by title,faculty,members"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />

        {/* <select value={category} onChange={handleCategory} className="filter-select">
          <option value="ALL">All Categories</option>
          <option value="Web/App Dev">Web/App Development</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Blockchain">Blockchain</option>
          <option value="Hardware/Electronics">Hardware/Electronics</option>
          <option value="Other">Other</option>
        </select> */}

        <select value={faculty} onChange={(e)=>setFaculty(e.target.value)} className="filter-select">
          {allUsers?.map((item , key)=>{
            // console.log(item)
            return item.isaFaculty && <option value={item} key={key}>{item.fullName}</option>
          })}
        </select>

        <button onClick={navigateToAddProject} className="add-project-btn">
          Add Project
        </button>
        <div>Total Projects : {count}</div>
      </div>

      <div className="projects-grid">
        {loading ? (
          <div className="loading-container">
            <ThreeDot color="#007bff" size={30} />
          </div>
        ) : 
          filteredData?.map((item, index) => (
            <div key={index} className="project-card" onClick={() => handleClick(item)}>
              <h3 style={{display:'flex' , alignItems:'center' , justifyContent:'space-between'}}>
                <strong>{item['title']}</strong> 
                <p>{item.likes.length}<AiFillLike/></p>
                </h3>
              <p>Research Area: <strong>{item['researchArea']}</strong></p>
              <p>Faculty: <strong>{findName(item.faculty)}</strong></p>
              <p>Category: <strong>{item['category']}</strong></p>
              <p>Semester: <strong>{item.semester}</strong></p>
              <p>Group Members:<strong>{item.groupMembers.map(student => <span>{findName(student)}, </span>)}</strong></p>
              
            </div>
          ))
        }
      </div>

      {show && (
        <InfoModal
          show={show}
          setShow={setShow}
          info={data}
          allUsers={allUsers}
          
        />
      )}
    </div>
  );
}