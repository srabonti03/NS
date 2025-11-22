import nodemailer from "nodemailer";

const { GMAIL_USER, GMAIL_APP } = process.env;

if (!GMAIL_USER || !GMAIL_APP) {
    throw new Error(
        "Environment variables GMAIL_USER and GMAIL_APP must be set."
    );
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export async function sendOtpEmail(email, otp) {
    const mailOptions = {
        from: `"NoticeSphere Academic Portal" <${GMAIL_USER}>`,
        to: email,
        subject: "Your One-Time Password (OTP)",
        text: `Hello,

Your OTP code is: ${otp}

This code is valid for 10 minutes. If you did not request this, please ignore this email.

Thank you,
NoticeSphere Team`,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">NoticeSphere OTP Verification</h2>
            <p>Hello,</p>
            <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
            <p>If you did not request this OTP, kindly ignore this email.</p>
            <br/>
            <p style="font-size: 0.9em; color: #555;">NoticeSphere Academic Portal</p>
        </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email successfully sent to ${email}`, info.messageId);
    } catch (error) {
        console.error("Failed to send OTP email:", error.response || error);
        throw new Error("Unable to send OTP email. Please try again later.");
    }
}
