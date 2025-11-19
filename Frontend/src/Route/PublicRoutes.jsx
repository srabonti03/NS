import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PublicRoutes = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (user) return <Navigate to="/" replace />;

    return children;
};

export default PublicRoutes;
