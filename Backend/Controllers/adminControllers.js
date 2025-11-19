import prisma from "../Config/prismaClient.js";

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "teacher" },
      select: {
        id: true,
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        isEnabled: true,
      },
    });
    res.json(teachers);
  } catch (err) {
    console.error("getAllTeachers error:", err);
    res.status(500).json({ message: "Error fetching teachers" });
  }
};

// Approve a teacher
export const approveTeacher = async (req, res) => {
  try {
    const teacher = await prisma.user.update({
      where: { id: req.params.id },
      data: { status: "accepted", isEnabled: true },
    });
    res.json(teacher);
  } catch (err) {
    console.error("approveTeacher error:", err);
    res.status(500).json({ message: "Error approving teacher" });
  }
};

// Disable/Enable a teacher
export const toggleTeacherStatus = async (req, res) => {
  try {
    const { enabled } = req.body;
    const teacher = await prisma.user.update({
      where: { id: req.params.id },
      data: { isEnabled: enabled },
    });
    res.json(teacher);
  } catch (err) {
    console.error("toggleTeacherStatus error:", err);
    res.status(500).json({ message: "Error updating teacher status" });
  }
};

// Reject (delete) a teacher
export const rejectTeacher = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "Teacher rejected and removed" });
  } catch (err) {
    console.error("rejectTeacher error:", err);
    res.status(500).json({ message: "Error rejecting teacher" });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        dept: true,
        isEnabled: true,
        status: true,
        createdAt: true,
        notices: { select: { id: true } }
      }
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const totalNotices = teacher.notices.length;
    res.json({ ...teacher, totalNotices });
  } catch (err) {
    console.error("getTeacherById error:", err);
    res.status(500).json({ message: "Error fetching teacher" });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: "student" },
      select: {
        id: true,
        avatar: true,
        firstName: true,
        lastName: true,
        email: true,
        session: true,
        dept: true,
        section: true,
        regNo: true,
        isEnabled: true,
      },
    });
    res.json(students);
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        email: true,
        session: true,
        dept: true,
        section: true,
        regNo: true,
        isEnabled: true,
        createdAt: true,
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error("getStudentById error:", err);
    res.status(500).json({ message: "Error fetching student" });
  }
};

// Enable/Disable a student
export const toggleStudentStatus = async (req, res) => {
  try {
    const { enabled } = req.body;
    const student = await prisma.user.update({
      where: { id: req.params.id },
      data: { isEnabled: enabled },
    });
    res.json(student);
  } catch (err) {
    console.error("toggleStudentStatus error:", err);
    res.status(500).json({ message: "Error updating student status" });
  }
};

// Insights
export const getInsights = async (req, res) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "teacher" },
      select: { status: true }
    });
    const totalTeachers = teachers.length;
    const teacherStatus = teachers.reduce(
      (acc, t) => {
        if (t.status === "accepted") acc[0].count += 1;
        else acc[1].count += 1;
        return acc;
      },
      [
        { status: "Active", count: 0 },
        { status: "Pending", count: 0 }
      ]
    );

    const totalStudents = await prisma.user.count({ where: { role: "student" } });

    const notices = await prisma.notice.findMany({
      select: { category: true }
    });
    const totalNotices = notices.length;

    const categoryCounts = {};
    notices.forEach(n => {
      categoryCounts[n.category] = (categoryCounts[n.category] || 0) + 1;
    });

    const noticesByCategory = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat]
    }));

    res.json({
      totalStudents,
      totalTeachers,
      totalNotices,
      noticesByCategory,
      teacherStatus
    });
  } catch (err) {
    console.error("getInsights error:", err);
    res.status(500).json({ message: "Error fetching insights" });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        adminRole: true,
        adminQuote: true,
        adminGit: true,
      },
    });
    res.json(admins);
  } catch (err) {
    console.error("getAllAdmins error:", err);
    res.status(500).json({ message: "Error fetching admins" });
  }
};

