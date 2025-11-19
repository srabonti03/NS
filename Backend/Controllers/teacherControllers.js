import prisma from '../Config/prismaClient.js';

// Controller to get total number of teachers
export const getTotalTeachers = async (req, res) => {
    try {
        const totalTeachers = await prisma.user.count({
            where: {
                role: 'teacher'
            }
        });

        res.status(200).json({ totalTeachers });
    } catch (error) {
        console.error('Error fetching total teachers:', error);
        res.status(500).json({ message: 'Failed to fetch total teachers.' });
    }
};
