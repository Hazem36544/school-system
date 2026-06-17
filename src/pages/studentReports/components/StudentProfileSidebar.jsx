import React from 'react';
import { GraduationCap, Upload } from 'lucide-react';

const StudentProfileSidebar = ({ student, reportsCount, lastUploadDate, onOpenUploadModal }) => {
    return (
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8 order-1 lg:order-1">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm text-center border border-gray-100">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
                    <GraduationCap className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 line-clamp-1">{student.fullName}</h2>
                <p className="text-gray-500 font-medium mb-6 text-sm md:text-base">{student.gender === 'Male' ? 'ذكر' : 'أنثى'} • {student.age} سنة</p>

                <div className="grid grid-cols-2 gap-4 py-4 md:py-6 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">إجمالي التقارير</p>
                        <p className="text-lg md:text-xl font-black text-[#1e3a8a]">{reportsCount}</p>
                    </div>
                    <div className="text-center border-r border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">آخر تحديث</p>
                        <p className="text-xs font-bold text-gray-800">{lastUploadDate}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={onOpenUploadModal}
                className="w-full bg-[#1e3a8a] hover:bg-[#172554] text-white py-4 md:py-5 rounded-[2rem] font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] border-none outline-none cursor-pointer"
            >
                <Upload className="h-5 w-5 md:h-6 md:w-6" />
                رفع تقرير جديد
            </button>
        </div>
    );
};

export default StudentProfileSidebar;