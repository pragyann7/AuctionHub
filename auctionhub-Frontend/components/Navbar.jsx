import React from 'react'

function Navbar() {
    return (
        <nav className="px-6 py-2 border-b-[0.5px] border-gray-200 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-xl pl-7 font-bold">AuctionHub</h1>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <button className="font-bold cursor-pointer">Log In</button>
                <div className="w-px h-6 bg-gray-400"></div>
                <button className="bg-blue-500 text-white text-[14px] font-bold px-4 py-2 rounded-full cursor-pointer">
                    SignUp
                </button>
            </div>
        </nav>

    )
}

export default Navbar
