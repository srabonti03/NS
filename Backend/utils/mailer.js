import nodemailer from "nodemailer";

const { GMAIL_USER, GMAIL_PASS } = process.env;

if (!GMAIL_USER || !GMAIL_PASS) {
    throw new Error("Environment variables GMAIL_USER and GMAIL_PASS must be set.");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export async function sendOtpEmail(email, otp) {
    const mailOptions = {
        from: GMAIL_USER,
        to: email,
        subject: "Your One-Time Password (OTP)",
        text: `Your OTP is: ${otp}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #0056b3;">NoticeSphere OTP Verification</h2>
                <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
                <p>This OTP is valid for the next 10 minutes.</p>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}:`, info.messageId);
    } catch (error) {
        console.error("Failed to send OTP email:", error?.response || error);
        throw new Error("Unable to send OTP email. Please try again later.");
    }
}
