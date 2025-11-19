import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Login() {
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "https://ns-server.onrender.com/api/auth/login";

        try {
            const payload = { password: formData.password };

            if (role === "student") {
                payload.regNo = formData.regNo;
            } else {
                payload.email = formData.email;
            }
            const res = await axios.post(url, payload, { withCredentials: true });
            toast.success(res.data.message, { position: "top-center" });
            await fetchUser();
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed", { position: "top-center" });
        }
    };

    return (
        <div className="bg-bg flex flex-col font-body min-h-screen">
            <ToastContainer />
            <div className="p-4 text-2xl font-heading text-primary">NoticeSphere</div>
            <div className="flex flex-col md:flex-row gap-4 px-4 md:px-12 py-4 h-[90vh] justify-center lg:justify-center lg:space-x-8 max-w-[1200px] mx-auto">
                <div className="w-full md:w-full lg:w-1/2 flex flex-col justify-center items-center h-full">
                    <div className="w-full max-w-lg">
                        <h2 className="text-xl md:text-2xl font-heading text-textMain mb-4 text-center">
                            Login as {role}
                        </h2>
                        <div className="flex-1 flex flex-col justify-center lg:overflow-y-auto lg:pr-2 scroll-smooth hide-scrollbar lg:p-2">
                            <form onSubmit={handleSubmit} className="space-y-4 pb-4 w-full" autoComplete="off">
                                <input type="text" name="fakeusernameremembered" style={{ display: "none" }} />
                                <input type="password" name="fakepasswordremembered" style={{ display: "none" }} />

                                {role === "student" && (
                                    <>
                                        <input
                                            autoComplete="new-password"
                                            type="text"
                                            name="regNo"
                                            placeholder="Registration Number"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                            required
                                        />
                                        <input
                                            autoComplete="new-password"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                            required
                                        />
                                    </>
                                )}

                                {role === "teacher" && (
                                    <>
                                        <input
                                            autoComplete="new-password"
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                            required
                                        />
                                        <input
                                            autoComplete="new-password"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                            required
                                        />
                                    </>
                                )}

                                {role === "admin" && (
                                    <>
                                        <input
                                            autoComplete="new-password"
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                            required
                                        />
                                        <input
                                            autoComplete="new-password"
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            onChange={handleChange}
                                            className="w-full p-3 border border-borderMain rounded-lg bg-bg text-textMain"
                                            required
                                        />
                                    </>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-btn hover:bg-btnHover text-textSubtle hover:text-textMain font-heading p-3 rounded-lg shadow mt-2 transition duration-300"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                            <div className="text-left text-textSubtle">
                                <span className="hidden sm:inline text-xs">Don't have an account? </span>
                                <a href="/register" className="text-primary underline">Register</a>
                            </div>
                            <div className="text-right text-textSubtle">
                                <span className="hidden sm:inline text-xs">Forgot your password? </span>
                                <a href="/password-reset" className="text-primary underline">Reset</a>
                            </div>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-textSubtle mb-1">Login as</p>
                            <div className="flex justify-center flex-wrap gap-2">
                                <button
                                    onClick={() => setRole("student")}
                                    className={`px-3 py-1 rounded-full border ${role === "student" ? "bg-primary text-white" : "border-borderMain text-textSubtle"}`}
                                >
                                    Student
                                </button>
                                <button
                                    onClick={() => setRole("teacher")}
                                    className={`px-3 py-1 rounded-full border ${role === "teacher" ? "bg-primary text-white" : "border-borderMain text-textSubtle"}`}
                                >
                                    Teacher
                                </button>
                                <button
                                    onClick={() => setRole("admin")}
                                    className={`px-3 py-1 rounded-full border ${role === "admin" ? "bg-primary text-white" : "border-borderMain text-textSubtle"}`}
                                >
                                    Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex w-1/2 max-w-md justify-center items-center sticky top-0 h-full p-4">
                    <img
                        src="Display/login.jpeg"
                        alt="Login"
                        className="h-full w-full object-cover rounded-2xl"
                    />
                </div>
            </div>
        </div>
    );
}

export default Login;
