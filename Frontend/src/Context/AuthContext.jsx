import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Component/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();
    const intervalRef = useRef(null);

    const publicPaths = ["/login", "/register", "/password-reset", "/verify-otp"];

    const fetchUser = async () => {
        try {
            const response = await axios.get("https://ns-server.onrender.com/api/auth/user-info", {
                withCredentials: true,
            });
            setUser(response.data.user);
        } catch (err) {
            if (err.response?.status === 401) {
                setUser(null);
                if (!publicPaths.includes(window.location.pathname)) {
                    navigate("/login");
                }
            } else {
                console.error("Failed to fetch user:", err.response?.data?.message || err.message);
            }
        } finally {
            setInitialLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post("https://ns-server.onrender.com/api/auth/logout", {}, { withCredentials: true });
        } catch (err) {
            console.error("Logout error:", err);
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setUser(null);
        if (!publicPaths.includes(window.location.pathname)) {
            navigate("/login");
        }
    };

    const updateUser = (updatedData) => {
        setUser((prevUser) => ({ ...prevUser, ...updatedData }));
    };

    useEffect(() => {
        fetchUser();
        intervalRef.current = setInterval(fetchUser, 1000 * 60 * 5);
        return () => clearInterval(intervalRef.current);
    }, []);

    if (initialLoading) return <Loading />;

    return (
        <AuthContext.Provider
            value={{
                user,
                fetchUser,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
