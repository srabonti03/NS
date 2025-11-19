import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiFileText } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

function Insights() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalNotices: 0,
        noticesByCategory: [],
        teacherStatus: [],
    });

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0"];
    const PIE_COLORS = ["#FF8042", "#FFBB28"];

    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            return (
                <div className="bg-card p-2 rounded shadow border text-textMain">
                    {`${data.name}: ${data.value}`}
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await axios.get("https://ns-server.onrender.com/api/admin/insights", { withCredentials: true });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching insights:", err);
            }
        };
        fetchInsights();
    }, []);

    return (
        <div className="p-6 bg-bg min-h-[93vh] text-textMain flex justify-center">
            <div className="w-full max-w-5xl">
                <h1 className="text-2xl font-heading mb-6">Insights</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-card hover:bg-cardHover transition p-4 rounded-lg shadow flex items-center gap-3">
                        <FiUsers className="text-3xl text-primary" />
                        <div>
                            <p className="text-lg font-semibold">{stats.totalStudents}</p>
                            <p className="text-textFaint text-sm">Students</p>
                        </div>
                    </div>
                    <div className="bg-card hover:bg-cardHover transition p-4 rounded-lg shadow flex items-center gap-3">
                        <FiUsers className="text-3xl text-primary" />
                        <div>
                            <p className="text-lg font-semibold">{stats.totalTeachers}</p>
                            <p className="text-textFaint text-sm">Teachers</p>
                        </div>
                    </div>
                    <div className="bg-card hover:bg-cardHover transition p-4 rounded-lg shadow flex items-center gap-3">
                        <FiFileText className="text-3xl text-primary" />
                        <div>
                            <p className="text-lg font-semibold">{stats.totalNotices}</p>
                            <p className="text-textFaint text-sm">Notices</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <div className="bg-card hover:bg-cardHover transition p-6 rounded-lg shadow">
                        <h2 className="text-xl text-center font-semibold mb-4">Notices by Category</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.noticesByCategory}>
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip content={<CustomPieTooltip />} />
                                <Bar dataKey="count" fill="#0088FE" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-card hover:bg-cardHover transition p-6 rounded-lg shadow">
                        <h2 className="text-xl text-center font-semibold mb-4">Teacher Status Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.teacherStatus}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    label
                                >
                                    {stats.teacherStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Insights;
