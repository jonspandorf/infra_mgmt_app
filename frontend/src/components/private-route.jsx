import { CircularProgress } from "@mui/material"
import { useEffect } from "react"
import { Navigate, Route } from "react-router"
import { useAuth } from "../context/auth"

const PrivateRoute = ({ children }) => {

    const { isAuthenticated, isReady, isLoading } = useAuth()



    if (isLoading)  return <><CircularProgress /></>
    if (isReady) return isAuthenticated ? children : <Navigate to='/login' /> 
    
    
}

export default PrivateRoute
