import { Routes, Route, Link } from "react-router-dom"
import Login from "./pages/login.jsx"
import Home from "./pages/home.jsx"
import {useAuth} from './context/AuthContext.jsx'
import {useEffect} from "react";
import { useNavigate } from "react-router-dom"
import UserProfile from "./pages/profile.jsx";
import Search from "./pages/search.jsx";
import AddProject from "./pages/addProject.jsx"

function App() {

  const {authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn} = useAuth();

  const navigate = useNavigate();

  useEffect(()=>{
    const verifyUser = async()=>{
      const response = await fetch('http://localhost:8000/api/v1/users/verifyUser',{
        method:'GET',
        credentials:'include'
      });

      if(response.status == 200){
        // setIsLoggedIn(true);
        const data = await response.json();
        // console.log(data);
        setAuthUser(data.data);
        // navigate("/home")
        // navigate('/');
        // setAuthUser();
        // setIsLoggedIn(false);
      }
      else{
        setAuthUser(null);
        navigate('/login')
      }
    }

    verifyUser();
  },[])

  


  return (
    <>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/users/:userId" element={<UserProfile/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/addProject" element={<AddProject/>}/>
      </Routes>
    </>
  )
}

export default App
