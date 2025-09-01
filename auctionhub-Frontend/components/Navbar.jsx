import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext';
import { useNavigate, Navigate } from "react-router-dom"
import { Loader } from './Loading';

function Navbar() {
    const { logout, isAuthenticated, logoutLoading } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/signin');
    }
    const handleSignup = () => {
        navigate('/signup');
    }

    if (logoutLoading) return <Loader text={"Logging out..."} />;

    return (
        <div>
            {isAuthenticated ? (
                <nav className="px-6 py-2 border-b-[0.5px] border-gray-200 flex items-center justify-between">

                    <h1 className="text-xl pl-7 font-bold"><a href="/">AuctionHub</a></h1>


                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="font-medium cursor-pointer">Log Out</button>
                    </div>
                </nav>
            ) : (
                <nav className="px-6 py-2 border-b-[0.5px] border-gray-200 flex items-center justify-between">

                    <h1 className="text-xl pl-7 font-bold"><a href="/">AuctionHub</a></h1>


                    <div className="flex items-center gap-4">
                        <button onClick={handleLogin} className="font-medium cursor-pointer">Log In</button>
                        <div className="w-px h-6 bg-gray-400"></div>
                        <button onClick={handleSignup} className="bg-blue-500 text-white text-[14px] font-bold px-4 py-2 rounded-full cursor-pointer">
                            SignUp
                        </button>
                    </div>
                </nav>
            )}
        </div>
    )
}

export default Navbar
