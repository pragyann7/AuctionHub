import { useState } from "react";

export default function OTPInput({ length = 6, onChange }) {
    const [otp, setOtp] = useState(Array(length).fill(""));

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));

        if (value && index < length - 1) {
            const next = document.getElementById(`otp-${index + 1}`);
            if (next) next.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prev = document.getElementById(`otp-${index - 1}`);
            if (prev) prev.focus();
        }
    };

    return (
        <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border-2 border-gray-300 rounded-md
                 focus:border-blue-500 focus:ring-1 focus:ring-blue-200
                 text-xl font-semibold"
                />
            ))}
        </div>

    );
}
