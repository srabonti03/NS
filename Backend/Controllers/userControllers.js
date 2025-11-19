import bcrypt from 'bcryptjs';
import prisma from '../Config/prismaClient.js';
import cloudinary from '../Config/cloudinaryConfig.js';
import fs from 'fs';

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            firstName,
            lastName,
            session,
            dept,
            section,
            regNo,
            profession,
            quote,
            adminGit
        } = req.body;

        const updatedData = {};

        if (firstName !== undefined) updatedData.firstName = firstName;
        if (lastName !== undefined) updatedData.lastName = lastName;
        if (session !== undefined) updatedData.session = session;
        if (dept !== undefined) updatedData.dept = dept;
        if (section !== undefined) updatedData.section = section;
        if (regNo !== undefined) updatedData.regNo = regNo;
        if (profession !== undefined) updatedData.adminRole = profession;
        if (quote !== undefined) updatedData.adminQuote = quote;
        if (adminGit !== undefined) updatedData.adminGit = adminGit;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'NoticeSphere/User',
                public_id: `${userId}-${Date.now()}`,
                overwrite: true
            });
            updatedData.avatar = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData
        });

        res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error('updateProfile error:', err);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Both password fields are required.' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err) {
        console.error('changePassword error:', err);
        res.status(500).json({ message: 'Failed to change password.' });
    }
};