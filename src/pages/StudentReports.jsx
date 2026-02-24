import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
    ChevronRight, FileText, Download, GraduationCap, X, 
    CheckCircle, Calendar, BookOpen, AlertCircle, Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { schoolAPI, commonAPI } from '../services/api'; 

const StudentReports = () => {
    const { id } = useParams();
    
    // States للبيانات الحقيقية
    const [student, setStudent] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);

    // جلب بيانات الطالب وتقاريره من الـ API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. جلب بيانات الطالب (لأن الـ API لا يوفر مسار جلب طفل واحد، نجلبه من القائمة)
                const childrenRes = await schoolAPI.listChildren({ PageNumber: 1, PageSize: 100 });
                const foundStudent = childrenRes.data?.items?.find(s => s.id === id);
                
                if (foundStudent) {
                    setStudent(foundStudent);
                }

                // 2. جلب التقارير الخاصة بهذا الطالب
                const reportsRes = await schoolAPI.listReportsByChild(id);
                setReports(reportsRes.data?.items || []);
                
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("حدث خطأ أثناء جلب البيانات من السيرفر");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    // دالة لتحميل التقرير كملف (بناءً على documentId)
    // ملاحظة: الـ Swagger للـ ReportResponse لا يعرض documentId صراحةً، 
    // نفترض هنا أن الـ report.id هو نفسه، أو ستحتاج لتحديث الـ Backend لإرجاع الـ documentId
    const handleDownload = async (report) => {
        try {
            setDownloadingId(report.id);
            // استدعاء الـ API لتحميل المستند
            const response = await commonAPI.getDocument(report.id);
            
            // إنشاء رابط لتحميل الملف (تعتمد على نوع الاستجابة من السيرفر، عادة Blob)
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `تقرير_${student?.fullName}_${report.reportType}.pdf`); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success("تم بدء التحميل");
        } catch (error) {
            console.error("Download Error:", error);
            toast.error("الملف غير متوفر أو حدث خطأ أثناء التحميل");
        } finally {
            setDownloadingId(null);
        }
    };

    // دالة لترجمة نوع التقرير
    const translateReportType = (type) => {
        const t = type?.toLowerCase();
        if (t === 'attendance') return 'تقرير الحضور والغياب';
        if (t === 'academic') return 'تقرير الأداء الدراسي';
        if (t === 'behavior') return 'تقرير السلوك والأنشطة';
        return type || 'تقرير مدرسي عام';
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

    if (!student) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center mr-20">
                    <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">لم يتم العثور على بيانات الطالب</h2>
                    <Link to="/dashboard" className="mt-4 text-[#1e3a8a] underline font-bold">العودة للرئيسية</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
            <Sidebar />

            <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    
                    {/* الهيدر */}
                    <div className="bg-[#1e3a8a] text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden w-full flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6 relative z-10">
                            <Link 
                                to="/dashboard" 
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md"
                            >
                                <ChevronRight className="h-6 w-6 text-white" /> 
                            </Link>

                            <div className="text-right">
                                <h1 className="text-3xl font-bold mb-1">تقارير الطالب</h1>
                                <p className="text-blue-100/80 text-sm font-medium">
                                    جميع التقارير المرفوعة للطالب <span className="text-white font-bold">{student.fullName}</span>
                                </p>
                            </div>
                        </div>

                        <div className="relative z-10 p-5 bg-white/10 rounded-[1.5rem] border border-white/20 backdrop-blur-md shadow-inner">
                            <BookOpen className="h-10 w-10 text-white" />
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* القائمة الجانبية (بيانات الطالب والإحصائيات) */}
                        <div className="lg:col-span-4 space-y-6 sticky top-8">
                            {/* Student Card */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm text-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                    <GraduationCap className="h-10 w-10 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-1">{student.fullName}</h2>
                                <p className="text-gray-500 text-sm mb-1">{student.gender === 'Male' ? 'ذكر' : 'أنثى'} - {student.age} سنوات</p>
                                <div className="mt-4">
                                    <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold border border-green-200">
                                        مسجل بالنظام
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">إحصائيات التقارير</h3>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-medium">إجمالي التقارير</span>
                                        <span className="font-bold text-lg text-[#1e3a8a]">{reports.length}</span>
                                    </div>
                                    {reports.length > 0 && (
                                        <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                            <span className="text-gray-500 text-sm font-medium">آخر تقرير</span>
                                            <span className="font-bold text-sm text-gray-800" dir="ltr">
                                                {new Date(reports[0].uploadedAt).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">إجراءات سريعة</h3>
                                <Link to={`/add-report/${student.id}`} className="block w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                                    <FileText className="h-4 w-4" />
                                    رفع تقرير جديد
                                </Link>
                            </div>
                        </div>

                        {/* قائمة التقارير (البيانات الحقيقية) */}
                        <div className="lg:col-span-8 space-y-6">
                            <h3 className="text-gray-500 font-bold text-lg mb-2">التقارير المرفوعة ({reports.length})</h3>
                            
                            {reports.length === 0 ? (
                                <div className="bg-white rounded-[2rem] p-12 text-center shadow-sm border border-gray-100">
                                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد تقارير</h3>
                                    <p className="text-gray-500">لم يتم رفع أي تقارير لهذا الطالب حتى الآن.</p>
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div key={report.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex gap-4">
                                                <div className="bg-blue-50 p-3.5 rounded-2xl h-fit text-[#1e3a8a]">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                                                        {translateReportType(report.reportType)}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold" dir="ltr">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(report.uploadedAt).toLocaleString('ar-EG')}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> تم الرفع
                                            </span>
                                        </div>

                                        <div className="flex gap-3 mt-4 border-t border-gray-100 pt-5">
                                            <button 
                                                onClick={() => setSelectedReport(report)}
                                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-gray-200"
                                            >
                                                <FileText className="h-4 w-4 text-gray-500" />
                                                معلومات التقرير
                                            </button>
                                            <button 
                                                onClick={() => handleDownload(report)}
                                                disabled={downloadingId === report.id}
                                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-blue-200 disabled:opacity-50"
                                            >
                                                {downloadingId === report.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                                تحميل الملف الأصلي
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal المعلومات (تم تعديله ليتوافق مع الواقع البرمجي) */}
            {selectedReport && (
                <div className="fixed inset-0 bg-[#1e3a8a]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        <div className="bg-[#1e3a8a] p-6 flex justify-between items-center">
                            <h2 className="text-white text-xl font-bold">معلومات التقرير المرفوع</h2>
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 bg-gray-50/50">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold mb-1">الطالب</p>
                                    <p className="text-lg font-bold text-gray-800">{student.fullName}</p>
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-400 font-bold mb-1">نوع التقرير</p>
                                    <p className="text-lg font-bold text-[#1e3a8a]">{translateReportType(selectedReport.reportType)}</p>
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-400 font-bold mb-1">تاريخ الرفع</p>
                                    <p className="text-md font-bold text-gray-700" dir="ltr">
                                        {new Date(selectedReport.uploadedAt).toLocaleString('ar-EG')}
                                    </p>
                                </div>
                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs text-gray-400 font-bold mb-1">الرقم المرجعي (ID)</p>
                                    <p className="text-xs font-mono text-gray-500 break-all">{selectedReport.id}</p>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-xl mt-6 border border-blue-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                    لمشاهدة التفاصيل الكاملة (الدرجات، الحضور، الملاحظات السلوكية)، يرجى <span className="font-bold">تحميل الملف الأصلي</span> المرفق مع هذا التقرير.
                                </p>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-white flex gap-3">
                            <button 
                                onClick={() => handleDownload(selectedReport)}
                                disabled={downloadingId === selectedReport.id}
                                className="flex-1 bg-[#1e3a8a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#172554] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {downloadingId === selectedReport.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                                تحميل الملف
                            </button>
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="flex-1 bg-gray-50 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentReports;