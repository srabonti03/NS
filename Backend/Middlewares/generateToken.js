import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export function generateToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            name: user.name,
            verified: user.verified,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}
