import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    ChevronRight, FileText, Download, GraduationCap, X,
    CheckCircle, Calendar, BookOpen, AlertCircle, Loader2, Upload
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { schoolAPI, commonAPI } from '../services/api';

const StudentReports = () => {
    const { id } = useParams();
    const location = useLocation();

    // States for real data
    const [student, setStudent] = useState(location.state?.student || null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);

    // States for Upload Modal
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [reportFile, setReportFile] = useState(null);
    const [reportType, setReportType] = useState('Attendance');

    const reportTypes = [
        { value: 'Attendance', label: 'تقرير الحضور' },
        { value: 'Grades', label: 'تقرير الدرجات الأكاديمية' },
        { value: 'Behavior', label: 'تقرير السلوك' }
    ];

    // Fetch reports for this student
    const fetchReports = async () => {
        try {
            setLoading(true);
            const reportsRes = await schoolAPI.listReportsByChild(id);
            setReports(reportsRes.data?.items || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("An error occurred while fetching reports from the server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchReports();
    }, [id]);

    // Function to download report as file
    const handleDownload = async (report) => {
        try {
            setDownloadingId(report.id);
            const response = await commonAPI.getDocument(report.documentId);
            const downloadUrl = response.data.downloadUrl;

            if (!downloadUrl) {
                throw new Error("Download link not available for this document");
            }

            const API_BASE = import.meta.env.VITE_API_URL || 'http://wesal.runasp.net';
            const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : `${API_BASE}${downloadUrl}`;

            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = fullUrl;
            link.setAttribute('target', '_blank');
            link.setAttribute('download', `report_${student?.fullName || 'student'}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("بدأ التحميل");
        } catch (error) {
            console.error("Download Error:", error);
            toast.error("الملف غير متوفر أو حدث خطأ أثناء التحميل");
        } finally {
            setDownloadingId(null);
        }
    };

    // Handle the two-step upload process
    const handleUploadReport = async (e) => {
        e.preventDefault();
        if (!reportFile) {
            toast.error("Please select a file to upload");
            return;
        }

        try {
            setUploading(true);

            // Step 1: Upload Document
            const formData = new FormData();
            formData.append('file', reportFile);

            const docRes = await commonAPI.uploadDocument(formData);
            const documentId = docRes.data;

            if (!documentId) throw new Error("Document upload failed - no ID returned");

            // Step 2: Associate Document with School Report
            await schoolAPI.uploadReport({
                childId: id,
                documentId: documentId,
                reportType: reportType
            });

            toast.success("Report uploaded successfully!");
            setIsUploadModalOpen(false);
            setReportFile(null);
            fetchReports(); // Refresh list

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(error.response?.data?.detail || "Failed to upload report. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const translateReportType = (type) => {
        const t = type?.toLowerCase();
        if (t === 'attendance') return 'تقرير الحضور والغياب';
        if (t === 'grades') return 'تقرير الأداء الأكاديمي';
        if (t === 'behavior') return 'تقرير السلوك والأنشطة';
        return type || 'تقرير مدرسي عام';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans">
                <Sidebar />
                <div className="flex-1 flex justify-center items-center ml-24">
                    <Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin" />
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar />
                <div className="flex-1 flex flex-col items-center justify-center mr-24">
                    <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">بيانات الطالب غير موجودة</h2>
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

                    {/* Header */}
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
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Sidebar (Student profile summary) */}
                        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center border border-gray-100">
                                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
                                    <GraduationCap className="h-12 w-12 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{student.fullName}</h2>
                                <p className="text-gray-500 font-medium mb-6">{student.gender === 'Male' ? 'ذكر' : 'أنثى'} • {student.age} سنة</p>

                                <div className="grid grid-cols-2 gap-4 py-6 border-t border-gray-100">
                                    <div className="text-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">إجمالي التقارير</p>
                                        <p className="text-xl font-black text-[#1e3a8a]">{reports.length}</p>
                                    </div>
                                    <div className="text-center border-r border-gray-100">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">آخر تحديث</p>
                                        <p className="text-xs font-bold text-gray-800">
                                            {reports.length > 0 ? new Date(reports[0].uploadedAt).toLocaleDateString('ar-EG') : '---'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Major Action: Upload Button */}
                            <button
                                onClick={() => setIsUploadModalOpen(true)}
                                className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Upload className="h-6 w-6" />
                                رفع تقرير جديد
                            </button>
                        </div>

                        {/* Reports List */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex justify-between items-center mb-2 px-2">
                                <h3 className="text-gray-500 font-bold text-lg">سجل التقارير</h3>
                            </div>

                            {reports.length === 0 ? (
                                <div className="bg-white rounded-[3rem] p-20 text-center shadow-sm border border-dashed border-gray-200">
                                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FileText className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد تقارير متاحة</h3>
                                    <p className="text-gray-500 max-w-sm mx-auto">لا توجد تقارير مدرسية مرفوعة لهذا الطالب. استخدم زر الرفع لإضافة تقريرك الأول.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reports.map((report) => (
                                        <div key={report.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100/50 hover:shadow-lg hover:border-blue-100 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex gap-5">
                                                    <div className="bg-blue-50 p-4 rounded-2xl h-fit text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                                                        <FileText className="h-7 w-7" />
                                                    </div>
                                                    <div className="text-right">
                                                        <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#1e3a8a] transition-colors font-sans">
                                                            {translateReportType(report.reportType)}
                                                        </h4>
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                                                <Calendar className="h-3.5 w-3.5" />
                                                                {new Date(report.uploadedAt).toLocaleString('ar-EG')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-50">
                                                <button
                                                    onClick={() => handleDownload(report)}
                                                    disabled={downloadingId === report.id}
                                                    className="flex-1 bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:bg-[#172554] disabled:opacity-50"
                                                >
                                                    {downloadingId === report.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                                                    تحميل التقرير
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modals --- */}

            {/* Upload Report Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20" dir="rtl">
                        <div className="bg-gray-50 p-7 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-[#1e3a8a] text-xl font-bold flex items-center gap-2">
                                <Upload className="w-6 h-6" /> رفع تقرير جديد
                            </h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-800 shadow-sm transition-all">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUploadReport} className="p-8 space-y-6 text-right">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">اختر نوع التقرير</label>
                                <select
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 text-gray-800 font-bold"
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                >
                                    {reportTypes.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">ارفق مستند (PDF/صورة)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        onChange={(e) => setReportFile(e.target.files[0])}
                                        className="hidden"
                                        id="report-file-input"
                                        accept=".pdf,image/*"
                                    />
                                    <label
                                        htmlFor="report-file-input"
                                        className="w-full p-8 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer group-hover:bg-blue-50 group-hover:border-blue-300 transition-all"
                                    >
                                        <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 text-blue-600">
                                            <Upload className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-blue-900 mb-1">
                                            {reportFile ? reportFile.name : "انقر لاختيار ملف"}
                                        </p>
                                        <p className="text-[10px] text-blue-400 font-medium">الحد الأقصى للحجم: 10 ميجابايت (PDF أو صور فقط)</p>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                                    من خلال رفع هذا التقرير، سيتم مشاركته مع نظام المحكمة وأولياء الأمور فوراً. تأكد من دقة البيانات.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="flex-1 bg-white text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || !reportFile}
                                    className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    رفع
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-[#1e3a8a]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" dir="rtl">

                        <div className="bg-[#1e3a8a] p-7 flex justify-between items-center">
                            <h2 className="text-white text-xl font-bold flex items-center gap-2">
                                <FileText className="w-6 h-6" /> توثيق التقرير
                            </h2>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-8 bg-gray-50/50 text-right">
                            <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">الطالب</p>
                                    <p className="text-xl font-black text-gray-800">{student.fullName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">فئة التقرير</p>
                                        <p className="text-md font-bold text-[#1e3a8a]">{translateReportType(selectedReport.reportType)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">تاريخ الرفع</p>
                                        <p className="text-md font-bold text-gray-700">
                                            {new Date(selectedReport.uploadedAt).toLocaleDateString('ar-EG')}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-gray-100">
                                    <p className="text-[10px] text-gray-300 font-bold mb-2 uppercase tracking-widest">مرجع المستند الداخلي</p>
                                    <p className="text-xs font-mono text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 break-all">{selectedReport.documentId}</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-2xl mt-6 border border-blue-100 flex items-start gap-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                </div>
                                <p className="text-xs text-blue-800 font-bold leading-relaxed">
                                    لعرض المستند الأصلي الممسوح ضوئياً أو النص الكامل، يرجى استخدام زر التحميل أدناه لاسترداد ملف PDF.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
                            <button
                                onClick={() => handleDownload(selectedReport)}
                                disabled={downloadingId === selectedReport.id}
                                className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:bg-[#172554] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {downloadingId === selectedReport.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                                تحميل PDF
                            </button>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="flex-1 bg-gray-50 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200"
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