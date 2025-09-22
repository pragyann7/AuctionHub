import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../context/AuthContext";
import PasswordReset from "./PasswordReset";

export default function SignIn() {
    const { login } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
        } catch (err) {
            alert(
                err.response?.data?.detail ||
                err.response?.data?.non_field_errors?.[0] ||
                "Login failed. Please try again."
            );
        }
    };

    return (
        <div className=" min-h-full flex-1 flex-col px-6 py-19 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Login
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
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600/40 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="text-sm">
                                <a href="/password-reset" className="font-semibold hover:underline hover:text-gray-700">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                onChange={handleChange}
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-600/40 sm:text-sm/6"
                            />
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                className="w-5 h-5 cursor-pointer accent-orange-400"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                id="showPassword"
                            />
                            <label
                                htmlFor="showPassword"
                                className="text-[14px] ml-1 cursor-pointer select-none"
                            >
                                Show password
                            </label>
                        </div>

                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-orange-600/95 cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Do not have an account?{' '}
                    <a href="/signup" className="font-semibold text-orange-400 hover:text-orange-600/75">
                        SignUp
                    </a>
                </p>
            </div>
        </div>
    )
}
