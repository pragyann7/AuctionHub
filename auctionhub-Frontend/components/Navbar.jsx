import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link, NavLink } from "react-router-dom";
import { Loader } from './Loading';
import { Bell, User, ChevronDown } from 'lucide-react';

function Navbar() {
    const { logout, isAuthenticated, logoutLoading } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [pagesDropdown, setPagesDropdown] = useState(false);
    const [notification, setNotification] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    const navigate = useNavigate();

    // Show navbar on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 250) {
                setHidden(true); // hide on scroll down
            } else {
                setHidden(false); // show on scroll up
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

    const handleLogin = () => navigate('/signin');
    const handleSignup = () => navigate('/signup');
    const handleProfile = () => {
        setDropdownOpen(false);
        navigate("/userprofile");
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
                    className={`fixed top-0 left-0 w-full z-50 bg-white shadow transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
                    <div className="flex items-center justify-between px-6 py-3">
                        {/* Logo */}
                        <h1 className="text-xl font-bold">
                            <a href="/">Auction<span className='text-orange-400'>Hub</span></a>
                        </h1>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            {[{ name: "Home", path: "/" }, { name: "Browse", path: "/browse" }, { name: "Sell", path: "/addproduct" }, { name: "Delete Product", path: "/delete" }, { name: "Product Detail", path: "/productdetail" }, { name: "Get in Touch", path: "/contact" }].map((link, i) => (
                                <NavLink key={i} to={link.path}
                                    className={({ isActive }) => `transition-colors font-medium ${isActive ? "text-orange-400" : "text-gray-700 hover:text-orange-400"}`}>
                                    {link.name}
                                </NavLink>
                            ))}
                            {/* Pages Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-400 font-medium">
                                    Pages
                                </button>
                                <div
                                    className="absolute left-0 w-48 bg-white border border-gray-200 shadow-lg
                                    transform scale-75 opacity-0 origin-top group-hover:scale-105 group-hover:opacity-100
                                    transition-all duration-150 ease-out overflow-visible z-50"
                                    style={{ top: '100%', marginTop: '2px' }}
                                >
                                    <div className="group-hover:scale-100 transition-transform duration-100 ease-out">
                                        {[{ name: "FAQ", path: "/FAQ" }, { name: "About Us", path: "/" }, { name: "How It Works", path: "/home" }, { name: "404", path: "/notfound" }].map((page, i) => (
                                            <NavLink key={i} to={page.path}
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 transition-colors duration-100 ${isActive ? 'text-orange-400 font-medium' : 'text-gray-700 hover:text-orange-400'}`
                                                }
                                            >
                                                {page.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop Right Icons */}
                        <div className="hidden md:flex items-center space-x-5">
                            {/* Notification */}
                            <div className='relative'>
                                <button className="flex items-center cursor-pointer" onClick={() => {
                                    setNotification(!notification);
                                    setDropdownOpen(false);
                                }}>
                                    <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900" />
                                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                                </button>
                                {notification && (
                                    <div className="absolute right-0 mt-2 w-75 py-3 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                        {/* Notification content can go here */}
                                    </div>
                                )}
                            </div>

                            {/* Profile */}
                            <div className="relative">
                                <button className="flex items-center space-x-1 cursor-pointer focus:outline-none"
                                    onClick={() => {
                                        setDropdownOpen(!dropdownOpen);
                                        setNotification(false);
                                    }}>
                                    <User className="w-7 h-7 text-gray-700 hover:text-gray-900 rounded-full border p-1 bg-gray-50" />
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                        <a href="#profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition" onClick={handleProfile}>Profile</a>
                                        <a href="#become-seller" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition" onClick={() => setDropdownOpen(false)}>Become Seller</a>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition">Log Out</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl">{menuOpen ? "✖" : "☰"}</button>
                        </div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {menuOpen && (
                        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 flex flex-col items-center md:hidden py-4 space-y-3 shadow-lg z-50">
                            {[{ name: "Home", path: "/" }, { name: "Browse", path: "/browse" }, { name: "Sell", path: "/addproduct" }, { name: "Contact", path: "/contact" }, { name: "Product Detail", path: "/productdetail" }].map((link, i) => (
                                <Link key={i} to={link.path} onClick={() => setMenuOpen(false)} className="block w-full text-center py-2 hover:bg-gray-100">
                                    {link.name}
                                </Link>
                            ))}

                            {/* Pages Dropdown */}
                            <div className="w-full">
                                <button onClick={() => setPagesDropdown(!pagesDropdown)} className="w-full text-center py-2 font-medium hover:bg-gray-100">
                                    Pages {pagesDropdown ? "▲" : "▼"}
                                </button>
                                {pagesDropdown && (
                                    <div className="flex flex-col w-full">
                                        {[{ name: "FAQ", path: "/FAQ" }, { name: "About Us", path: "/notFound" }, { name: "How It Works", path: "/notFound" }, { name: "NotFound", path: "/notFound" }].map((page, i) => (
                                            <Link key={i} to={page.path} onClick={() => {
                                                setMenuOpen(false);
                                                setPagesDropdown(false);
                                            }} className="block w-full text-center py-2 hover:bg-gray-100">
                                                {page.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notifications & Profile */}
                            <a href="#notifications" className="block w-full text-center py-2 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>🔔 Notifications</a>
                            <a href="#profile" className="block w-full text-center py-2 hover:bg-gray-100" onClick={() => {
                                setMenuOpen(false);
                                navigate("/userprofile");
                            }}>Profile</a>
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
                <nav className={`fixed top-0 left-0 w-full z-50 bg-white px-6 py-3 flex items-center justify-between shadow transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
                    <h1 className="text-xl pl-2 font-bold">
                        <a href="/">Auction<span className='text-orange-400'>Hub</span></a>
                    </h1>
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
    );
}

export default Navbar;
