import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/email/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message. Please try again later.");
        }
    };

    return (
        <div className="bg-bg min-h-[90vh] flex justify-center py-8 px-4">
            <ToastContainer position="top-center" autoClose={3000} style={{ marginTop: "70px" }} />
            <div className="w-full max-w-5xl space-y-10">
                <section className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold text-primary mb-2">Contact Us</h2>
                    <p className="text-textSubtle text-sm sm:text-base">
                        We’d love to hear from you. Reach out for queries, feedback, or collaboration.
                    </p>
                </section>
                <section className="flex flex-col lg:flex-row gap-6">
                    <form
                        className="flex-1 bg-card rounded-md p-6 sm:p-10 flex flex-col gap-4"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="p-3 rounded-md bg-cardHover text-textMain placeholder:text-textSubtle border border-borderSubtle focus:outline-none focus:border-primary"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 rounded-md bg-cardHover text-textMain placeholder:text-textSubtle border border-borderSubtle focus:outline-none focus:border-primary"
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="p-3 rounded-md bg-cardHover text-textMain placeholder:text-textSubtle border border-borderSubtle focus:outline-none focus:border-primary"
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            className="p-3 rounded-md bg-cardHover text-textMain placeholder:text-textSubtle border border-borderSubtle focus:outline-none focus:border-primary h-32 resize-none"
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-primary text-white py-3 px-6 rounded-md hover:bg-btnHover transition"
                        >
                            Send Message
                        </button>
                    </form>
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="bg-card rounded-md p-6 sm:p-8 flex flex-col gap-3">
                            <p className="text-textSubtle flex items-center gap-2">
                                <FiMail className="text-primary" /> noticesphere@neub.edu.bd
                            </p>
                            <p className="text-textSubtle flex items-center gap-2">
                                <FiPhone className="text-primary" /> +880 1234 567890
                            </p>
                            <p className="text-textSubtle flex items-center gap-2">
                                <FiMapPin className="text-primary" /> North East University Bangladesh, Campus Road, Sylhet
                            </p>
                            <p className="text-textSubtle flex items-center gap-2">
                                <FiClock className="text-primary" /> Sun-Thurs, 9:00 AM – 5:00 PM
                            </p>
                        </div>
                        <iframe
                            src="https://www.google.com/maps?q=North+East+University+Bangladesh,+Campus+Road,+Sylhet&output=embed"
                            className="w-full h-64 rounded-md mt-4"
                            loading="lazy"
                        ></iframe>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ContactUs;
