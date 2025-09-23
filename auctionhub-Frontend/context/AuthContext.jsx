import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, []);


    const fetchUserData = async () => {
        try {
            const res = await axiosInstance.get('/users/me/');
            setUser(res.data);
            setIsAuthenticated(true);
            setCurrentUser(res.data);
            // console.log(res.data);
        } catch (error) {
            console.log(error);
            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                clearAuth();
            }
        } finally {
            setLoading(false);
        }
    };
    const clearAuth = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.clear();
    }

    const refreshUser = async () => {
        await fetchUserData();
    };


    const login = async (credentials) => {
        try {
            const res = await axiosInstance.post('/login/', credentials);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            await fetchUserData();
            navigate('/');
        } catch (error) {
            throw error;
        }
    };


    const logout = async () => {
        const confirmed = window.confirm("Do you want to log out?");
        if (!confirmed) return;

        const refresh = localStorage.getItem('refresh');

        setLogoutLoading(true);

        if (!refresh) {
            localStorage.clear();
            navigate('/');
            setLogoutLoading(false);
            return;
        }

        try {
            await axiosInstance.post('logout/', { refresh });
            console.log('Logout Successful');
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error.message);
            }
        } finally {
            clearAuth();
            navigate('/');
            setLogoutLoading(false);

        }
    };
    const updateUserProfile = async () => {
        await fetchUserData();
    }
    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            updateUserProfile,
            currentUser,
            isAuthenticated,
            login,
            logout,
            loading,
            logoutLoading,
            fetchUserData,
            refreshUser,
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}