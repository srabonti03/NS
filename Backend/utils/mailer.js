import nodemailer from "nodemailer";

const { BREVO_USER, BREVO_PASS } = process.env;

if (!BREVO_USER || !BREVO_PASS) {
    throw new Error("Environment variables BREVO_USER and BREVO_PASS must be set.");
}

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: BREVO_USER,
        pass: BREVO_PASS,
    },
});

export async function sendOtpEmail(email, otp) {
    const mailOptions = {
        from: `"NoticeSphere" <${BREVO_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
        html: `
            <div>
                <h2>Your OTP Code</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This code expires in 10 minutes.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (err) {
        console.error("Failed to send OTP:", err);
        throw err;
    }
}
