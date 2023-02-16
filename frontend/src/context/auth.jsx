import * as localforage from "localforage"
import { createContext, useEffect, useRef } from "react"
import { useState } from "react"
import { useContext } from "react"
import jwt_decode from "jwt-decode";

const AuthContext = createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {

    const context = useProvider();

    return (
        <AuthContext.Provider value={context} >
            {children}
        </AuthContext.Provider>
    )
}

const useProvider = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false)
    const [token, setToken] = useState('');
    const [isLoading, setIsLoading] = useState(true)
    const [isReady, setReady] = useState(false)
    const [isLoggedIn, setLoggedIn] = useState(false)

    const _isMounted = useRef(true)


    const defineUser = (user) => {
        return new Promise((res) => {
            setIsAuthenticated(true)
            setUserId(user.userId)
            setToken(user.token)
            if (user.role === 'admin') setIsAdmin(true);
            setLoggedIn(true)
            setReady(true)
            res(true)
        })

    }

    const login = async (user) => {
        await localforage.setItem('user', user)
        defineUser(user);
    }


    const logout = async () => {
        await localforage.removeItem('user')
        setUserId(null);
        setToken('');
        setIsAuthenticated(null);
        setIsAdmin(false)
        setLoggedIn(false)
        setReady(true)
    }

    useEffect(() => {
        if (_isMounted) {
            (
                async () => {   
                    setReady(false)
                    setIsLoading(true)
                    const user = await localforage.getItem('user')
                    if (user && user.token) {
                        const { exp } = jwt_decode(user.token)
                        const expirationTime = (exp*1000) - 60000
                        if (Date.now() > expirationTime) return await logout()
                        const authenticated = await defineUser(user)
                        setIsLoading(false)
                    } else {
                        return await logout()
                    }
                }
            )()
            setIsLoading(false)
        }

        return () => {
            _isMounted.current = false;
        } 
    }, [isAuthenticated])

    return {
        userId,
        isAuthenticated,
        isAdmin,
        token,
        isLoading,
        isReady,
        login,
        logout,
        isLoggedIn
    }
}

