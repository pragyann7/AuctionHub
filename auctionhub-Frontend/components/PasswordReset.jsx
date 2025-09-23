import React, { useState } from "react";
import axiosInstance from "../API/axiosInstance";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const requestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await axiosInstance.post("/password-reset/", { email });
            setStep(2);
            setMessage(res.data.message);
        } catch (err) {
            setMessage(
                err.response?.data?.detail || "Failed to send OTP. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await axiosInstance.post("/password-reset-confirm/", {
                email,
                code: otp,
                new_password: newPassword,
            });
            setMessage("Password reset successful! You can now log in.");
            setTimeout(() => navigate("/signin"), 2000);
        } catch (err) {
            setMessage(
                err.response?.data?.detail || "Failed to reset password. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {step === 1 ? "Forgot Password" : "Reset Your Password"}
                </h2>

                {message && (
                    <div className="mb-4 text-center text-sm text-orange-600">{message}</div>
                )}

                {step === 1 && (
                    <form onSubmit={requestOtp} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={resetPassword} className="space-y-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium">OTP</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
