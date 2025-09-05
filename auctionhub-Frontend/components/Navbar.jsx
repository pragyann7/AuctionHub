import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Loader } from './Loading';
import { Bell, User, ChevronDown } from 'lucide-react';

function Navbar() {
    const { logout, isAuthenticated, logoutLoading } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setDropdownOpen(false);
    };

    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/signin');
    };
    const handleSignup = () => {
        navigate('/signup');
    };
    const handleProfile = () => {
        setDropdownOpen(false);
        navigate("/userprofile");
    };

    if (logoutLoading) return <Loader text={"Logging out..."} />;

    return (
        <div>
            {isAuthenticated ? (
                <nav
                    className="relative w-full px-6 py-3 border-b-[0.5px] border-gray-200 flex items-center justify-between">

                    <h1 className="text-xl pl-2 font-bold">
                        <a href="/">AuctionHub</a>
                    </h1>


                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:text-gray-600 transition-colors">Home</Link>
                        <a href="#auction" className="hover:text-gray-600 transition-colors">Auction</a>
                        <a href="#browse" className="hover:text-gray-600 transition-colors">Browse</a>
                        <Link to="/addproduct" className="hover:text-gray-600 transition-colors">Sell</Link>
                        <Link to="/contact" className="hover:text-gray-600 transition-colors">Contact</Link>
                    </div>


                    <div className="relative hidden md:flex items-center space-x-5">

                        <div className="relative cursor-pointer">
                            <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900" />

                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                        </div>


                        <div className="relative">
                            <button
                                className="flex items-center space-x-1 cursor-pointer focus:outline-none"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <User
                                    className="w-7 h-7 text-gray-700 hover:text-gray-900 rounded-full border p-1 bg-gray-50" />
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    <a
                                        href="#profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={handleProfile}
                                    >
                                        Profile
                                    </a>
                                    <a
                                        href="#become-seller"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Become Seller
                                    </a>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>


                    {menuOpen && (
                        <div
                            className="absolute top-full left-0 w-full bg-white border-t border-gray-200 flex flex-col items-center md:hidden py-4 space-y-3 shadow-lg z-50">
                            <Link to="/" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Home</Link>
                            <a href="#auction" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Auction</a>
                            <a href="#browse" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Browse</a>
                            <Link to="/addproduct" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Sell</Link>


                            <a href="#notifications"
                                className="block w-full text-center py-2 hover:bg-gray-100 text-gray-800"
                                onClick={() => setMenuOpen(false)}>
                                🔔 Notifications
                            </a>


                            <a href="#profile" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/userprofile");
                                }}>Profile</a>
                            <a href="#become-seller" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Become Seller</a>
                            <button onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }} className="block w-full text-center py-2 hover:bg-gray-100">
                                Log Out
                            </button>
                        </div>
                    )}


                </nav>
            ) : (
                <nav className="px-6 py-2 border-b-[0.5px] border-gray-200 flex items-center justify-between">
                    <h1 className="text-xl pl-7 font-bold"><a href="/">AuctionHub</a></h1>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogin} className="font-medium cursor-pointer">Log In</button>
                        <div className="w-px h-6 bg-gray-400"></div>
                        <button onClick={handleSignup}
                            className="bg-blue-500 text-white text-[14px] font-bold px-4 py-2 rounded-full cursor-pointer">
                            SignUp
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}

export default Navbar;