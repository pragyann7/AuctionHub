import { useState, useEffect, useRef } from "react";
import axiosInstance from "../API/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import OTPInput from "./OTPinputField";

export default function VerifyEmailOTP() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const intervalRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    useEffect(() => {
        if (!email) setMessage("No email provided. Please go back and signup again.");
    }, [email]);

    useEffect(() => {
        if (cooldown <= 0) return;
        intervalRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setMessage("");

        try {
            const res = await axiosInstance.post("/verify-email/", { email, code });
            setMessage(res.data.message);
            setLoading(false);

            setTimeout(() => navigate("/signin"), 2000);
        } catch (err) {
            setLoading(false);
            setMessage(err.response?.data?.error || "Verification failed.");
        }
    };

    const handleResendOTP = async () => {
        if (!email) return;
        setResendLoading(true);
        setMessage("");

        try {
            const res = await axiosInstance.post("/resend-otp/", { email });
            setMessage(res.data.message || "OTP resent successfully.");
            setCooldown(60);
            setResendLoading(false);
        } catch (err) {
            setResendLoading(false);
            const errorMsg = err.response?.data?.error || "Failed to resend OTP.";
            setMessage(errorMsg);
            if (err.response?.data?.remaining_seconds) {
                setCooldown(err.response.data.remaining_seconds);
            }
        }
    };

    return (
        <div className="flex md:py-7 justify-center bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-8 pb-14 w-full max-w-md">
                {/* <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h2> */}
                <div className="flex justify-center">
                    <img src="../src/assets/Enter OTP-cuate.png" alt="Verify-OTP-image" />
                </div>

                {message && (
                    <div className="bg-blue-100 text-blue-800 p-2 mb-4 rounded text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <OTPInput length={6} onChange={setCode} />
                        <label className="text-[12px]">OTP will expire in 10 minutes.</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 cursor-pointer transition"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={handleResendOTP}
                        disabled={resendLoading || cooldown > 0 || !email}
                        className={`text-sm ${cooldown > 0 ? 'text-red-400 animate-pulse cursor-not-allowed'
                            : 'text-red-400 cursor-pointer hover:underline'}`}
                    >
                        {cooldown > 0
                            ? `Resend OTP in ${cooldown}s`
                            : resendLoading
                                ? "Resending..."
                                : "Resend OTP"}
                    </button>
                </div>
            </div>
        </div>
    );
}
