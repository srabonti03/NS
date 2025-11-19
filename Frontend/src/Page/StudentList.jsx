import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../Component/Loading";
import axios from "axios";
import { FiSlash, FiUnlock, FiSearch } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const norm = (s) => (s ? String(s).toLowerCase() : "");

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:5000/api/admin/students/all", {
                withCredentials: true,
            });
            setStudents(res.data);
            setFilteredStudents(res.data);
        } catch (err) {
            toast.error("Error fetching students");
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredStudents(students);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = students.filter(
                (student) =>
                    norm(student.firstName).includes(query) ||
                    norm(student.lastName).includes(query) ||
                    norm(student.email).includes(query) ||
                    norm(student.session).includes(query) ||
                    norm(student.dept).includes(query) ||
                    norm(student.section).includes(query) ||
                    norm(student.regNo).includes(query)
            );
            setFilteredStudents(filtered);
        }
    }, [searchQuery, students]);

    const handleToggle = async (id, enabled) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/admin/students/${id}/status`,
                { enabled },
                { withCredentials: true }
            );
            toast.success(`Student ${enabled ? "enabled" : "disabled"} successfully`);
        } catch (e) {
            toast.error(`Failed to ${enabled ? "enable" : "disable"} student`);
            console.error("Toggle status error:", e);
        } finally {
            fetchStudents();
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="flex justify-center mt-10 px-2 sm:px-4">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="w-full max-w-5xl rounded-lg p-4 sm:p-6 min-h-[85vh]">

                <div className="flex justify-center mb-10">
                    <div className="relative w-full max-w-md">
                        <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-textSubtle" />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-borderSubtle bg-card text-textMain placeholder:text-textSubtle shadow focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm sm:text-base md:text-sm transition duration-DEFAULT"
                        />
                    </div>
                </div>

                <h2 className="text-lg sm:text-xl md:text-xl font-semibold mb-6 text-center text-textMain">
                    Student List
                </h2>

                {filteredStudents.length === 0 ? (
                    <p className="text-sm sm:text-base md:text-sm text-center text-textSubtle">
                        No students found.
                    </p>
                ) : (
                    <table className="w-full text-left border-collapse table-auto break-all text-sm sm:text-base md:text-sm">
                        <thead>
                            <tr className="bg-card">
                                <th className="py-2 px-2 hidden lg:table-cell break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Avatar
                                </th>
                                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Name
                                </th>
                                <th className="py-2 px-2 hidden md:table-cell break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Email
                                </th>
                                <th className="py-2 px-2 hidden lg:table-cell break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Session
                                </th>
                                <th className="py-2 px-2 hidden sm:table-cell md:table-cell break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Department
                                </th>
                                <th className="py-2 px-2 hidden lg:table-cell break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Section
                                </th>
                                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Reg. No.
                                </th>
                                <th className="py-2 px-2 break-words text-xs sm:text-sm md:text-sm text-textMain">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => {
                                const isDisabled = !student.isEnabled;
                                const canEnable = isDisabled;
                                const canDisable = !isDisabled;

                                return (
                                    <tr
                                        key={student.id}
                                        className="transition-colors duration-200 hover:bg-cardHover"
                                    >
                                        <td
                                            className="py-2 px-2 hidden lg:table-cell break-words cursor-pointer"
                                            onClick={() => navigate(`/student/${student.id}`)}
                                        >
                                            <img
                                                src={student?.avatar || "Fallback/avatar.png"}
                                                alt="avatar"
                                                className="w-8 sm:w-10 h-8 sm:h-10 rounded-full object-cover border border-borderSubtle"
                                            />
                                        </td>
                                        <td
                                            className="py-2 px-2 break-words text-textMain cursor-pointer"
                                            onClick={() => navigate(`/student/${student.id}`)}
                                        >
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="py-2 px-2 hidden md:table-cell break-words text-textMain">
                                            {student.email}
                                        </td>
                                        <td className="py-2 px-2 hidden lg:table-cell break-words text-textMain">
                                            {student.session || "-"}
                                        </td>
                                        <td className="py-2 px-2 hidden sm:table-cell md:table-cell break-words text-textMain">
                                            {student.dept || "-"}
                                        </td>
                                        <td className="py-2 px-2 hidden lg:table-cell break-words text-textMain">
                                            {student.section || "-"}
                                        </td>
                                        <td className="py-2 px-2 break-words text-textMain">
                                            {student.regNo || "-"}
                                        </td>
                                        <td className="py-2 px-2 space-x-2 break-words">
                                            <div className="hidden md:flex flex-wrap gap-2">
                                                {canDisable && (
                                                    <button
                                                        onClick={() => handleToggle(student.id, false)}
                                                        className="bg-red-500 text-textMain px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 break-words text-xs sm:text-sm"
                                                    >
                                                        Disable
                                                    </button>
                                                )}
                                                {canEnable && (
                                                    <button
                                                        onClick={() => handleToggle(student.id, true)}
                                                        className="bg-btn text-textMain px-2 py-1 rounded hover:bg-btnHover transition-colors duration-200 break-words text-xs sm:text-sm"
                                                    >
                                                        Enable
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex md:hidden flex-wrap gap-2 text-base sm:text-lg">
                                                {canDisable && (
                                                    <FiSlash
                                                        onClick={() => handleToggle(student.id, false)}
                                                        className="text-red-500 cursor-pointer hover:scale-110 transition-transform"
                                                    />
                                                )}
                                                {canEnable && (
                                                    <FiUnlock
                                                        onClick={() => handleToggle(student.id, true)}
                                                        className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StudentList;
