import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import { FiCode, FiDatabase, FiServer, FiUsers } from "react-icons/fi";

function AboutUs() {
    const [admins, setAdmins] = useState([]);
    const [totalStudents, setTotalStudents] = useState(null);
    const [totalNotices, setTotalNotices] = useState(null);
    const [totalTeachers, setTotalTeachers] = useState(null);

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const res = await axios.get("https://ns-server.onrender.com/api/admin/admins/all");
                setAdmins(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchTotalStudents = async () => {
            try {
                const res = await axios.get("https://ns-server.onrender.com/api/student/total");
                setTotalStudents(res.data.totalStudents);
            } catch (err) {
                console.error("Failed to fetch total students:", err);
            }
        };

        const fetchTotalNotices = async () => {
            try {
                const res = await axios.get("https://ns-server.onrender.com/api/notice/total");
                setTotalNotices(res.data.totalNotices);
            } catch (err) {
                console.error("Failed to fetch total notices:", err);
            }
        };

        const fetchTotalTeachers = async () => {
            try {
                const res = await axios.get("https://ns-server.onrender.com/api/teacher/total");
                setTotalTeachers(res.data.totalTeachers);
            } catch (err) {
                console.error("Failed to fetch total teachers:", err);
            }
        };

        fetchAdmins();
        fetchTotalStudents();
        fetchTotalNotices();
        fetchTotalTeachers();
    }, []);

    return (
        <div className="bg-bg min-h-screen flex justify-center py-6 px-4">
            <div className="w-full max-w-5xl space-y-8">

                <section className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                    <div className="lg:w-1/2 space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold text-primary">NoticeSphere</h1>
                        <p className="text-sm sm:text-md text-textSubtle">
                            Centralizing all student notices and updates. Developed under the Web Engineering course at North East University Bangladesh.
                        </p>
                        <p className="text-sm sm:text-md text-textSubtle">
                            Our platform makes it effortless for students and faculty to stay informed, timely, and organized.
                        </p>
                    </div>
                    <div className="lg:w-1/2 w-full aspect-video bg-card rounded-md flex items-center justify-center overflow-hidden transition duration-300">
                        <img
                            src="/Display/illustration.png"
                            alt="NoticeSphere Illustration"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-card rounded-md p-6 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-primary">{totalStudents !== null ? `${totalStudents}+` : "..."}</h3>
                        <p className="text-textSubtle mt-1 text-sm sm:text-base">Students Connected</p>
                    </div>
                    <div className="bg-card rounded-md p-6 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-primary">{totalNotices !== null ? `${totalNotices}+` : "..."}</h3>
                        <p className="text-textSubtle mt-1 text-sm sm:text-base">Notices Shared</p>
                    </div>
                    <div className="bg-card rounded-md p-6 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-primary">{totalTeachers !== null ? `${totalTeachers}+` : "..."}</h3>
                        <p className="text-textSubtle mt-1 text-sm sm:text-base">Faculty Guides</p>
                    </div>
                </section>

                <section className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                    <div className="space-y-2 text-center lg:text-left order-1 lg:order-2">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-primary">Our Mission</h2>
                        <p className="text-sm sm:text-md text-textSubtle">
                            To streamline all student notices, enhance communication, and create a connected campus environment.
                        </p>
                    </div>
                    <div className="h-40 sm:h-52 lg:h-64 w-full lg:w-2/3 bg-card rounded-md flex items-center justify-center overflow-hidden order-2 lg:order-1">
                        <img
                            src="/Display/mission.png"
                            alt="Our Mission Illustration"
                            className="w-full h-full object-cover rounded-md transition-transform duration-300"
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary text-center mb-4">Tech Stack</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
                        <div className="bg-card rounded-md p-3 sm:p-4 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                            <FiCode size={28} className="text-primary mb-1" />
                            <h3 className="text-sm sm:text-md font-semibold text-primary">Frontend</h3>
                            <p className="text-textSubtle text-xs sm:text-sm">React.js, TailwindCSS</p>
                        </div>
                        <div className="bg-card rounded-md p-3 sm:p-4 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                            <FiServer size={28} className="text-primary mb-1" />
                            <h3 className="text-sm sm:text-md font-semibold text-primary">Backend</h3>
                            <p className="text-textSubtle text-xs sm:text-sm">Node.js, Express</p>
                        </div>
                        <div className="bg-card rounded-md p-3 sm:p-4 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                            <FiDatabase size={28} className="text-primary mb-1" />
                            <h3 className="text-sm sm:text-md font-semibold text-primary">Database</h3>
                            <p className="text-textSubtle text-xs sm:text-sm">MongoDB</p>
                        </div>
                        <div className="bg-card rounded-md p-3 sm:p-4 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                            <FiUsers size={28} className="text-primary mb-1" />
                            <h3 className="text-sm sm:text-md font-semibold text-primary">Authentication</h3>
                            <p className="text-textSubtle text-xs sm:text-sm">JWT, Bcrypt</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary text-center mb-4">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-center">
                        {[
                            ["Secure OTP Registration", "OTP-based verification for students, teachers, and admins ensures account security."],
                            ["Targeted Dashboards", "Personalized dashboards for students and teachers with relevant notices and analytics."],
                            ["Real-Time Notifications", "Instant alerts for new notices and comments, keeping users updated in real-time."],
                            ["Role-Based Notice Management", "Admins and teachers can target notices by department, batch, or specific users."],
                            ["Profile Management", "Users can securely update profiles and manage their information effortlessly."],
                            ["Secure Login", "Login system with brute-force protection and secure authentication mechanisms."]
                        ].map(([title, desc], i) => (
                            <div key={i} className="bg-card rounded-md p-3 sm:p-4 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center">
                                <h3 className="text-sm sm:text-md font-semibold text-primary">{title}</h3>
                                <p className="text-textFaint text-xs sm:text-sm italic">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center mb-6">Meet The Team</h2>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {admins.map((admin) => (
                            <div key={admin.id} className="bg-card rounded-md p-4 sm:p-6 shadow hover:bg-cardHover flex flex-col items-center justify-center text-center w-full sm:w-72">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-3 bg-cardHover flex items-center justify-center text-xl font-bold text-white overflow-hidden">
                                    {admin.avatar ? (
                                        <img src={admin.avatar} alt={`${admin.firstName} Avatar`} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src="/Fallback/avatar.png" alt="Default Avatar" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-primary">{admin.firstName} {admin.lastName}</h3>
                                {admin.adminRole && (
                                    <p className="text-textMain mt-1 font-medium">{admin.adminRole}</p>
                                )}
                                {admin.adminQuote && (
                                    <p className="text-textFaint italic mt-1 text-sm sm:text-base">{admin.adminQuote}</p>
                                )}
                                {admin.email && (
                                    <a href={`mailto:${admin.email}`} className="text-textSubtle text-sm sm:text-base hover:text-primary hover:underline mt-1">{admin.email}</a>
                                )}
                                {admin.adminGit && (
                                    <a href={admin.adminGit} target="_blank" rel="noopener noreferrer" className="mt-2 text-primary hover:text-textFaint"><FaGithub size={24} /></a>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center mb-6">Instructed By</h2>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                        <div className="bg-card rounded-md p-4 sm:p-6 shadow hover:bg-cardHover flex flex-col items-center justify-center sm:flex-row sm:items-center max-w-5xl w-full text-center sm:text-left">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-cardHover rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 overflow-hidden">
                                <img src="/Display/sir.jpg" alt="Instructor Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-1 sm:space-y-2">
                                <h3 className="text-lg sm:text-xl font-semibold text-primary">MD Jahidul Islam</h3>
                                <p className="text-textFaint italic text-sm sm:text-base mt-1">
                                    Guiding the team throughout the project development, mentoring them, and ensuring the highest quality standards.
                                </p>
                                <a href="mailto:jahid1213cvgc@gmail.com" className="text-textSubtle text-sm sm:text-base hover:text-primary hover:underline">jahid1213cvgc@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-primary text-center">North East University Bangladesh</h2>
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-card rounded-md flex items-center justify-center overflow-hidden">
                        <img
                            src="/Display/logo.jpg"
                            alt="NEUB Logo"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <p className="text-textSubtle text-sm sm:text-base max-w-4xl sm:max-w-5xl text-center">
                        North East University Bangladesh provides a supportive academic environment that encourages innovation, collaboration, and practical learning. Students are guided to develop skills, explore ideas, and engage in projects that prepare them for real-world challenges.
                    </p>
                </section>

            </div>
        </div>
    );
}

export default AboutUs;
