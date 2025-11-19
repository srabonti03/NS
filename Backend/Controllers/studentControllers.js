import prisma from '../Config/prismaClient.js';

// Controller to get total number of students
export const getTotalStudents = async (req, res) => {
    try {
        const totalStudents = await prisma.user.count({
            where: {
                role: 'student'
            }
        });

        res.status(200).json({ totalStudents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch total students.' });
    }
};
