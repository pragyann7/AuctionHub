import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Navigate, Link, NavLink } from "react-router-dom";
import { Loader } from './Loading';
import { Bell, User, ChevronDown, BrushCleaning, Ellipsis, MessageSquare, MessageSquareQuote } from 'lucide-react';
import axiosInstance from '../API/axiosInstance';

function Navbar() {
    const { logout, isAuthenticated, logoutLoading, user } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notification, setNotification] = useState(false);

    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 250) {
                setHidden(true);
            } else {
                setHidden(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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

    const handleBecomeSeller = () => {
        navigate("/become-seller");
    };

    if (logoutLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader text="Logging out..." />
            </div>
        );
    }

    return (
        <div>
            {isAuthenticated ? (
                <nav
                    className={`fixed top-0 left-0 w-full z-50 bg-white px-6 py-3 flex items-center justify-between shadow transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'
                        }`}
                >



                    <h1 className="text-xl pl-2 font-bold">
                        <a href="/">Auction<span className='text-orange-400'>Hub</span></a>
                    </h1>

                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-700 hover:text-gray-600 transition-colors hover:text-orange-300"
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/browse"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-700 hover:text-gray-600 transition-colors hover:text-orange-300"
                            }
                        >
                            Browse
                        </NavLink>

                        {user?.is_seller && (<NavLink
                            to="/addproduct"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-700 hover:text-gray-600 transition-colors hover:text-orange-300"
                            }
                        >
                            Sell
                        </NavLink>)}

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-700 hover:text-gray-600 transition-colors hover:text-orange-300"
                            }
                        >
                            Contact
                        </NavLink>
                        <NavLink
                            to="/delete"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-500 font-medium"
                                    : "text-gray-700 hover:text-gray-600 transition-colors hover:text-orange-300"
                            }
                        >
                            Delete product
                        </NavLink>
                    </div>



                    <div className="relative hidden md:flex items-center space-x-5">
                        <div className='relative'>
                            <button className="flex items-center cursor-pointer"
                                onClick={() => {
                                    setNotification(!notification);
                                    setDropdownOpen(false);
                                }}
                            >
                                <Bell className="w-6 h-6 text-gray-700 hover:text-orange-400" />

                                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                            </button>
                            {notification && (
                                <div
                                    className="absolute right-0 mt-2 w-75 py-3 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                                // onClick={() => setNotification(false)}
                                >
                                    <label className='text-2xl font-bold ml-4'>Notifications</label>
                                    <div className='flex ml-39 mt-2 hover:text-red-600 hover:underline'>
                                        <BrushCleaning size={15} />
                                        <label className='ml-0.5 text-[12px] font-light cursor-pointer'>Mark all as read</label>
                                    </div>
                                    <div className='flex flex-row gap-1 px-2 py-2 cursor-pointer'>
                                        <div className='bg-amber-700 text-white rounded-2xl w-7 h-7 flex items-center justify-center'>P</div>
                                        <div className='bg-gray-300 w-59 p-1 text-[13px] rounded-md'>New product has arrived check it out!</div>
                                        <div>
                                            <Ellipsis size={18} />
                                            <label className='text-[10px]'>4h</label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 px-2 py-2 cursor-pointer'>
                                        <div className='bg-amber-700 text-white rounded-2xl w-7 h-7 flex items-center justify-center'>P</div>
                                        <div className='bg-gray-300 w-59 p-1 text-[13px] rounded-md'>Auction has begin the one you liked.</div>
                                        <div>
                                            <Ellipsis size={18} />
                                            <label className='text-[10px]'>8h</label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 px-2 py-2 cursor-pointer'>
                                        <div className='bg-amber-700 text-white rounded-2xl w-7 h-7 flex items-center justify-center'>P</div>
                                        <div className='bg-gray-300 w-59 p-1 text-[13px] rounded-md'>The auction has ended!</div>
                                        <div>
                                            <Ellipsis size={18} />
                                            <label className='text-[10px]'>22h</label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 px-2 py-2 cursor-pointer'>
                                        <div className='bg-amber-700 text-white rounded-2xl w-7 h-7 flex items-center justify-center'>P</div>
                                        <div className='bg-gray-300 w-59 p-1 text-[13px] rounded-md'>You've won the auction for product #pd123</div>
                                        <div>
                                            <Ellipsis size={18} />
                                            <label className='text-[10px]'>2d</label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 px-2 py-2 cursor-pointer'>
                                        <div className='bg-amber-700 text-white rounded-2xl w-7 h-7 flex items-center justify-center'>P</div>
                                        <div className='bg-gray-300 w-59 p-1 text-[13px] rounded-md'>Check out the products that may you like!</div>
                                        <div>
                                            <Ellipsis size={18} />
                                            <label className='text-[10px]'>7d</label>
                                        </div>
                                    </div>
                                    <div className='flex flex-row gap-1 px-2 py-2 cursor-pointer'>
                                        <div className='bg-amber-700 text-white rounded-2xl w-7 h-7 flex items-center justify-center'>P</div>
                                        <div className='bg-gray-300 w-59 p-1 text-[13px] rounded-md'>Auction has begin for product #pd321, check it out.</div>
                                        <div>
                                            <Ellipsis size={18} />
                                            <label className='text-[10px]'>14d</label>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-center mt-2'>
                                        <button className='text-[13px] cursor-pointer text-white bg-gray-700 px-17 py-1 rounded-[7px]'>See all notifications</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <MessageSquareQuote className='cursor-pointer text-gray-700 hover:text-orange-400' />
                        <div className="relative">
                            <button
                                className="flex items-center space-x-1 cursor-pointer focus:outline-none"
                                onClick={() => {
                                    setDropdownOpen(!dropdownOpen);
                                    setNotification(false);
                                }}
                            >
                                <User
                                    className="w-7 h-7 text-gray-700 hover:text-gray-900 rounded-full border p-1 bg-gray-50" />
                                <label className='font-normal cursor-pointer'>{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</label>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                        onClick={() => {
                                            handleProfile();
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Profile
                                    </button>

                                    {!user?.is_seller && (
                                        <button
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                            onClick={() => {
                                                setDropdownOpen(false);
                                                handleBecomeSeller();
                                            }}
                                        >
                                            Become Seller
                                        </button>
                                    )}

                                    <div className="border-t border-gray-200 my-1"></div>

                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
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
                            {/* <a href="#auction" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Auction</a> */}
                            <a href="/browse" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Browse</a>
                            <Link to="/addproduct" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Sell</Link>
                            <Link to="/contact" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Contact</Link>


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
                            {/* <a href="#become-seller" className="block w-full text-center py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}>Become Seller</a> */}
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
                <nav className={`fixed top-0 left-0 w-full z-50 bg-white px-6 py-3 flex items-center justify-between shadow transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'
                    }`}>
                    <h1 className="text-xl pl-2 font-bold">
                        <a href="/">Auction<span className='text-orange-400'>Hub</span></a>
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogin} className="font-medium border border-gray-600/30 hover:border-gray-600/70 px-4 py-1 rounded-full cursor-pointer">Log In</button>
                        <div className="w-px h-6 bg-gray-400"></div>
                        <button onClick={handleSignup}
                            className="bg-orange-400 hover:bg-orange-500 transition text-white text-[14px] font-bold px-4 py-2 rounded-full cursor-pointer">
                            SignUp
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}

export default Navbar;