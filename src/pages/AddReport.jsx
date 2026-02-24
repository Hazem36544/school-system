import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
    ChevronRight, GraduationCap, Upload, 
    CheckCircle, AlertCircle, Send, Search, User, FilePlus, Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { schoolAPI, commonAPI } from '../services/api';

const AddReport = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // States
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // File State
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoadingStudents(true);
                const response = await schoolAPI.listChildren({ PageNumber: 1, PageSize: 100 });
                setStudents(response.data?.items || []);
            } catch (error) {
                console.error("Error fetching students:", error);
                toast.error("فشل في جلب قائمة الطلاب");
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudents();
    }, []);

    if (!id) {
        const filteredStudents = students.filter(student => 
            student.fullName?.includes(searchTerm)
        );

        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar onLogout={onLogout} />
                <div className="flex-1 mr-20 p-8 flex flex-col items-center justify-start min-h-screen">
                    <div className="max-w-4xl w-full">
                        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">اختر طالباً لرفع التقرير</h1>
                        <p className="text-gray-500 mb-8">ابحث عن الطالب الذي تريد إضافة تقرير له</p>

                        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 mb-8">
                            <Search className="h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="ابحث باسم الطالب..." 
                                className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {loadingStudents ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredStudents.map(student => (
                                    <div 
                                        key={student.id} 
                                        onClick={() => navigate(`/add-report/${student.id}`)}
                                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4 border border-transparent hover:border-blue-100"
                                    >
                                        <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 line-clamp-1">{student.fullName}</h3>
                                            <p className="text-sm text-gray-500">{student.gender === 'Male' ? 'ذكر' : 'أنثى'} - {student.age} سنوات</p>
                                        </div>
                                    </div>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <div className="col-span-full text-center text-gray-500 py-10">
                                        لا يوجد طلاب مطابقين للبحث
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    if (loadingStudents) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans items-center justify-center" dir="rtl">
                <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
            </div>
        );
    }

    const student = students.find(s => s.id === id);

    if (!student) {
         return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar onLogout={onLogout} />
                <div className="flex-1 mr-20 p-8 flex flex-col items-center justify-center">
                    <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700">لم يتم العثور على الطالب</h2>
                    <Link to="/add-report" className="mt-4 bg-[#1e3a8a] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#172554] transition-colors">
                        العودة للقائمة
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmitReport = async () => {
        if (!selectedFile) {
            toast.error("يجب إرفاق ملف التقرير أولاً لأن السيرفر يعتمد عليه.");
            return;
        }

        setSubmitting(true);
        try {
            // 1. رفع الملف أولاً للحصول على documentId
            const fileFormData = new FormData();
            fileFormData.append('file', selectedFile);
            const documentRes = await commonAPI.uploadDocument(fileFormData);
            const documentId = documentRes.data; 

            // 2. إرسال التقرير النهائي 
            // ✅ التعديل الحاسم: تم تغيير القيمة لتتطابق مع قائمة الخيارات المسموحة (Enums) في الباك إند
            const reportData = {
                childId: student.id,
                documentId: documentId,
                reportType: 'Attendance' // يمكن تغييره إلى 'Attendance' أو 'Grades' إذا أردت
            };

            await schoolAPI.uploadReport(reportData);
            
            toast.success("تم رفع التقرير الموحد بنجاح!");
            navigate('/dashboard'); 
        } catch (error) {
            console.error("Submit Error:", error);
            // عرض رسالة الخطأ القادمة من السيرفر إن وجدت
            const errorMsg = error.response?.data?.detail || error.response?.data?.title || "حدث خطأ أثناء رفع التقرير";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
        <Sidebar onLogout={onLogout} />

        <div className="flex-1 mr-20 p-8 min-h-screen overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="max-w-7xl mx-auto mb-10 pt-6">
                    <div className="bg-[#1e3a8a] text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden w-full flex items-center justify-between">
                        <div className="flex items-center gap-6 relative z-10">
                            <Link 
                                to={`/add-report`}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md"
                            >
                                <ChevronRight className="h-6 w-6 text-white" /> 
                            </Link>

                            <div className="text-right">
                                <h1 className="text-3xl font-bold mb-1">رفع التقرير المدرسي الشامل</h1>
                                <p className="text-blue-100/80 text-sm font-medium">إضافة ملف التقييم الموحد للطالب المختار</p>
                            </div>
                        </div>
                        <div className="relative z-10 p-5 bg-white/10 rounded-[1.5rem] border border-white/20 backdrop-blur-md shadow-inner">
                            <FilePlus className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     {/* القائمة الجانبية (الإرشادات) */}
                     <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
                         <div className="bg-white p-6 rounded-3xl shadow-sm">
                             <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100 text-sm">إرشادات الرفع</h3>
                             <ul className="space-y-3">
                                 <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                     <span className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">1</span>
                                     قم بتجميع تفاصيل الحضور والأداء والسلوك في ملف واحد (PDF أو غيره).
                                 </li>
                                 <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                     <span className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">2</span>
                                     ارفع الملف المعتمد بحد أقصى 10 ميجابايت واضغط على إرسال.
                                 </li>
                             </ul>
                         </div>
                     </div>

                    {/* المحتوى الرئيسي */}
                    <div className="lg:col-span-9 space-y-6 order-1 lg:order-2">
                        {/* كارت بيانات الطالب */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border-r-4 border-[#1e3a8a]">
                             <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-4 rounded-full">
                                    <GraduationCap className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{student.fullName}</h2>
                                    <p className="text-gray-500 text-sm">{student.gender === 'Male' ? 'ذكر' : 'أنثى'} - العمر: {student.age}</p>
                                </div>
                            </div>
                        </div>

                         {/* إرفاق ملف (الاعتماد على ملف واحد شامل) */}
                         <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 relative">
                             <h3 className="font-bold text-gray-700 mb-4 text-sm">إرفاق ملف التقرير الشامل المعتمد *</h3>
                             <label className={`border-2 border-dashed ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:bg-gray-50'} rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group block w-full`}>
                                 <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    accept=".pdf,.doc,.docx,.xlsx"
                                 />
                                 <div className={`${selectedFile ? 'bg-green-100' : 'bg-blue-50'} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform`}>
                                     {selectedFile ? <CheckCircle className="h-6 w-6 text-green-600" /> : <Upload className="h-6 w-6 text-blue-600" />}
                                 </div>
                                 <p className="font-bold text-gray-700 text-sm mb-1">
                                    {selectedFile ? `تم اختيار: ${selectedFile.name}` : 'اضغط لاختيار ملف التقرير'}
                                 </p>
                                 <p className="text-xs text-gray-400">PDF, DOCX, XLSX (حتى 10 ميجابايت)</p>
                             </label>
                         </div>

                        {/* أزرار التحكم */}
                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={handleSubmitReport}
                                disabled={submitting}
                                className="flex-1 bg-[#1e3a8a] text-white py-4 rounded-xl font-bold hover:bg-[#172554] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} 
                                {submitting ? 'جاري الرفع والإرسال...' : 'إرسال التقرير الشامل'}
                            </button>
                            <Link to={`/add-report`} className="w-32 bg-white text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 border border-gray-200 flex items-center justify-center text-center">
                                إلغاء
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddReport;