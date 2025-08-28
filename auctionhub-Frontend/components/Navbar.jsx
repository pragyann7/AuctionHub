import React from 'react'
import { useNavigate, Navigate } from "react-router-dom"

function Navbar() {
    const Navigate = useNavigate();
    const handleLogout = async () => {

        const confirmed = window.confirm("Do you want to log out?");
        if (!confirmed) return;

        const refresh = localStorage.getItem('refresh');
        const access = localStorage.getItem('access');
        if (!refresh) {
            localStorage.clear();
            Navigate('/');
            return;
        }

        try {
            const res = await axios.post('logout/',
                { refresh },
                { headers: { Authorization: `Bearer ${access}` } }
            );
            console.log(res.data.message)
            Navigate('/');
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error.message);
            }
        } finally {
            localStorage.clear();
            Navigate('/');
        }
    };
    return (
        <nav className="px-6 py-2 border-b-[0.5px] border-gray-200 flex items-center justify-between">
            {/* Logo */}
            <h1 className="text-xl pl-7 font-bold"><a href="/home">AuctionHub</a></h1>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <button onClick={handleLogout} className="font-medium cursor-pointer">Log Out</button>
            </div>
        </nav>

    )
}

export default Navbar
