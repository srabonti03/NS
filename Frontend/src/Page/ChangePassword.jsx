import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export function isPasswordStrong(password) {
    const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongRegex.test(password);
}

function ChangePassword() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.newPassword) newErrors.newPassword = 'New password is required.';
        else if (!isPasswordStrong(formData.newPassword)) newErrors.newPassword = 'Password must be at least 8 characters, include 1 uppercase letter and 1 number.';
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
        else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return toast.error('Ensure all fields are valid before submitting.');

        try {
            setIsSubmitting(true);
            const response = await axios.put(
                'http://localhost:5000/api/user/change-password',
                formData,
                { withCredentials: true }
            );
            toast.success(response.data.message || 'Password changed successfully!');
            setFormData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg p-4">
            <ToastContainer position="top-center" style={{ top: '80px' }} />
            <div className="w-full max-w-md bg-card border border-borderSubtle shadow rounded-md p-6">
                <h2 className="text-xl font-bold mb-6 text-textMain">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-textSubtle text-sm">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-md border ${errors.newPassword ? 'border-error focus:ring-error/30' : 'border-borderSubtle focus:ring-primary/30'} bg-bg text-textMain focus:outline-none focus:ring-1 transition-all`}
                        />
                        {errors.newPassword && <span className="text-error text-xs">{errors.newPassword}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-textSubtle text-sm">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 rounded-md border ${errors.confirmPassword ? 'border-error focus:ring-error/30' : 'border-borderSubtle focus:ring-primary/30'} bg-bg text-textMain focus:outline-none focus:ring-1 transition-all`}
                        />
                        {errors.confirmPassword && <span className="text-error text-xs">{errors.confirmPassword}</span>}
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-4 py-2 bg-btn text-btnText rounded-md hover:bg-btnHover transition-colors"
                        >
                            <FiSave className="w-4 h-4" /> {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ newPassword: '', confirmPassword: '' })}
                            className="flex items-center gap-1 px-4 py-2 text-error rounded-md hover:text-red-400 transition-colors border border-error/30"
                        >
                            <FiX className="w-4 h-4" /> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
