import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ override: true });

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

export async function sendOtpEmail(email, otp) {
    const mailOptions = {
        from: process.env.MAILTRAP_FROM,
        to: email,
        subject: "NoticeSphere OTP Verification",
        text: `Your OTP is: ${otp}`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3;">NoticeSphere OTP Verification</h2>
          <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
          <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}:`, info.messageId);
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw new Error("Unable to send OTP email. Please try again later.");
    }
}
