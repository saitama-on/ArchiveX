import {useContext ,useState , useEffect , createContext} from 'react'



const AuthContext = createContext();

export const useAuth =()=>{
    return useContext(AuthContext);
}
export const AuthProvider = (props)=>{


    const [authUser , setAuthUser] = useState(null);
    const [isLoggedIn , setIsLoggedIn] = useState(false);

    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    }


    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}
