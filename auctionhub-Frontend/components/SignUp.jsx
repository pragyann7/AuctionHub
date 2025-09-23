import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../API/axiosInstance";
import debounce from "lodash.debounce";


export default function SignUp() {

    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate()
    const [errors, setErrors] = useState({});

    const checkAvailability = useCallback(
        debounce(async (name, value) => {
            try {
                await axiosInstance.post("/check-availability/", { [name]: value });
                setErrors((prev) => ({ ...prev, [name]: "" }));
            } catch (err) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: err.response?.data?.[name]
                }));
            }
        }, 1000),
        []
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if ((name === "username" || name === "email") && value.trim() !== "") {
            checkAvailability(name, value);
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.username || errors.email) {
            alert("Fix errors before submitting");
            return;
        }

        try {
            const res = await axiosInstance.post("/register/", formData);
            alert(res.data.message);
            navigate("/verify-email", { state: { email: formData.email } });

        } catch (err) {
            if (err.response?.data) {
                const backendMessage =
                    err.response.data.message ||
                    Object.values(err.response.data)
                        .flat()
                        .join(" ");

                alert("Registration failed: " + backendMessage);
            } else {
                alert("Registration failed. Something went wrong.");
                console.error(err);
            }
        }
    };




    return (
        <>
            <div className="flex h-screen min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-4 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign Up
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    autoComplete="username"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600/50 sm:text-sm/6"
                                />
                                {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    onChange={handleChange}
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600/50 sm:text-sm/6"
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600/50 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600/50"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have an account?{' '}
                        <a href="/signin" className="font-semibold text-orange-400 hover:text-orange-500">
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}
