// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
// import Loading from "../Component/Loading";

// function TeacherRoutes({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) return <Loading />;

//   if (!user || user.role !== "teacher" || user.status !== "pending") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// export default TeacherRoutes;
