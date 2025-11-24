import SibApiV3Sdk from "sib-api-v3-sdk";

if (!process.env.BREVO_API_KEY) {
    throw new Error("Environment variable BREVO_API_KEY must be set.");
}

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendOtpEmail(email, otp) {
    const sendSmtpEmail = {
        sender: { name: "NoticeSphere", email: "your_verified_sender_email@domain.com" },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `<div>
            <h2>Your OTP Code</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This code expires in 10 minutes.</p>
        </div>`,
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`OTP email sent to ${email}`);
    } catch (err) {
        console.error("Failed to send OTP:", err.response?.body || err);
        throw err;
    }
}
