import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyTokenMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        console.error('verifyTokenMiddleware error:', err);
        return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
    }
};
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    next();
};

