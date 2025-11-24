import nodemailer from "nodemailer";

const { BREVO_HOST, BREVO_PORT, BREVO_USER, BREVO_PASS } = process.env;

if (!BREVO_USER || !BREVO_PASS || !BREVO_HOST || !BREVO_PORT) {
    throw new Error("Environment variables BREVO_HOST, BREVO_PORT, BREVO_USER, BREVO_PASS must be set.");
}

const transporter = nodemailer.createTransport({
    host: BREVO_HOST,
    port: Number(BREVO_PORT),
    secure: true,
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
