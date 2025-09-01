import axios from 'axios';
import { useState, useEffect } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import ErrorAuth from '../components/ErrorAuth';
import axiosInstance from '../API/axiosInstance';
import NavbarGuest from './NavbarGuest';
import Navbar from '../components/Navbar';
import React from 'react'

function HomeGuest() {

    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <h1 className='text-black text-7xl flex justify-center mt-50'>Guest Page</h1>
        </>
    )
}

export default HomeGuest
