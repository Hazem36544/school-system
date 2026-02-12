import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ChevronLeft, FileText, Download, Upload, GraduationCap, X, CheckCircle, Clock, Calendar, BookOpen, User, AlertCircle } from 'lucide-react';
import { studentsData } from '../data/students';

const StudentReports = () => {
    const { id } = useParams();
    const [selectedReport, setSelectedReport] = useState(null);

    const student = studentsData.find(s => String(s.id) === String(id));

    // 1. Enhanced Mock Data
    const mockReports = [
        {
            id: 301,
            month: 'تقرير شهر مارس',
            date: '28 مارس 2026',
            school: 'مدرسة الأمير فيصل الابتدائية',
            status: 'قيد المراجعة',
            statusClass: 'bg-yellow-100 text-yellow-700',
            attendance: '100%',
            academic: 'ممتاز',
            behavior: 'ممتاز',
            summary: 'تحسن ملحوظ في المشاركة الصفية والتفاعل مع الزملاء. الطالب يظهر اهتماماً كبيراً بالأنشطة اللاصفية.',
            details: {
                attendance: { total: 22, present: 22, absence: '0%', excuse: 0 },
                academic: [
                    { subject: 'اللغة العربية', grade: '98%' },
                    { subject: 'الرياضيات', grade: '95%' },
                    { subject: 'العلوم', grade: '92%' },
                    { subject: 'التربية الإسلامية', grade: '100%' }
                ],
                behavior: { rating: 'ممتاز', note: 'الطالب مثال يحتذى به في الأخلاق والتعاون.' }
            }
        },
        {
            id: 302,
            month: 'تقرير شهر فبراير',
            date: '26 فبراير 2026',
            school: 'مدرسة الأمير فيصل الابتدائية',
            status: 'تم المراجعة',
            statusClass: 'bg-green-100 text-green-700',
            attendance: '90%',
            academic: 'جيد جداً',
            behavior: 'جيد جداً',
            summary: 'أداء جيد مع بعض التحسينات المطلوبة في التركيز أثناء الحصص الدراسية.',
            details: {
                attendance: { total: 20, present: 18, absence: '10%', excuse: 2 },
                academic: [
                    { subject: 'اللغة العربية', grade: '88%' },
                    { subject: 'الرياضيات', grade: '85%' },
                    { subject: 'العلوم', grade: '90%' },
                    { subject: 'اللغة الإنجليزية', grade: '87%' }
                ],
                behavior: { rating: 'جيد جداً', note: 'سلوك جيد بشكل عام، مع بعض التشتت أحياناً.' }
            }
        },
        {
            id: 303,
            month: 'تقرير شهر يناير',
            date: '28 يناير 2026',
            school: 'مدرسة الأمير فيصل الابتدائية',
            status: 'تم المراجعة',
            statusClass: 'bg-green-100 text-green-700',
            attendance: '95%',
            academic: 'ممتاز',
            behavior: 'ممتاز',
            summary: 'الطالب متفوق ومجتهد ويشارك بفعالية في كافة الأنشطة المدرسية.',
            details: {
                attendance: { total: 22, present: 21, absence: '5%', excuse: 1 },
                academic: [
                    { subject: 'اللغة العربية', grade: '96%' },
                    { subject: 'الرياضيات', grade: '94%' },
                    { subject: 'العلوم', grade: '98%' },
                    { subject: 'الحاسب الآلي', grade: '100%' }
                ],
                behavior: { rating: 'ممتاز', note: 'شخصية قيادية ومحبوبة بين زملائه.' }
            }
        }
    ];

    if (!student) return <div className="min-h-screen bg-[#F3F4F6] flex justify-center items-center">Loading...</div>;

    const StatusIcon = ({ status }) => {
        return status === 'تم المراجعة' ? <CheckCircle className="w-4 h-4 ml-1" /> : <Clock className="w-4 h-4 ml-1" />;
    }

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
            <Sidebar />

            <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto transition-all duration-300">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 bg-[#1e3a8a] p-8 rounded-[2rem] shadow-lg text-white">
                       <div>
                            <Link to="/search" className="flex items-center gap-2 text-blue-200 hover:text-white mb-2 transition-colors w-fit">
                                <ChevronLeft className="w-4 h-4 rotate-180" />
                                <span className="text-sm font-bold">رجوع</span>
                            </Link>
                            <h1 className="text-3xl font-extrabold text-white">تقارير الطالب</h1>
                            <p className="text-blue-100 mt-1 font-medium">جميع التقارير المرفوعة للطالب <span className="text-white font-bold">{student.name}</span></p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* 2. Left Sidebar (4 Cols) */}
                        <div className="lg:col-span-4 space-y-6 sticky top-8">
                            {/* Student Card */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm text-center">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                    <GraduationCap className="h-10 w-10 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-1">{student.name}</h2>
                                <p className="text-gray-500 text-sm mb-1">{student.grade}</p>
                                <p className="text-gray-400 text-xs dir-ltr">{student.caseNumber || 'ST-005'}</p>
                                <div className="mt-4">
                                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-sm shadow-green-200">
                                        {student.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">إحصائيات التقارير</h3>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-medium">إجمالي التقارير</span>
                                        <span className="font-bold text-lg text-[#1e3a8a]">{mockReports.length}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-gray-500 text-sm font-medium">آخر تقرير</span>
                                        <span className="font-bold text-sm text-gray-800">{mockReports[0].date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="bg-white p-6 rounded-[2rem] shadow-sm space-y-3">
                                <h3 className="font-bold text-gray-800 mb-4 text-lg">إجراءات سريعة</h3>
                                <Link to={`/add-report/${id}`} className="block w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20">
                                    <FileText className="h-4 w-4" />
                                    رفع تقرير جديد
                                </Link>
                                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                                    <Download className="h-4 w-4" />
                                    تحميل جميع التقارير
                                </button>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-[1.5rem] border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-blue-700 font-bold text-sm">ملحوظة</span>
                                </div>
                                <p className="text-blue-600/80 text-xs leading-relaxed font-medium">
                                    يتم حفظ جميع التقارير بشكل آمن ويمكن الوصول إليها في أي وقت.
                                </p>
                            </div>
                        </div>

                        {/* 2. Main List UI (8 Cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            <h3 className="text-gray-500 font-bold text-lg mb-2">التقارير المرفوعة ({mockReports.length})</h3>
                            
                            {mockReports.map((report) => (
                                <div key={report.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-4">
                                            <div className="bg-blue-50 p-3.5 rounded-2xl h-fit text-[#1e3a8a]">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-800 mb-1">{report.month}</h4>
                                                <p className="text-gray-500 text-xs font-medium mb-1">{report.school}</p>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                                                    <Calendar className="h-3 w-3" />
                                                    {report.date}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`${report.statusClass} px-3 py-1 rounded-full text-[10px] font-bold flex items-center`}>
                                            <StatusIcon status={report.status} />
                                            {report.status}
                                        </span>
                                    </div>

                                    {/* Summary Box */}
                                    <div className="bg-[#F8F9FA] rounded-[1.5rem] p-6 mb-6">
                                        <h5 className="font-bold text-gray-700 mb-4 text-xs">ملخص التقرير:</h5>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">الحضور:</span>
                                                <span className="font-bold text-gray-800">{report.attendance}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">الأداء الدراسي:</span>
                                                <span className="font-bold text-gray-800">{report.academic}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">السلوك:</span>
                                                <span className="font-bold text-gray-800">{report.behavior}</span>
                                            </div>
                                            <div className="pt-3 mt-2 border-t border-gray-200">
                                                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                                                    {report.summary}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Buttons */}
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setSelectedReport(report)}
                                            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-gray-200"
                                        >
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            عرض التفاصيل
                                        </button>
                                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-gray-200">
                                            <Download className="h-4 w-4 text-gray-500" />
                                            تحميل التقرير
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Details Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-[#1e3a8a]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="bg-[#1e3a8a] p-6 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-white text-xl font-bold">{selectedReport.month}</h2>
                                <div className="flex gap-4 mt-1 text-blue-200 text-xs">
                                    <span>{selectedReport.date}</span>
                                    <span>•</span>
                                    <span>{selectedReport.school}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 bg-gray-50/50">
                            
                            {/* Attendance Card */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    تفاصيل الحضور - {selectedReport.month}
                                </h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
                                        <div className="text-2xl font-extrabold text-blue-600 mb-1">{selectedReport.details.attendance.total}</div>
                                        <div className="text-[10px] text-blue-400 font-bold">إجمالي أيام العمل</div>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                                        <div className="text-2xl font-extrabold text-green-600 mb-1">{selectedReport.details.attendance.present}</div>
                                        <div className="text-[10px] text-green-500 font-bold">أيام الحضور</div>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-2xl text-center border border-gray-200">
                                        <div className="text-2xl font-extrabold text-gray-600 mb-1">{selectedReport.details.attendance.absence}</div>
                                        <div className="text-[10px] text-gray-400 font-bold">نسبة الغياب</div>
                                    </div>
                                </div>
                                <div className="bg-[#F8F9FA] p-4 rounded-xl text-xs text-gray-500 border border-gray-100">
                                    <span className="font-bold text-gray-700">ملاحظات: </span>
                                    تغيب الطالب يومين بسبب ظروف صحية مع تقديم عذر طبي.
                                </div>
                            </div>

                            {/* Academic Card */}
                            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 flex justify-center">الأداء الدراسي - {selectedReport.month}</h3>
                                <div className="bg-gray-50 p-4 rounded-2xl text-center mb-6">
                                    <div className="text-3xl font-extrabold text-[#1e3a8a] mb-1">{selectedReport.academic}</div>
                                    <div className="text-xs text-gray-400 font-bold">التقييم العام للأداء</div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                                    <p className="text-xs text-gray-500 leading-relaxed text-center font-medium">
                                        <span className="font-bold text-gray-700 block mb-1">ملاحظات:</span>
                                        أداء جيد في معظم المواد. يحتاج الطالب إلى مزيد من التركيز في مادة الرياضيات. يشارك بشكل فعال في الأنشطة الصفية.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 mb-2">المواد الدراسية:</h4>
                                    {selectedReport.details.academic.map((subject, idx) => (
                                        <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                            <span className="text-sm font-bold text-gray-700">{subject.subject}</span>
                                            <span className="text-sm font-extrabold text-[#1e3a8a]">{subject.grade}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Behavior Card */}
                            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 text-center">تقييم السلوك - {selectedReport.month}</h3>
                                <div className="bg-gray-50 p-6 rounded-2xl text-center mb-4">
                                    <div className="text-3xl font-extrabold text-[#1e3a8a] mb-1">{selectedReport.behavior}</div>
                                    <div className="text-xs text-gray-400 font-bold">التقييم العام للسلوك</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl">
                                    <p className="text-xs text-gray-500 leading-relaxed text-center font-medium">
                                        <span className="font-bold text-gray-700 block mb-1">ملاحظات:</span>
                                        {selectedReport.details.behavior.note}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-100 bg-white flex shrink-0">
                            <button className="flex-1 bg-[#1e3a8a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#172554] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                                <Download className="h-4 w-4" />
                                تحميل التقرير
                            </button>
                            <button 
                                onClick={() => setSelectedReport(null)}
                                className="flex-1 mr-3 bg-gray-50 text-gray-700 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors border border-gray-200"
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
