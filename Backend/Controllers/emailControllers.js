import nodemailer from "nodemailer";
import prisma from "../Config/prismaClient.js";

const { GMAIL_USER, GMAIL_PASS } = process.env;

// Send email using Gmail SMTP
export const sendEmail = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ message: "Unauthorized: User not found in token" });
        if (!subject || !message) return res.status(400).json({ message: "Subject and message are required" });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        const userName = `${user.firstName} ${user.lastName}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
            secure: true,
        });

        const mailOptions = {
            from: `"${userName}" <${user.email}>`,
            to: GMAIL_USER,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <h3>📩 New Message from ${userName}</h3>
                  <p><strong>Email:</strong> ${user.email}</p>
                  <p><strong>Subject:</strong> ${subject}</p>
                  <p><strong>Message:</strong></p>
                  <p>${message}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send email" });
    }
};
