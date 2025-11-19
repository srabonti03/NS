import React, { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Layout
const Layout = lazy(() => import("./Layout/Layout"));

// Pages
const Register = lazy(() => import("./Page/Register"));
const Login = lazy(() => import("./Page/Login"));
const Reset = lazy(() => import("./Page/Reset"));
const VerifyOTP = lazy(() => import("./Page/VerifyOTP"));
const ResetOTP = lazy(() => import("./Page/ResetOTP"));
const Pending = lazy(() => import("./Page/Pending"));
const Insights = lazy(() => import("./Page/Insights"));
const NoticeFeed = lazy(() => import("./Page/NoticeFeed"));
const NotFound = lazy(() => import("./Page/NotFound"));
const FacultyList = lazy(() => import("./Page/FacultyList"));
const Faculty = lazy(() => import("./Page/Faculty"));
const StudentList = lazy(() => import("./Page/StudentList"));
const Student = lazy(() => import("./Page/Student"));
const MyNotices = lazy(() => import("./Page/MyNotices"));
const FacultyNotices = lazy(() => import("./Page/FacultyNotices"));
const CreateNotice = lazy(() => import("./Page/CreateNotice"));
const UpdateNotice = lazy(() => import("./Page/UpdateNotice"));
const ViewNotice = lazy(() => import("./Page/ViewNotice"));
const Notifications = lazy(() => import("./Page/Notifications"));
const AboutUs = lazy(() => import("./Page/AboutUs"));
const ContactUs = lazy(() => import("./Page/ContactUs"));
const Profile = lazy(() => import("./Page/Profile"));
const ChangePassword = lazy(() => import("./Page/ChangePassword"));

// Route Wrappers
const PublicRoutes = lazy(() => import("./Route/PublicRoutes"));
const ProtectedRoutes = lazy(() => import("./Route/ProtectedRoutes"));
const AdminRoute = lazy(() =>
    import("./Route/ProtectedRoutes").then((module) => ({ default: module.AdminRoute }))
);
const TeacherPendingRoute = lazy(() =>
    import("./Route/ProtectedRoutes").then((module) => ({ default: module.TeacherPendingRoute }))
);

// Component
const Slider = lazy(() => import("./Component/Slider"));

function App() {
    const [dark, setDark] = useState(() => {
        const storedTheme = localStorage.getItem("theme");
        return storedTheme === "dark";
    });

    useEffect(() => {
        const themeClass = dark ? "theme-dark" : "theme-light";
        document.documentElement.className = themeClass;
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    return (
        <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/register"
                    element={
                        <PublicRoutes>
                            <Register dark={dark} setDark={setDark} />
                        </PublicRoutes>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoutes>
                            <Login dark={dark} setDark={setDark} />
                        </PublicRoutes>
                    }
                />
                <Route
                    path="/password-reset"
                    element={
                        <PublicRoutes>
                            <Reset dark={dark} setDark={setDark} />
                        </PublicRoutes>
                    }
                />
                <Route
                    path="/verify-otp"
                    element={
                        <PublicRoutes>
                            <VerifyOTP dark={dark} setDark={setDark} />
                        </PublicRoutes>
                    }
                />
                <Route
                    path="/reset-otp"
                    element={
                        <PublicRoutes>
                            <ResetOTP dark={dark} setDark={setDark} />
                        </PublicRoutes>
                    }
                />

                {/* Protected Routes with Layout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoutes>
                            <Layout dark={dark} setDark={setDark} />
                        </ProtectedRoutes>
                    }
                >
                    {/* Default notices feed */}
                    <Route index element={<NoticeFeed />} />

                    {/* Insights */}
                    <Route path="insights" element={<Insights />} />

                    {/* Notices by category */}
                    <Route path="notices" element={<NoticeFeed />} />

                    {/* MyNotices Route */}
                    <Route path="my-notices" element={<MyNotices />} />

                    {/* FacultyNotices Route */}
                    <Route path="faculty-notices" element={<FacultyNotices />} />

                    {/* CreateNotice Route */}
                    <Route path="create-notice" element={<CreateNotice />} />

                    {/* UpdateNotice Route */}
                    <Route path="update-notice/:id" element={<UpdateNotice />} />

                    {/* Admin-only */}
                    <Route
                        path="teachers"
                        element={
                            <AdminRoute>
                                <FacultyList />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="faculty/:id"
                        element={
                            <AdminRoute>
                                <Faculty />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="students"
                        element={
                            <AdminRoute>
                                <StudentList />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="student/:id"
                        element={
                            <AdminRoute>
                                <Student />
                            </AdminRoute>
                        }
                    />

                    {/* Teacher pending page inside Layout */}
                    <Route
                        path="pending"
                        element={
                            <TeacherPendingRoute>
                                <Pending dark={dark} setDark={setDark} />
                            </TeacherPendingRoute>
                        }
                    />

                    {/* Image Route */}
                    <Route path="image" element={<Slider />} />

                    {/* View Notice Route */}
                    <Route path="view-notice/:id" element={<ViewNotice />} />

                    {/* Notifications Route */}
                    <Route path="notifications" element={<Notifications />} />

                    {/* About Us Route */}
                    <Route path="about" element={<AboutUs />} />

                    {/* Contact Us Route */}
                    <Route path="contact" element={<ContactUs />} />

                    {/* User Profile Route */}
                    <Route path="profile" element={<Profile />} />

                    {/* Change Password Route */}
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>

                {/* Fallback 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}

export default App;
