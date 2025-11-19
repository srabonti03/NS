import crypto from 'crypto';

export function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

export function isOtpValid(storedOtp, storedExpiry) {
    if (!storedOtp || !storedExpiry) return false;
    if (new Date() > storedExpiry) return false;
    return true;
}
