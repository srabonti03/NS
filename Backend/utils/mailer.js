import SibApiV3Sdk from "sib-api-v3-sdk";

if (!process.env.BREVO_API_KEY || !process.env.BREVO_USER) {
    throw new Error("Environment variables BREVO_API_KEY and BREVO_USER must be set.");
}

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendOtpEmail(email, otp) {
    const sendSmtpEmail = {
        sender: { name: "NoticeSphere", email: process.env.BREVO_USER },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">NoticeSphere OTP Verification</h2>
        <p>Hello,</p>
        <p>Your one-time password (OTP) is: <strong>${otp}</strong></p>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        <br/>
        <p style="font-size: 0.9em; color: #555;">NoticeSphere Academic Portal</p>
      </div>
    `,
    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`OTP email sent to ${email}`);
    } catch (err) {
        console.error("Failed to send OTP:", err);
        throw err;
    }
}
