import axios from 'axios';
import { useState, useEffect } from "react"
import { useNavigate, Navigate } from "react-router-dom"
import ErrorAuth from './ErrorAuth';
import axiosInstance from '../API/axiosInstance';
import NavbarGuest from './NavbarGuest';
import React from 'react'

function HomeGuest() {

    const navigate = useNavigate();
    return (
        <>
            <NavbarGuest />
            <h1 className='text-black text-7xl flex justify-center mt-50'>Guest Page</h1>
        </>
    )
}

export default HomeGuest
