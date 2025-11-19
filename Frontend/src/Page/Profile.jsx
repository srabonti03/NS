import React, { useState, useEffect } from 'react';
import { FiEdit2, FiMail, FiSave, FiX } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';

function Profile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({});

    const getInitialFormData = () => {
        const baseData = {
            avatar: user?.avatar || '/Fallback/avatar.png',
            firstName: user?.firstName || '',
            lastName: user?.lastName || ''
        };
        if (user?.role === 'admin') {
            return { ...baseData, profession: user?.adminRole || '', quote: user?.adminQuote || '', adminGit: user?.adminGit || '' };
        } else if (user?.role === 'teacher') {
            return { ...baseData, dept: user?.dept || '' };
        } else if (user?.role === 'student') {
            return { ...baseData, session: user?.session || '', dept: user?.dept || '', section: user?.section || '', regNo: user?.regNo || '' };
        } else {
            return baseData;
        }
    };

    useEffect(() => {
        setFormData(getInitialFormData());
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
        const sessionRegex = /^(Summer|Winter|Spring|Fall)?\s?\d{2,4}$/i;
        const regNoRegex = /^\d+$/;
        const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/[\w\d-]*)*\/?$/;

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
        else if (!nameRegex.test(formData.firstName)) newErrors.firstName = 'Invalid first name.';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
        else if (!nameRegex.test(formData.lastName)) newErrors.lastName = 'Invalid last name.';
        if (formData.session && !sessionRegex.test(formData.session)) newErrors.session = 'Session should be like "Summer 22" or "2022".';
        if (formData.regNo && !regNoRegex.test(formData.regNo)) newErrors.regNo = 'Invalid registration number.';
        if (formData.adminGit && !urlRegex.test(formData.adminGit)) newErrors.adminGit = 'Invalid GitHub URL.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return toast.error('Please correct the highlighted fields.');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(f => {
                if (f === 'avatar' && formData[f] instanceof File) return;
                data.append(f, formData[f] !== undefined ? formData[f] : '');
            });
            if (formData.avatar instanceof File) {
                data.append('avatar', formData.avatar);
            }
            const response = await axios.put('http://localhost:5000/api/user/update-profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            updateUser(response.data.user);
            setFormData(prev => ({ ...prev }));
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile.');
        }
    };

    const handleCancel = () => {
        setFormData(getInitialFormData());
        setErrors({});
        setIsEditing(false);
    };

    const placeholders = {
        firstName: 'Enter First Name',
        lastName: 'Enter Last Name',
        session: 'Enter Session',
        dept: 'Enter Department',
        section: 'Enter Section',
        regNo: 'Enter Registration Number',
        profession: 'Enter Your Profession',
        quote: 'Say something about yourself',
        adminGit: 'Enter GitHub link'
    };

    return (
        <div className="min-h-[93vh] p-4 md:p-8 max-w-5xl mx-auto text-textMain space-y-6">
            <ToastContainer position="top-center" style={{ top: '50px' }} />
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 bg-card border border-borderSubtle shadow rounded-md transition-all">
                <div className="flex items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
                    <img
                        src={formData.avatar instanceof File ? URL.createObjectURL(formData.avatar) : formData.avatar}
                        alt="Avatar"
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-primary"
                    />
                    <div className="flex flex-col gap-1 w-full">
                        <h2 className="text-lg md:text-2xl font-bold tracking-tight">
                            {formData.firstName} {formData.lastName}
                        </h2>
                        <div className="flex items-center gap-2 text-textSubtle text-xs md:text-sm truncate">
                            <FiMail className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card border border-borderSubtle shadow rounded-md p-4 md:p-6 transition-all">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-normal tracking-wide">Personal Information</h3>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors">
                            <FiEdit2 className="w-3 h-3 md:w-4 md:h-4" /> Edit
                        </button>
                    ) : (
                        <div className="flex gap-1 md:gap-2">
                            <button onClick={handleSave} className="flex items-center gap-1 text-xs md:text-sm text-primary hover:text-primary/80 transition-colors">
                                <FiSave className="w-3 h-3 md:w-4 md:h-4" /> Save
                            </button>
                            <button onClick={handleCancel} className="flex items-center gap-1 text-xs md:text-sm text-red-500 hover:text-red-400 transition-colors">
                                <FiX className="w-3 h-3 md:w-4 md:h-4" /> Cancel
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {Object.keys(formData).map((field) => {
                        if (!isEditing && ['avatar', 'email'].includes(field)) return null;
                        if (field === 'email') return null;
                        return (
                            <div key={field} className="flex flex-col gap-1 p-2 md:p-3 rounded-md hover:bg-cardHover transition-colors">
                                <p className="text-textSubtle text-[0.625rem] md:text-xs uppercase">
                                    {field === 'adminGit' ? 'GitHub link' : field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                </p>
                                {isEditing && field === 'avatar' ? (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full px-2 md:px-3 py-1 md:py-2 rounded-md border border-borderSubtle bg-card text-textMain focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-xs md:text-sm"
                                    />
                                ) : isEditing ? (
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        placeholder={placeholders[field]}
                                        onChange={handleChange}
                                        className={`w-full px-2 md:px-3 py-1 md:py-2 rounded-md border ${errors[field]
                                            ? 'border-red-500 focus:ring-red-400/30'
                                            : 'border-borderSubtle focus:ring-primary/30'
                                            } bg-card text-textMain focus:outline-none focus:ring-1 transition-all text-xs md:text-sm`}
                                    />
                                ) : (
                                    <p className="font-medium truncate text-xs md:text-sm">{String(formData[field]) || '-'}</p>
                                )}
                                {errors[field] && <span className="text-red-500 text-[0.625rem] md:text-xs mt-1">{errors[field]}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Profile;
