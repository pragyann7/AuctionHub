import axios from 'axios';
import { useState, useEffect } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import ErrorAuth from './ErrorAuth';
import axiosInstance from '../API/axiosInstance';
import Navbar from './Navbar';
import React from 'react'

function Home() {

    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const showHome = async () => {
            try {
                const res = await axiosInstance.get('home/');
                setUsername(res.data.username);
                // alert(res.data.message);
            } catch (error) {
                setError('Failed to fetch data or unauthorized');
            }
        };

        showHome();
    }, []);

    if (error) return <ErrorAuth />;


    const handleLogout = async () => {

        const confirmed = window.confirm("Do you want to log out?");
        if (!confirmed) return;

        const refresh = localStorage.getItem('refresh');
        const access = localStorage.getItem('access');
        if (!refresh) {
            localStorage.clear();
            navigate('/');
            return;
        }

        try {
            const res = await axios.post('logout/',
                { refresh },
                { headers: { Authorization: `Bearer ${access}` } }
            );
            console.log(res.data.message)
            navigate('/');
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
            } else {
                console.log(error.message);
            }
        } finally {
            localStorage.clear();
            navigate('/');
        }
    };
    return (
        <>
            <Navbar />
            <button
                type="submit"
                onClick={handleLogout}
                className="flex mt-4 justify-center cursor-pointer rounded-md px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                Log Out
            </button>
            <div className='w-full'>
                <button
                    type="submit"
                    onClick={handleLogout}
                    className="flex mt-4 justify-center cursor-pointer rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white "
                >
                    Log Out
                </button>
                <h1 className='text-zinc-300 flex justify-center'>This is Home Baby!</h1>
            </div>
        </>
    )
}

export default Home
