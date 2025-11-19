import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PublicRoutes = ({ children }) => {
    const { user, initialLoading } = useAuth();

    if (initialLoading) return null;

    if (user) return <Navigate to="/" replace />;

    return children;
};

export default PublicRoutes;
