// server.js
import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import your routes
import authRoutes from './Routes/authRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import adminRoutes from "./Routes/adminRoutes.js";
import studentRoutes from "./Routes/studentRoutes.js";
import teacherRoutes from "./Routes/teacherRoutes.js";
import noticeRoutes from "./Routes/noticeRoutes.js";
import likeRoutes from "./Routes/likeRoutes.js";
import commentRoutes from "./Routes/commentRoutes.js";
import notificationRoutes from "./Routes/notificationRoutes.js";
import shareRoutes from "./Routes/shareRoutes.js";
import emailRoutes from "./Routes/emailRoutes.js";

const app = express();

app.set('trust proxy', 1);

if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
        if (req.header("x-forwarded-proto") !== "https") {
            return res.redirect(`https://${req.header("host")}${req.url}`);
        }
        next();
    });
}

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/notice', noticeRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/email', emailRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
