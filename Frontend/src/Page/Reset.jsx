import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Reset() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordStrong = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    const isUserNameValid = (name) => {
        const nameRegex = /^[A-Za-z.\-\s]{2,40}$/;
        return typeof name === "string" && nameRegex.test(name.trim());
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) newErrors.email = "Email is required";
        else if (!isEmailValid(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else if (!isPasswordStrong(formData.password))
            newErrors.password = "Password must be 8+ chars, include 1 uppercase and 1 number";

        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Ensure all fields are valid before submitting.", { position: "top-center" });
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("https://ns-server.onrender.com/api/auth/reset-otp", { email: formData.email });
            toast.success(res.data.message, { position: "top-center" });

            navigate("/reset-otp", { state: { email: formData.email, newPassword: formData.password } });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP", { position: "top-center" });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-bg flex flex-col font-body min-h-screen">
            <ToastContainer />
            <div className="p-4 text-2xl font-heading text-primary text-left">NoticeSphere</div>
            <div className="flex flex-col md:flex-row gap-4 px-4 md:px-12 py-4 lg:h-[calc(100vh-70px)] justify-center items-center max-w-[1200px] mx-auto min-h-[calc(100vh-70px)]">
                <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center items-center h-full">
                    <div className="w-full max-w-lg">
                        <h2 className="text-xl md:text-2xl font-heading text-textMain mb-4 text-center">
                            Reset Password
                        </h2>
                        <div className="flex-1 lg:overflow-y-auto scroll-smooth hide-scrollbar lg:pr-2 lg:p-2 w-full">
                            <form onSubmit={handleSubmit} className="space-y-4 pb-4 w-full" autoComplete="off">
                                <input type="text" name="fakeusernameremembered" style={{ display: "none" }} />
                                <input type="password" name="fakepasswordremembered" style={{ display: "none" }} />

                                <input
                                    autoComplete="username"
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                                <input
                                    autoComplete="new-password"
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    onChange={handleChange}
                                    className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                                <input
                                    autoComplete="new-password"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}
                                    className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                    required
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                                <button
                                    type="submit"
                                    className="w-full bg-btn hover:bg-btnHover text-textSubtle hover:text-textMain font-heading p-3 rounded-lg shadow mt-2 transition duration-300"
                                    disabled={loading}
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>
                        </div>
                        <div className="text-center md:text-right text-sm text-textSubtle mt-2">
                            Remembered your password? <a href="/login" className="text-primary underline">Login</a>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 max-w-md justify-center items-center sticky top-0 h-full p-4">
                    <img
                        src="Display/reset.jpeg"
                        alt="Reset Password"
                        className="h-full w-full object-cover rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
}

export default Reset;
