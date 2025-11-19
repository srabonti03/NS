import prisma from '../Config/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isEmailValid, isPasswordStrong } from '../utils/validators.js';
import { generateOtp, isOtpValid } from '../utils/otp.js';
import { sendOtpEmail } from '../utils/mailer.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// ======================= REGISTER =======================

// Register
export const registerUser = async (req, res) => {
    try {
        const { role, firstName, lastName, email, password, session, dept, section, regNo, secretCode } = req.body;

        if (!isEmailValid(email)) return res.status(400).json({ message: "Invalid email" });
        if (!isPasswordStrong(password)) return res.status(400).json({ message: "Weak password" });

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: "Email already registered" });
        }

        let finalRegNo = null;

        if (role === "student") {
            if (!regNo) return res.status(400).json({ message: "Registration Number is required for students" });

            const existingRegNo = await prisma.user.findUnique({ where: { regNo } });
            if (existingRegNo && existingRegNo.isVerified) return res.status(400).json({ message: "RegNo already registered" });

            finalRegNo = regNo;
        } else {
            finalRegNo = `no-reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }

        if (role === "admin") {
            const STATIC_ADMIN_SECRET = "NS-Adm!n-42Secure";
            if (secretCode !== STATIC_ADMIN_SECRET) {
                return res.status(401).json({ message: "Invalid secret code" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        let newUser;

        if (existingUser && !existingUser.isVerified) {
            newUser = await prisma.user.update({
                where: { email },
                data: {
                    firstName,
                    lastName,
                    password: hashedPassword,
                    role,
                    session: role === "student" ? session : null,
                    dept: role === "student" || role === "teacher" ? dept : null,
                    section: role === "student" ? section : null,
                    regNo: finalRegNo,
                    secretCode: role === "admin" ? secretCode : null,
                    otp,
                    otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
                },
            });
        } else {
            newUser = await prisma.$transaction(async (tx) => {
                return await tx.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                        role,
                        session: role === "student" ? session : null,
                        dept: role === "student" || role === "teacher" ? dept : null,
                        section: role === "student" ? section : null,
                        regNo: finalRegNo,
                        status: role === "teacher" ? "pending" : null,
                        isEnabled: role === "teacher" ? false : null,
                        secretCode: role === "admin" ? secretCode : null,
                        otp,
                        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
                    },
                });
            });
        }

        try {
            await sendOtpEmail(email, otp);
        } catch (emailErr) {
            console.error("OTP email failed:", emailErr);

            if (!existingUser) {
                await prisma.user.delete({ where: { id: newUser.id } });
            }

            return res.status(500).json({ message: "Failed to send OTP email, user not created" });
        }

        res.status(201).json({ message: `${role} registered successfully, OTP sent`, userId: newUser.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// ======================= LOGIN =======================

// Login
export const loginUser = async (req, res) => {
    try {
        const { email, regNo, password } = req.body;

        if (!email && !regNo) {
            return res.status(400).json({ message: "Email or Registration Number is required" });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    email ? { email } : {},
                    regNo ? { regNo } : {}
                ],
            },
        });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified) {
            return res.status(403).json({ message: "Account not verified. Please verify OTP first." });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 1000 * 60 * 60 * 24,
        });

        res.json({ message: "Login successful", role: user.role });
    } catch (err) {
        console.error("loginUser error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ======================= USER INFO =======================

export const getCurrentUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        console.error('getCurrentUser error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ======================= LOGOUT =======================

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// ======================= OTP HANDLING =======================

// OTP Verify
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (!isOtpValid(user.otp, user.otpExpiresAt) || user.otp !== otp.trim()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpiresAt: null, isVerified: true }
        });

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Reset OTP
export const resetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = generateOtp();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiresAt }
        });

        try {
            await sendOtpEmail(email, otp);
        } catch (emailErr) {
            console.error("Failed to send OTP:", emailErr);
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// Resend OTP
export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOtp();

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        });

        try {
            await sendOtpEmail(email, otp);
        } catch (emailErr) {
            console.error("Failed to resend OTP:", emailErr);
            return res.status(500).json({ message: "Failed to send OTP email" });
        }

        res.json({ message: "OTP resent successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Reset Password with OTP
export const resetPasswordWithOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        if (!isOtpValid(user.otp, user.otpExpiresAt) || user.otp !== otp.trim()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        if (!isPasswordStrong(newPassword)) {
            return res.status(400).json({ message: "Weak password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword, otp: null, otpExpiresAt: null }
        });

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error("resetPasswordWithOtp error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
