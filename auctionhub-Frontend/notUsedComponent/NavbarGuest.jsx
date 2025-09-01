import React from 'react'
import { useNavigate, Navigate } from "react-router-dom"

function NavbarGuest() {
    const Navigate = useNavigate();
    const handleLogin = () => {
        Navigate('/signin');
    }
    const handleSignup = () => {
        Navigate('/signup');
    }
    return (
        <nav className="px-6 py-2 border-b-[0.5px] border-gray-200 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-xl pl-7 font-bold"><a href="/">AuctionHub</a></h1>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <button onClick={handleLogin} className="font-medium cursor-pointer">Log In</button>
                <div className="w-px h-6 bg-gray-400"></div>
                <button onClick={handleSignup} className="bg-blue-500 text-white text-[14px] font-bold px-4 py-2 rounded-full cursor-pointer">
                    SignUp
                </button>
            </div>
        </nav>

    )
}

export default NavbarGuest
