import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function ResetOTP() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputRefs = useRef([]);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || "";
    const newPassword = location.state?.newPassword || "";
    const [resending, setResending] = useState(false);

    const handleChange = (element, index) => {
        if (!/^\d*$/.test(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (!email || !newPassword) {
            toast.error("Required data missing. Please retry.", { position: "top-center" });
            return;
        }

        try {
            const res = await axios.post("https://ns-server.onrender.com/api/auth/reset-password", {
                email,
                otp: otpCode,
                newPassword
            });

            toast.success(res.data.message, { position: "top-center" });
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP verification failed", { position: "top-center" });
            console.error(err);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error("Email not found. Cannot resend OTP.", { position: "top-center" });
            return;
        }
        setResending(true);
        try {
            const res = await axios.post("https://ns-server.onrender.com/api/auth/reset-otp", { email });
            toast.success(res.data.message, { position: "top-center" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP", { position: "top-center" });
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="bg-bg flex flex-col font-body min-h-screen">
            <ToastContainer />
            <div className="p-4 text-2xl font-heading text-primary">NoticeSphere</div>

            <div className="flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-md bg-card rounded-xl shadow-default p-6 flex flex-col items-center">
                    <h2 className="text-xl md:text-2xl font-heading text-textMain mb-3 text-center">
                        OTP Verification
                    </h2>
                    <p className="text-sm text-textSubtle mb-6 text-center">
                        Enter the 6-digit code sent to your email
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-wrap justify-center gap-2 mb-6"
                    >
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                name={`otp${index}`}
                                maxLength="1"
                                value={otp[index]}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 sm:w-14 h-12 sm:h-14 text-center border border-borderMain rounded-lg bg-bg text-textMain focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                            />
                        ))}
                        <button
                            type="submit"
                            className="w-full bg-btn hover:bg-btnHover text-textSubtle hover:text-textMain font-heading p-3 rounded-lg shadow mt-4 transition duration-300"
                        >
                            Verify OTP
                        </button>
                    </form>

                    <div className="flex justify-center mt-4 text-sm text-textSubtle gap-2">
                        <span>Didn't receive the code?</span>
                        <button
                            onClick={handleResend}
                            disabled={resending}
                            className="text-primary underline"
                        >
                            {resending ? "Resending..." : "Resend"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetOTP;
