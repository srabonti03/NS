import React from 'react';

function Pending() {
    return (
        <div className="h-[88vh] flex flex-col justify-center items-center bg-bg px-4">
            <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow hover:shadow-hover transition duration-500 text-center">
                <h1 className="text-3xl font-heading font-bold text-primary mb-4">
                    Access Pending
                </h1>
                <p className="text-textSubtle mb-6">
                    Your account is currently under review by the admin. Once accepted, you will be able to access all features including posting notices and viewing the notice feed.
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        disabled
                        className="w-full bg-btn hover:bg-btnHover text-textSubtle hover:text-textMain font-heading p-3 rounded-lg shadow cursor-not-allowed opacity-70"
                    >
                        Post Notice (Disabled)
                    </button>
                    <button
                        disabled
                        className="w-full bg-btn hover:bg-btnHover text-textSubtle hover:text-textMain font-heading p-3 rounded-lg shadow cursor-not-allowed opacity-70"
                    >
                        Notice Feed (Disabled)
                    </button>
                </div>

                <p className="mt-6 text-textFaint text-xs">
                    Please wait patiently while the admin reviews your account. You will receive a notification once your account is accepted.
                </p>
            </div>
        </div>
    );
}

export default Pending;
