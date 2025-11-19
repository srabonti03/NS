import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

function Register() {
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordStrong = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    const isUserNameValid = (name) => {
        const nameRegex = /^[A-Za-z.\-\s]{2,40}$/;
        return typeof name === "string" && nameRegex.test(name.trim());
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = "First name is required";
        else if (!isUserNameValid(formData.firstName)) newErrors.firstName = "Invalid name format";

        if (!formData.lastName) newErrors.lastName = "Last name is required";
        else if (!isUserNameValid(formData.lastName)) newErrors.lastName = "Invalid name format";

        if (!formData.email) newErrors.email = "Email is required";
        else if (!isEmailValid(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.password) newErrors.password = "Password is required";
        else if (!isPasswordStrong(formData.password)) newErrors.password = "Password must be 8+ chars, include 1 uppercase and 1 number";

        if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm password";
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match";

        if (role === "student") {
            if (!formData.session) newErrors.session = "Session is required";
            if (!formData.dept) newErrors.dept = "Department is required";
            if (!formData.regNo) newErrors.regNo = "Registration number is required";
        }

        if (role === "teacher") {
            if (!formData.dept) newErrors.dept = "Department is required";
        }

        if (role === "admin") {
            if (!formData.secretCode) newErrors.secretCode = "Secret code is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Ensure all fields are valid before submitting.", { position: "top-center" });
            return;
        }

        let baseURL = "https://ns-server.onrender.com/api/auth";
        let url = `${baseURL}/register`;

        try {
            const res = await axios.post(url, { ...formData, role });
            toast.success(res.data.message, { position: "top-center" });
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(err.response?.data?.message || "Something went wrong", { position: "top-center" });
            }
        }
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setFormData({});
        setErrors({});
    };

    const departments = ["CSE", "LLB", "BBA", "ENG"];

    return (
        <div className="bg-bg flex flex-col font-body min-h-screen">
            <ToastContainer />
            <div className="p-4 text-2xl font-heading text-primary text-left">NoticeSphere</div>
            <div className="flex flex-col md:flex-row gap-4 px-4 md:px-12 pt-4 pb-4 lg:h-[calc(100vh-70px)] justify-center items-center max-w-[1200px] mx-auto min-h-[calc(100vh-70px)]">
                <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center items-center h-full">
                    <h2 className="text-xl md:text-2xl font-heading text-textMain mb-4 text-center">
                        Register as {role}
                    </h2>
                    <div className="flex-1 lg:overflow-y-auto scroll-smooth hide-scrollbar lg:pr-2 lg:p-2 w-full">
                        <div className="w-full max-w-lg mx-auto">
                            <form onSubmit={handleSubmit} className="space-y-4 pb-4" autoComplete="off">
                                <input type="text" name="fakeusernameremembered" style={{ display: "none" }} />
                                <input type="password" name="fakepasswordremembered" style={{ display: "none" }} />

                                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName || ''} autoComplete="off" className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

                                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName || ''} autoComplete="off" className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

                                <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email || ''} autoComplete="off" className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                                {role === "student" && (
                                    <>
                                        <input type="text" name="session" placeholder="Session" onChange={handleChange} value={formData.session || ''} className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                        {errors.session && <p className="text-red-500 text-sm">{errors.session}</p>}

                                        <select name="dept" onChange={handleChange} value={formData.dept || ''} className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain placeholder:text-textSubtle">
                                            <option value="" disabled>Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        {errors.dept && <p className="text-red-500 text-sm">{errors.dept}</p>}

                                        <input type="text" name="section" placeholder="Section (optional)" onChange={handleChange} value={formData.section || ''} className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />

                                        <input type="text" name="regNo" placeholder="Registration Number" onChange={handleChange} value={formData.regNo || ''} className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                        {errors.regNo && <p className="text-red-500 text-sm">{errors.regNo}</p>}
                                    </>
                                )}

                                {role === "teacher" && (
                                    <>
                                        <select name="dept" onChange={handleChange} value={formData.dept || ''} className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain placeholder:text-textSubtle">
                                            <option value="" disabled>Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        {errors.dept && <p className="text-red-500 text-sm">{errors.dept}</p>}
                                    </>
                                )}

                                {role === "admin" && (
                                    <div>
                                        <input type="text" name="secretCode" placeholder="Secret Code" onChange={handleChange} value={formData.secretCode || ''} className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                        {errors.secretCode && <p className="text-red-500 text-sm">{errors.secretCode}</p>}
                                    </div>
                                )}

                                <input type="password" name="password" placeholder="Password" onChange={handleChange} value={formData.password || ''} autoComplete="new-password" className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} value={formData.confirmPassword || ''} autoComplete="new-password" className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain" />
                                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                                <button type="submit" className="w-full bg-btn hover:bg-btnHover text-textSubtle hover:text-textMain font-heading p-3 rounded-lg shadow mt-2 transition duration-300">
                                    Register
                                </button>
                            </form>

                            <div className="text-right text-sm text-textSubtle mt-2">
                                Already have an account? <a href="/login" className="text-primary underline">Login</a>
                            </div>

                            <div className="text-center mt-4">
                                <p className="text-sm text-textSubtle mb-1">Register as</p>
                                <div className="flex justify-center flex-wrap gap-2">
                                    <button onClick={() => handleRoleChange("student")} className={`px-3 py-1 rounded-full border ${role === "student" ? "bg-primary text-white" : "border-borderMain text-textSubtle"}`}>Student</button>
                                    <button onClick={() => handleRoleChange("teacher")} className={`px-3 py-1 rounded-full border ${role === "teacher" ? "bg-primary text-white" : "border-borderMain text-textSubtle"}`}>Teacher</button>
                                    <button onClick={() => handleRoleChange("admin")} className={`px-3 py-1 rounded-full border ${role === "admin" ? "bg-primary text-white" : "border-borderMain text-textSubtle"}`}>Admin</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 max-w-md justify-center items-center sticky top-0 h-full p-4">
                    <img src="Display/register.jpeg" alt="Register" className="h-full w-full object-cover rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export default Register;
