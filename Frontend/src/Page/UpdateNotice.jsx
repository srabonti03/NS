import React, { useState, useEffect } from 'react';
import { FiX, FiTag } from 'react-icons/fi';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

function UpdateNotice() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [sessionOptions, setSessionOptions] = useState([]);
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [sectionOptions, setSectionOptions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);
    const [formData, setFormData] = useState({
        text: '',
        image: null,
        category: '',
        target: 'all',
        session: 'all',
        department: 'all',
        section: 'all',
        removeImage: false,
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [existingImage, setExistingImage] = useState(null);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const res = await axios.get('https://ns-server.onrender.com/api/notice/options', {
                    withCredentials: true,
                });
                setSessionOptions(res.data.sessions || []);
                setDepartmentOptions(res.data.departments || []);
                setSectionOptions(res.data.sections || []);
                setCategorySuggestions(res.data.categories || []);
            } catch (err) {
                console.error('Error fetching notice options:', err);
                toast.error('Failed to fetch options');
            }
        };
        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.get(`https://ns-server.onrender.com/api/notice/${id}`, {
                    withCredentials: true,
                });
                const notice = res.data;
                setFormData({
                    text: notice.text || '',
                    image: null,
                    category: notice.category || '',
                    target: notice.target || 'all',
                    session: notice.session || 'all',
                    department: notice.department || 'all',
                    section: notice.section || 'all',
                    removeImage: false,
                });
                setExistingImage(notice.image || null);
            } catch (err) {
                console.error('Error fetching notice:', err);
                toast.error('Failed to fetch notice');
            }
        };
        fetchNotice();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
        if (name === 'category') setShowSuggestions(value.length > 0);
    };

    const handleSelectSuggestion = (suggestion) => {
        setFormData({ ...formData, category: suggestion });
        setShowSuggestions(false);
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: null, removeImage: true });
        setExistingImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('text', formData.text);
            data.append('category', formData.category);
            data.append('target', formData.target);
            if (formData.target === 'students' || formData.target === 'teachers' || formData.target === 'all') {
                data.append('department', formData.department);
                if (formData.target === 'students') data.append('session', formData.session);
                if (formData.target === 'students') data.append('section', formData.section);
            }
            if (formData.removeImage) data.append('removeImage', 'true');
            if (formData.image) data.append('image', formData.image);

            const res = await axios.put(`https://ns-server.onrender.com/api/notice/update/${id}`, data, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success(res.data.message || 'Notice updated successfully');

            setTimeout(() => navigate(-1), 1000);
        } catch (err) {
            console.error('Error updating notice:', err);
            toast.error(err.response?.data?.message || 'Failed to update notice');
        }
    };

    const filteredSuggestions = categorySuggestions.filter(
        (cat) =>
            cat.toLowerCase().includes(formData.category.toLowerCase()) &&
            cat.toLowerCase() !== formData.category.toLowerCase()
    );

    return (
        <div className="min-h-[90vh] bg-bg flex flex-col items-start py-4 px-3 md:py-3 md:px-2 sm:py-2 sm:px-2 xs:py-2 xs:px-2">
            <ToastContainer
                position="top-center"
                style={{ top: '60px', zIndex: 999999 }}
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className={`w-full flex flex-col lg:flex-row gap-6 md:gap-4 sm:gap-3 xs:gap-2 justify-center ${formData.image || existingImage ? 'max-w-5xl mx-auto' : 'max-w-4xl mx-auto'}`}>
                <form
                    onSubmit={handleSubmit}
                    className={`flex-1 ${formData.image || existingImage ? 'lg:max-w-[50%]' : ''} p-4 lg:p-8 md:p-3 sm:p-2 xs:p-2 hide-scrollbar overflow-y-auto lg:max-h-[85vh]`}
                >
                    <div className="mb-4 md:mb-3 sm:mb-2 xs:mb-2">
                        <label className="block text-textSubtle text-sm mb-1">Notice Content</label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            placeholder="Write your notice here..."
                            className="w-full p-2.5 lg:p-4 md:p-2 sm:p-1.5 xs:p-1.5 border border-borderSubtle rounded-lg focus:border-primary outline-none text-textMain bg-[var(--bg-color)] resize-none"
                            rows="4"
                            required
                        />
                    </div>

                    <div className="mb-4 md:mb-3 sm:mb-2 xs:mb-2">
                        <label className="block text-textSubtle text-sm mb-1">Upload an Image (Optional)</label>
                        <div className="w-full border border-borderSubtle rounded-lg overflow-hidden bg-[var(--bg-color)] flex items-center px-2 lg:px-3 md:px-2 sm:px-1.5 xs:px-1.5 py-1.5 lg:py-2 md:py-1 sm:py-1 xs:py-1 cursor-pointer hover:shadow-sm transition">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full text-textMain file:mr-3 lg:file:mr-4 md:file:mr-2 sm:file:mr-1.5 xs:file:mr-1.5 file:py-1.5 lg:file:py-2 md:file:py-1 sm:file:py-1 xs:file:py-1 file:px-3 lg:file:px-4 md:file:px-2 sm:file:px-1.5 file:rounded-full file:border-0 file:bg-btn file:text-textMain hover:file:bg-btnHover transition cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="mb-4 md:mb-3 sm:mb-2 xs:mb-2 relative">
                        <label className="block text-textSubtle text-sm mb-1">Category</label>
                        <div className="flex items-center border border-borderSubtle rounded-lg bg-[var(--bg-color)] px-2 lg:px-3 md:px-2 sm:px-1.5 xs:px-1.5 py-1.5 lg:py-2 md:py-1 sm:py-1 xs:py-1">
                            <FiTag className="text-textSubtle mr-2 w-5 h-5" />
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Enter category"
                                className="w-full bg-[var(--bg-color)] text-textMain outline-none border-none p-0"
                            />
                        </div>
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <ul className="absolute z-50 w-full bg-[var(--bg-color)] border border-borderSubtle rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                                {filteredSuggestions.map((suggestion) => (
                                    <li
                                        key={suggestion}
                                        className="px-3 py-2 cursor-pointer hover:bg-btnHover transition"
                                        onClick={() => handleSelectSuggestion(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mb-4 md:mb-3 sm:mb-2 xs:mb-2">
                        <label className="block text-textSubtle text-sm mb-1">Select Who Should See This</label>
                        <select
                            name="target"
                            value={formData.target}
                            onChange={handleChange}
                            className="w-full p-2.5 lg:p-3 md:p-2 sm:p-1.5 xs:p-1.5 border border-borderSubtle rounded-lg focus:border-primary outline-none text-textMain bg-[var(--bg-color)]"
                        >
                            <option value="all">Everyone</option>
                            <option value="teachers">Teachers Only</option>
                            <option value="students">Students Only</option>
                        </select>
                    </div>

                    {(formData.target === "all" || formData.target === "teachers" || formData.target === "students") && (
                        <div className="mb-3 md:mb-2 sm:mb-2 xs:mb-2">
                            <label className="block text-textSubtle text-sm mb-1">Select Department</label>
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full p-2.5 lg:p-3 md:p-2 sm:p-1.5 xs:p-1.5 border border-borderSubtle rounded-lg focus:border-primary outline-none text-textMain bg-[var(--bg-color)]"
                            >
                                <option value="all">All Departments</option>
                                {departmentOptions.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {formData.target === "students" && (
                        <>
                            <div className="mb-3 md:mb-2 sm:mb-2 xs:mb-2">
                                <label className="block text-textSubtle text-sm mb-1">Select Session</label>
                                <select
                                    name="session"
                                    value={formData.session}
                                    onChange={handleChange}
                                    className="w-full p-2.5 lg:p-3 md:p-2 sm:p-1.5 xs:p-1.5 border border-borderSubtle rounded-lg focus:border-primary outline-none text-textMain bg-[var(--bg-color)]"
                                >
                                    <option value="all">All Sessions</option>
                                    {sessionOptions.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3 md:mb-2 sm:mb-2 xs:mb-2">
                                <label className="block text-textSubtle text-sm mb-1">Select Section (Optional)</label>
                                <select
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    className="w-full p-2.5 lg:p-3 md:p-2 sm:p-1.5 xs:p-1.5 border border-borderSubtle rounded-lg focus:border-primary outline-none text-textMain bg-[var(--bg-color)]"
                                >
                                    <option value="all">All Sections</option>
                                    {sectionOptions.map((sec) => (
                                        <option key={sec} value={sec}>{sec}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2.5 lg:py-3 md:py-2 sm:py-1.5 xs:py-1.5 bg-btn text-textSubtle hover:text-textMain rounded-lg font-medium hover:bg-btnHover transition"
                    >
                        Update Notice
                    </button>
                </form>

                {(formData.image || existingImage) && (
                    <div className="flex justify-center items-start w-full lg:w-auto p-4 lg:p-8 md:p-3 sm:p-2 xs:p-2">
                        <div className="relative w-full max-w-lg h-auto lg:h-[70vh] border border-borderSubtle rounded-2xl overflow-hidden shadow hover:shadow-hover transition">
                            <img
                                src={formData.image ? URL.createObjectURL(formData.image) : existingImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-white rounded-md p-1 shadow hover:bg-gray-100 transition"
                            >
                                <FiX className="text-textMain w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdateNotice;
