import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ChevronLeft, GraduationCap, Upload, FileText, CheckCircle, AlertCircle, Clock, Send, Search, User } from 'lucide-react';
import { studentsData } from '../data/students';

const AddReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reportType, setReportType] = useState('attendance'); 
    const [searchTerm, setSearchTerm] = useState('');

    // If no ID, show Selection Screen
    if (!id) {
        const filteredStudents = studentsData.filter(student => 
            student.name.includes(searchTerm) || student.level.includes(searchTerm)
        );

        return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar />
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

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredStudents.map(student => (
                                <div 
                                    key={student.id} 
                                    onClick={() => navigate(`/add-report/${student.id}`)}
                                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4 border border-transparent hover:border-blue-100"
                                >
                                    <div className="bg-blue-50 p-3 rounded-full">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{student.name}</h3>
                                        <p className="text-sm text-gray-500">{student.grade}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Find Student
    const student = studentsData.find(s => String(s.id) === String(id));

    if (!student) {
         return (
            <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
                <Sidebar />
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

    const ReportTypeOption = ({ type, label, icon: Icon }) => (
        <button 
            onClick={() => setReportType(type)}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                reportType === type 
                ? 'border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]' 
                : 'border-gray-100 bg-white text-gray-500 hover:border-blue-100'
            }`}
        >
            <div className={`p-2 rounded-full ${reportType === type ? 'bg-[#1e3a8a] text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Icon className="h-5 w-5" />
            </div>
            <span className="font-bold text-sm">{label}</span>
        </button>
    );

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
        <Sidebar />

        <div className="flex-1 mr-20 p-8 min-h-screen overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                 <div className="flex justify-between items-start mb-8">
                    <div>
                         <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Link to={`/reports/${student.id}`} className="hover:text-[#1e3a8a] flex items-center gap-1 text-sm font-medium transition-colors">
                                <ChevronLeft className="h-4 w-4 rotate-180" /> 
                                رجوع
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-white bg-[#1e3a8a] px-6 py-2 rounded-2xl inline-block shadow-md">
                            رفع تقرير مدرسي
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">إضافة تقرير جديد للطالب</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     {/* Left Sidebar (Instructions) - 3 cols */}
                     <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
                         {/* Instructions */}
                         <div className="bg-white p-6 rounded-3xl shadow-sm">
                             <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 border-gray-100 text-sm">إرشادات كتابة التقرير</h3>
                             <ul className="space-y-3">
                                 <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                     <span className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">1</span>
                                     اكتب تفاصيل واضحة ومحددة.
                                 </li>
                                 <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                     <span className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">2</span>
                                     استخدم لغة مهنية وموضوعية.
                                 </li>
                                 <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                     <span className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">3</span>
                                     أرفق المستندات الداعمة إن وجدت.
                                 </li>
                                 <li className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
                                     <span className="bg-blue-100 text-blue-600 rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">4</span>
                                     تأكد من دقة المعلومات قبل الإرسال.
                                 </li>
                             </ul>
                         </div>

                         {/* Security Note */}
                         <div className="bg-yellow-50 border border-yellow-100 p-5 rounded-3xl">
                            <div className="flex items-center gap-2 mb-2 text-yellow-700 font-bold text-xs">
                                 <CheckCircle className="h-4 w-4" />
                                 سرية المعلومات
                            </div>
                            <p className="text-[10px] text-yellow-600 leading-relaxed">
                             جميع التقارير المرفوعة تعامل بسرية تامة وتستخدم فقط لأغراض المتابعة ومصلحة الطالب.
                            </p>
                        </div>

                         {/* Help */}
                         <div className="bg-gray-100 p-5 rounded-3xl text-center">
                             <h4 className="font-bold text-gray-800 text-xs mb-2">هل تحتاج مساعدة؟</h4>
                             <p className="text-[10px] text-gray-500 mb-4">في حال واجهت أي مشكلة يمكنك التواصل مع الدعم الفني.</p>
                             <button className="bg-white text-gray-700 w-full py-2 rounded-xl text-xs font-bold border border-gray-200 hover:bg-gray-50 transition-colors">
                                 تواصل مع الدعم
                             </button>
                         </div>
                     </div>

                    {/* Main Content (Form) - 9 cols */}
                    <div className="lg:col-span-9 space-y-6 order-1 lg:order-2">
                        {/* Student Info */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border-r-4 border-[#1e3a8a]">
                             <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-4 rounded-full">
                                    <GraduationCap className="h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                                    <p className="text-gray-500 text-sm">{student.grade}</p>
                                    <p className="text-gray-400 text-xs mt-1">رقم القضية: {student.caseNumber}</p>
                                </div>
                            </div>
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-bold text-sm">
                                {student.status}
                            </span>
                        </div>

                        {/* Report Type Selector */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-4 text-sm">نوع التقرير</h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <ReportTypeOption type="attendance" label="تقرير الحضور والغياب" icon={Clock} />
                                <ReportTypeOption type="academic" label="تقرير الأداء الدراسي" icon={FileText} />
                                <ReportTypeOption type="behavior" label="تقرير السلوك والأنشطة" icon={CheckCircle} />
                            </div>
                        </div>

                        {/* Dynamic Form Content */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm space-y-6">
                            
                            {/* Month Selector (Common) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">الشهر *</label>
                                <select className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all text-gray-700">
                                    <option value="">اختر الشهر</option>
                                    <option value="مارس">مارس</option>
                                    <option value="فبراير">فبراير</option>
                                    <option value="يناير">يناير</option>
                                </select>
                            </div>

                            {/* Attendance Specifics */}
                            {reportType === 'attendance' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">عدد أيام عمل المدرسة في الشهر *</label>
                                        <input type="number" placeholder="اكتب عدد الأيام" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">عدد أيام الحضور *</label>
                                        <div className="relative">
                                            <input type="number" placeholder="اكتب عدد أيام الحضور" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all pl-16" />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold bg-white px-2 py-1 rounded-md shadow-sm">/ يوم</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">تفاصيل الحضور والغياب (اختياري)</label>
                                        <textarea rows="4" placeholder="يرجى كتابة تفاصيل التقرير بوضوح... (أسباب الغياب، التأخير، الخ)" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all resize-none"></textarea>
                                    </div>
                                </>
                            )}

                             {/* Academic Specifics */}
                             {reportType === 'academic' && (
                                <>
                                    <h4 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2 mb-4">المواد الدراسية والنسب المئوية</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {['اللغة العربية', 'الرياضيات', 'العلوم', 'الدراسات الاجتماعية', 'التربية الإنسانية', 'اللغة الإنجليزية'].map((subject) => (
                                            <div key={subject} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <span className="text-sm font-medium text-gray-600">{subject}</span>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" className="w-16 text-center bg-white border border-gray-200 rounded-lg py-1 text-sm font-bold" placeholder="0" />
                                                    <span className="text-gray-400 text-xs">%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center mt-4">
                                        <span className="text-blue-800 font-bold text-sm">المتوسط العام (تقديري)</span>
                                        <span className="text-2xl font-bold text-[#1e3a8a]">0%</span>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <label className="text-sm font-bold text-gray-700">تفاصيل الأداء الدراسي (اختياري)</label>
                                        <textarea rows="4" placeholder="يرجى كتابة ملاحظات إضافية عن أداء الطالب..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all resize-none"></textarea>
                                    </div>
                                </>
                             )}

                             {/* Behavior Specifics */}
                             {reportType === 'behavior' && (
                                <>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700">تقييم السلوك العام *</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'].map(rating => (
                                                <button key={rating} className="py-2 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 font-medium text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all focus:bg-[#1e3a8a] focus:text-white focus:border-[#1e3a8a]">
                                                    {rating}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">تفاصيل التقرير *</label>
                                        <textarea rows="6" placeholder="يرجى كتابة تفاصيل التقرير بوضوح... (السلوك، الأنشطة المشاركة، الملاحظات، إلخ)" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none transition-all resize-none"></textarea>
                                        <p className="text-[10px] text-gray-400 text-left">يمكنك إضافة ملاحظات إضافية حول أداء الطالب الدراسي</p>
                                    </div>
                                </>
                             )}
                        </div>

                         {/* File Upload (Common) */}
                         <div className="bg-white p-6 rounded-3xl shadow-sm">
                             <h3 className="font-bold text-gray-700 mb-4 text-sm">إرفاق ملف التقرير (اختياري)</h3>
                             <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                 <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                     <Upload className="h-6 w-6 text-blue-600" />
                                 </div>
                                 <p className="font-bold text-gray-700 text-sm mb-1">اضغط لاختيار ملف أو اسحب الملف هنا</p>
                                 <p className="text-xs text-gray-400">الملفات المدعومة: PDF, DOC, DOCX, XLS, XLSX (حتى 10 ميجابايت)</p>
                             </div>
                         </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-[#1e3a8a] text-white py-3.5 rounded-xl font-bold hover:bg-[#172554] transition-colors shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
                                <Send className="h-5 w-5" />
                                إرسال التقرير
                            </button>
                            <Link to={`/reports/${student.id}`} className="flex-none w-32 bg-white text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors border border-gray-200 flex items-center justify-center">
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
