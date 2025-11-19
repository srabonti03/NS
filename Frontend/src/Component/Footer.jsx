import React from "react";
import { NavLink } from "react-router-dom";
import { FiMail, FiArrowUp } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";

function Footer() {
    const { user } = useAuth();

    const commonLinks = [{ name: "Notices", path: "/" }];
    const teacherLinks =
        user?.role === "teacher" && user.status !== "pending"
            ? [{ name: "My Notices", path: "/my-notices" }]
            : [];
    const adminLinks =
        user?.role === "admin"
            ? [
                  { name: "Insights", path: "/insights" },
                  { name: "My Notices", path: "/my-notices" },
              ]
            : [];

    const publicLinks = [
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    const allLinks = [
        ...commonLinks,
        ...teacherLinks,
        ...adminLinks.filter(
            (link, index, self) => index === self.findIndex((l) => l.name === link.name)
        ),
        ...publicLinks,
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-layoutBg text-textMain font-body border-t border-borderSubtle shadow">
            <div className="container mx-auto px-4 py-6 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start justify-center gap-3">
                    <img
                        src="Display/noticesphere.png"
                        alt="NoticeSphere"
                        className="w-16 h-16"
                    />
                    <h1 className="text-xl font-heading font-bold text-primary">
                        NoticeSphere
                    </h1>
                    <p className="text-textSubtle text-sm italic max-w-[200px]">
                        “Connecting campus. One notice at a time.”
                    </p>
                </div>

                <div className="flex flex-col items-center justify-center gap-3">
                    <h2 className="text-lg font-semibold mb-2 text-primary">
                        Quick Links
                    </h2>
                    {user?.role === "teacher" && user.status === "pending" ? (
                        <NavLink
                            to="/pending"
                            onClick={scrollToTop}
                            className="hover:text-primary transition duration-200"
                        >
                            Pending
                        </NavLink>
                    ) : (
                        allLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={scrollToTop}
                                className="hover:text-primary transition duration-200"
                            >
                                {link.name}
                            </NavLink>
                        ))
                    )}
                </div>

                <div className="flex flex-col items-center sm:items-end justify-center gap-3">
                    <h2 className="text-lg font-semibold text-primary">Get in Touch</h2>
                    <div className="flex flex-col items-center sm:items-end gap-2">
                        <div className="flex items-center gap-2 text-textSubtle hover:text-primary transition duration-200">
                            <FiMail /> <span>noticesphere@neub.edu.bd</span>
                        </div>
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-1 mt-5 text-textSubtle hover:text-primary transition duration-200 border border-borderSubtle rounded-full sm:px-5 sm:py-1.5 px-3 py-1"
                        >
                            <FiArrowUp /> Back to Top
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <div className="w-[90%] border-t border-borderMain"></div>
            </div>

            <div className="text-center py-4 text-sm text-textSubtle">
                © {new Date().getFullYear()} NoticeSphere. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
