import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoutes = ({ children }) => {
    const { user, initialLoading } = useAuth();
    const location = useLocation();

    if (initialLoading) return null;

    if (!user) return <Navigate to="/login" replace />;

    if (user.role === "teacher" && user.status === "pending" && location.pathname !== "/pending") {
        return <Navigate to="/pending" replace />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { user, initialLoading } = useAuth();

    if (initialLoading) return null;

    if (!user || user.role !== "admin") return <Navigate to="/" replace />;

    return children;
};

export const TeacherRoute = ({ children }) => {
    const { user, initialLoading } = useAuth();

    if (initialLoading) return null;

    if (!user || user.role !== "teacher" || user.status !== "accepted") return <Navigate to="/" replace />;

    return children;
};

export const TeacherPendingRoute = ({ children }) => {
    const { user, initialLoading } = useAuth();

    if (initialLoading) return null;

    if (!user || user.role !== "teacher" || user.status !== "pending") return <Navigate to="/login" replace />;

    return children;
};

export const StudentRoute = ({ children }) => {
    const { user, initialLoading } = useAuth();

    if (initialLoading) return null;

    if (!user || user.role !== "student") return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoutes;
