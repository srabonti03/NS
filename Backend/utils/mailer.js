import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
dotenv.config({ override: true });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOtpEmail(email, otp) {
    const msg = {
        to: email,
        from: 'srabonti.talukdar2003@gmail.com',
        subject: 'NoticeSphere OTP Verification',
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
        await sgMail.send(msg);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error('Failed to send OTP email:', error);
        throw new Error('Unable to send OTP email. Please try again later.');
    }
}
