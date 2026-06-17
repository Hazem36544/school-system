import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';

const StudentReportsHeader = ({ student }) => {
    return (
        <div className="bg-[#1e3a8a] text-white p-6 md:p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
                <Link
                    to="/search"
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all border border-white/10 backdrop-blur-md self-start md:self-auto shrink-0"
                >
                    <ChevronRight className="h-6 w-6 text-white" />
                </Link>
                <div className="text-center md:text-right w-full md:w-auto">
                    <h1 className="text-2xl md:text-3xl font-bold mb-1">تقارير الطالب</h1>
                    <p className="text-blue-100/80 text-sm font-medium">
                        جميع التقارير المرفوعة للطالب <span className="text-white font-bold">{student.fullName}</span>
                    </p>
                </div>
            </div>
            <div className="relative z-10 p-5 bg-white/10 rounded-[1.5rem] border border-white/20 backdrop-blur-md shadow-inner hidden md:block">
                <BookOpen className="h-10 w-10 text-white" />
            </div>
        </div>
    );
};

export default StudentReportsHeader;