import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
    ChevronLeft, User, Phone, Mail, MapPin, LogOut,
    Edit, Send, X, GraduationCap, Hash, Lock, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI, schoolAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const SchoolAccount = () => {
    const navigate = useNavigate();

    // Initial state from local storage to prevent flicker
    const [profileData, setProfileData] = useState(() => {
        const savedUser = localStorage.getItem('wesal_user_data');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loadingProfile, setLoadingProfile] = useState(false);

    // Modal and loading states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [editForm, setEditForm] = useState({ email: '', contactNumber: '' });
    const [editLoading, setEditLoading] = useState(false);

    // Change password states
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passLoading, setPassLoading] = useState(false);
    const [passError, setPassError] = useState('');
    const [passSuccess, setPassSuccess] = useState('');

    const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
            const res = await schoolAPI.getCurrentSchool();
            setProfileData(res.data);
            localStorage.setItem('wesal_user_data', JSON.stringify(res.data));
            setEditForm({
                email: res.data?.email || '',
                contactNumber: res.data?.contactNumber || ''
            });
        } catch (error) {
            console.error("Failed to refresh profile data", error);
        } finally {
            setLoadingProfile(false);
        }
    };

    // 1. Fetch updated user data from server on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    // Merge real data with fallback
    const displayInfo = {
        name: profileData?.name || 'Unspecified School',
        schoolCode: profileData?.username || (profileData?.id ? profileData.id.substring(0, 8).toUpperCase() : '---'),
        phone: profileData?.contactNumber || '---',
        email: profileData?.email || '---',
        location: [profileData?.governorate, profileData?.address].filter(Boolean).join(' - ') || '---'
    };

    // --- Logout Handlers ---
    const handleLogout = () => {
        localStorage.removeItem('wesal_school_token');
        localStorage.removeItem('wesal_token');
        localStorage.removeItem('wesal_user_data');
        localStorage.removeItem('wesal_user_role');
        navigate('/vision-login');
    };

    // --- Change Password Handlers ---
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
            setPassError('Please fill in all fields');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPassError('New passwords do not match');
            return;
        }

        setPassLoading(true);
        setPassError('');
        setPassSuccess('');

        try {
            await authAPI.changePassword({
                oldPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            setPassSuccess('Password changed successfully');
            toast.success('Password updated successfully');
            setTimeout(() => {
                setShowPasswordModal(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPassSuccess('');
            }, 2000);

        } catch (err) {
            console.error(err);
            setPassError(err.response?.data?.detail || err.response?.data?.title || 'Failed to change password');
        } finally {
            setPassLoading(false);
        }
    };

    // --- Profile Edit Handlers ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            await schoolAPI.updateSchoolProfile(profileData.id, editForm);
            toast.success('Profile updated successfully');
            setShowEditModal(false);
            fetchProfile(); // Refresh data
        } catch (error) {
            console.error("Update Error:", error);
            toast.error(error.response?.data?.detail || 'Failed to update profile');
        } finally {
            setEditLoading(false);
        }
    };

    if (loadingProfile && !profileData) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
                <Sidebar />
                <div className="flex-1 flex justify-center items-center ml-24">
                    <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex font-sans" dir="rtl">
            <Sidebar />

            <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">

                    {/* --- Header --- */}
                    <div className="relative w-full bg-[#1e3a8a] rounded-[2.5rem] p-8 text-white flex items-center justify-between overflow-hidden shadow-xl mb-8">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2 opacity-50"></div>

                        <div className="flex items-center gap-6 relative z-10 text-right">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all border-none"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>

                            <div>
                                <h1 className="text-3xl font-bold mb-1">حسابي</h1>
                                <p className="text-blue-200 text-sm font-medium opacity-90">إدارة ملف تعريف المدرسة وإعدادات الأمان</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Profile Card */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-center relative overflow-hidden border border-gray-100/50">
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-white z-0"></div>

                                <div className="relative z-10 w-32 h-32 bg-white p-1.5 rounded-[2.5rem] shadow-xl mx-auto mb-6 border border-blue-50">
                                    <div className="w-full h-full bg-blue-50 rounded-[2.2rem] flex items-center justify-center">
                                        <GraduationCap className="w-14 h-14 text-[#1e3a8a]" />
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{displayInfo.name}</h2>
                                </div>

                                <div className="mt-10 pt-8 border-t border-gray-100 relative z-10 space-y-4">
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-[#1e3a8a] h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-gray-200/50"
                                    >
                                        <Lock className="w-4 h-4" />
                                        تغيير كلمة المرور
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-red-100"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        تسجيل الخروج
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100/50 text-right">
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100/50">
                                    <h3 className="text-2xl font-bold text-gray-800">المعلومات الأساسية</h3>
                                    <button
                                        onClick={() => {
                                            setEditForm({
                                                email: profileData?.email || '',
                                                contactNumber: profileData?.contactNumber || ''
                                            });
                                            setShowEditModal(true);
                                        }}
                                        className="flex items-center gap-2 bg-blue-50 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white px-5 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm border border-blue-100"
                                    >
                                        <Edit className="w-4 h-4" />
                                        تعديل
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoRow icon={Hash} label="اسم مستخدم المدرسة" value={displayInfo.schoolCode} />
                                    <InfoRow icon={User} label="الاسم الرسمي" value={displayInfo.name} />
                                    <InfoRow icon={Phone} label="هاتف التواصل" value={displayInfo.phone} />
                                    <InfoRow icon={Mail} label="البريد الإلكتروني الرسمي" value={displayInfo.email} />
                                </div>

                                <div className="mt-6">
                                    <InfoRow icon={MapPin} label="موقع المدرسة" value={displayInfo.location} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Edit Profile Modal */}
            {showEditModal && (
                <ModalWrapper title="تعديل الملف الشخصي" onClose={() => setShowEditModal(false)}>
                    <form onSubmit={handleUpdateProfile} className="space-y-6 text-right py-2">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pr-2">البريد الإلكتروني الرسمي</label>
                            <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pr-2">رقم التواصل</label>
                            <input
                                type="text"
                                value={editForm.contactNumber}
                                onChange={e => setEditForm({ ...editForm, contactNumber: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="flex gap-4 mt-8 pt-4">
                            <button
                                type="submit"
                                disabled={editLoading}
                                className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {editLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'حفظ التغييرات'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </ModalWrapper>
            )}

            {showPasswordModal && (
                <ModalWrapper title="تغيير كلمة المرور" onClose={() => setShowPasswordModal(false)}>
                    <form onSubmit={handleChangePassword} className="space-y-5 text-right py-2">
                        {passError && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl text-center border border-red-100">{passError}</div>}
                        {passSuccess && <div className="p-4 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-2xl text-center border border-emerald-100">{passSuccess}</div>}

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pr-2">كلمة المرور الحالية</label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pr-2">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-mono"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest pr-2">تأكيد كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-mono"
                                required
                            />
                        </div>

                        <div className="flex gap-4 mt-8 pt-4">
                            <button
                                type="submit"
                                disabled={passLoading}
                                className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {passLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <><Lock className="w-4 h-4" /> حفظ التحسينات</>}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPasswordModal(false)}
                                className="flex-1 bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </ModalWrapper>
            )}
        </div>
    );
}

// --- Helper Components ---

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-5 p-6 bg-gray-50/50 border border-gray-100/50 rounded-3xl hover:bg-white hover:border-blue-100 hover:shadow-md transition-all duration-300 text-left group">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300">
                <Icon className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">{label}</p>
                <p className="font-bold text-gray-800 md:text-lg truncate">{value || 'Not available'}</p>
            </div>
        </div>
    );
}

function ModalWrapper({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[120] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-[#1e3a8a] p-8 text-white flex justify-between items-center text-left">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors border-none"><X className="w-6 h-6" /></button>
                </div>
                <div className="p-8">{children}</div>
            </div>
        </div>
    );
}

export default SchoolAccount;