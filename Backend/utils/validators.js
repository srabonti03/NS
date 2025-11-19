export function isEmailValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isPasswordStrong(password) {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}

export function isUserNameValid(name) {
    const nameRegex = /^[A-Za-z.\-\s]{2,40}$/;
    return typeof name === 'string' && nameRegex.test(name.trim());
}

