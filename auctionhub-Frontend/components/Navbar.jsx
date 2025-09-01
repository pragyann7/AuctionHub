import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { useNavigate, Navigate } from "react-router-dom"
import { Loader } from './Loading';

function Navbar() {
    const { logout, isAuthenticated, logoutLoading } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

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
                <nav className="w-full px-6 py-3 border-b-[0.5px] border-gray-200 flex items-center justify-between">
                    {/* Logo */}
                    <h1 className="text-xl pl-2 font-bold">
                        <a href="/">AuctionHub</a>
                    </h1>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#home" className="hover:text-gray-600 transition-colors">Home</a>
                        <a href="#auction" className="hover:text-gray-600 transition-colors">Auction</a>
                        <a href="#browse" className="hover:text-gray-600 transition-colors">Browse</a>
                        <a href="#mybids" className="hover:text-gray-600 transition-colors">My Bids</a>
                    </div>

                    {/* User Controls */}
                    <div className="hidden md:flex items-center space-x-4">
                        <span className="cursor-pointer" aria-label="Notifications">🔔</span>
                        <span className="cursor-pointer" aria-label="Profile">👤</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-medium"
                        >
                            Log Out
                        </button>
                    </div>

                    {/* Mobile Hamburger */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border-t-[0.5px] border-gray-200 flex flex-col items-center md:hidden py-4 space-y-3 shadow-lg z-50">
                            <a href="#home" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>Home</a>
                            <a href="#auction" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>Auction</a>
                            <a href="#browse" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>Browse</a>
                            <a href="#mybids" className="hover:text-gray-600 transition-colors" onClick={() => setMenuOpen(false)}>My Bids</a>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="cursor-pointer" aria-label="Notifications">🔔</span>
                                <span className="cursor-pointer" aria-label="Profile">👤</span>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMenuOpen(false);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-medium"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
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
