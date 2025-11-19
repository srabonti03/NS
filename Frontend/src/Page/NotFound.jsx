import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[92vh] bg-bg px-4 sm:px-6 lg:px-8">
            <div className="bg-card shadow rounded-2xl p-6 sm:p-8 md:p-12 text-center max-w-sm sm:max-w-md md:max-w-lg w-full">
                <h1 className="text-5xl sm:text-6xl md:text-6xl font-heading font-bold text-error">
                    404
                </h1>
                <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-heading text-textSubtle">
                    Page Not Found
                </h2>
                <p className="mt-2 text-sm sm:text-base md:text-lg text-textFaint font-body">
                    The page you’re looking for doesn’t exist or may have been moved.
                </p>
                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-block bg-btn hover:bg-btnHover text-textMain font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow transition duration-200 text-sm sm:text-base"
                    >
                        Back to Notice Feed
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
