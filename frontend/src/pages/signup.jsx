import React, { useState , useEffect} from "react";
import "../styles/login.css"; // Optional: Add your own styles
import IceBear from "../assets/iceBear1.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../const.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {authUser , setAuthUser , 
    isLoggedIn , setIsLoggedIn
  } = useAuth();

  // Redirect if already logged in
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate('/home');
  //   }
  // }, [isLoggedIn]);

  useEffect(()=>{
    if(authUser){
      navigate('/home')
    }
  })


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // if(!email.includes('@iiitnr.edu.in')){
    //   setError("Please use your IIITNR email address.");
    //   return;
    // }

    try {
      const userCredential = await fetch(`${API_URL}/api/v1/users/login`,{
        method:'POST',
        credentials:'include',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            email,
            password
        })
      }
      );
      const user = await userCredential.json();
      // console.log(user)
      setAuthUser(user.data.user)
      
      // localStorage.setItem("User_accessToken" , user.accessToken );
      setIsLoggedIn(true);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
      // setAuthUser(null);
      setIsLoggedIn(false);
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img src={IceBear} alt="Login" />
        </div>
        <div className="login-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          {error && <div className="error-message">{error}</div>}
          <p>
            Already have an account? <a href="/login">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;