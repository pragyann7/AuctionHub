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
    return (
        <>
            <Navbar />
            <div className='w-full'>
                <h1 className='text-black text-7xl flex justify-center mt-50'>This is Home {username}!</h1>
            </div>
        </>
    )
}

export default Home
