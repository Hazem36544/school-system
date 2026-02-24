import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Phone, Mail, Hash, ShieldCheck, LogOut, X, Send, Edit, GraduationCap, MapPin, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api'; // استيراد الـ API

const SchoolAccount = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [schoolData, setSchoolData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // جلب بيانات المدرسة المُسجلة دخولاً حالياً
    useEffect(() => {
        const fetchSchoolData = async () => {
            try {
                setLoading(true);
                // جلب بيانات المستخدم الحالي
                const response = await authAPI.getCurrentUser();
                setSchoolData(response.data);
            } catch (error) {
                console.error("خطأ في جلب بيانات المدرسة:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolData();
    }, []);

    // دالة تسجيل الخروج
    const handleLogout = () => {
        localStorage.removeItem('wesal_token');
        localStorage.removeItem('wesal_user_data');
        localStorage.removeItem('wesal_user_role');
        navigate('/vision-login'); // أو مسار تسجيل الدخول الخاص بك
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar />
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin" />
                </div>
            </div>
        );
    }

    // تجهيز البيانات للعرض، مع وضع قيم افتراضية في حالة النقص
    const schoolName = schoolData?.name || schoolData?.fullName || 'مدرسة غير محددة';
    const schoolEmail = schoolData?.email || 'غير متوفر';
    const schoolPhone = schoolData?.contactNumber || schoolData?.phoneNumber || 'غير متوفر';
    const schoolCode = schoolData?.id || schoolData?.userName || 'غير متوفر';
    const schoolLocation = [schoolData?.governorate, schoolData?.address].filter(Boolean).join(' - ') || 'غير متوفر';


    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
            <Sidebar />

            <div className="flex-1 mr-20 p-8 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    
                    {/* --- الهيدر الجديد --- */}
                    <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center justify-between overflow-hidden shadow-xl mb-8">
                        
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                        <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">الحساب الشخصي</h1>
                                <p className="text-blue-200 text-sm opacity-90">إدارة بياناتك الشخصية وإعدادات المدرسة</p>
                            </div>
                        </div>

                        <div className="hidden md:flex bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 relative z-10">
                           <User className="w-8 h-8 text-blue-100" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Right Column (Personal Info) - 8 Cols */}
                        <div className="lg:col-span-8 order-2 lg:order-1">
                            <div className="bg-white p-8 rounded-3xl shadow-sm h-full">
                                <h2 className="text-xl font-bold text-gray-800 mb-8 border-b pb-4 border-gray-100">المعلومات الأساسية</h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
                                                <Hash className="h-6 w-6" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm text-gray-400 mb-1">كود المدرسة / المعرف</p>
                                                <p className="font-bold text-gray-800 text-sm md:text-lg font-mono truncate">{schoolCode}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
                                                <Phone className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">رقم الجوال / التواصل</p>
                                                <p className="font-bold text-gray-800 text-lg" dir="ltr">{schoolPhone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm text-gray-400 mb-1">البريد الإلكتروني</p>
                                                <p className="font-bold text-gray-800 text-lg font-mono truncate">{schoolEmail}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-full text-blue-600 flex-shrink-0">
                                                <MapPin className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">العنوان والمحافظة</p>
                                                <p className="font-bold text-gray-800 text-lg">{schoolLocation}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full mt-8 border-2 border-[#1e3a8a] text-[#1e3a8a] py-4 rounded-2xl font-bold hover:bg-[#1e3a8a] hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit className="h-5 w-5" />
                                    طلب تعديل البيانات
                                </button>
                            </div>
                        </div>

                        {/* Left Column (Profile Card) - 4 Cols */}
                        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
                            <div className="bg-white p-8 rounded-3xl shadow-sm text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-50 to-white z-0"></div>
                                
                                <div className="relative z-10 w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-blue-50 shadow-xl">
                                    <GraduationCap className="h-16 w-16 text-[#1e3a8a]" />
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 leading-snug">{schoolName}</h2>
                                    <span className="bg-blue-100 text-blue-700 px-6 py-1.5 rounded-full font-bold text-sm inline-block mt-2">
                                        حساب مدرسة
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-3 text-gray-800 font-bold">
                                    <ShieldCheck className="h-5 w-5 text-green-600" />
                                    نظام آمن ومشفر
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    جميع بياناتك محمية وفقاً لمعايير الأمن السيبراني المصرية. لا يتم مشاركة البيانات مع أي أطراف خارجية.
                                </p>
                            </div>

                            <button 
                                onClick={handleLogout}
                                className="w-full bg-red-50 text-red-600 py-4 rounded-2xl font-bold text-center hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-2"
                            >
                                <LogOut className="h-5 w-5 rotate-180" />
                                تسجيل الخروج
                            </button> 
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Data Request Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden transform scale-100 transition-all">
                        <div className="bg-[#1e3a8a] text-white p-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold">طلب تعديل البيانات</h2>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">سبب طلب التعديل
                            <span className="text-red-500 mr-1">*</span>
                            </label>
                            <textarea 
                                rows="6" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#1e3a8a] focus:outline-none transition-all resize-none"
                                placeholder="يرجى كتابة سبب طلب تعديل البيانات بالتفصيل... (مثال: تغيير رقم الجوال، تحديث البريد الإلكتروني)"
                            ></textarea>
                            
                            <div className="bg-blue-50 p-4 rounded-xl mt-4 border border-blue-100">
                                <p className="text-xs text-blue-700 font-medium text-center">
                                    سيتم مراجعة طلبك من قبل إدارة المحكمة والرد عليك خلال 48 ساعة.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3 bg-gray-50">
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-[#1e3a8a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#172554] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                            >
                                <Send className="h-4 w-4" />
                                إرسال الطلب
                            </button>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolAccount;