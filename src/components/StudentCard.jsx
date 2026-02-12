import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Upload, Eye } from 'lucide-react';

const StudentCard = ({ student }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ممتاز': return 'text-green-600 bg-green-50';
      case 'جيد جداً': return 'text-blue-600 bg-blue-50';
      case 'جيد': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-6 border border-gray-100/50 hover:shadow-xl transition-all duration-300">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-600 border border-blue-100">
            {student.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-medium">
                    {student.grade}
                </span>
                <span>•</span>
               <span className="text-xs">{student.caseNumber || 'رقم الملف غير متوفر'}</span>
            </div>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(student.status)}`}>
          {student.status}
        </div>
      </div>

      {/* Stats Section - Gray Blocks */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-gray-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 border border-gray-100">
             <div className="bg-white p-2 rounded-full shadow-sm">
                 <Calendar className="h-5 w-5 text-gray-400" />
             </div>
             <div className="text-center">
                 <span className="block text-lg font-extrabold text-gray-800">{student.attendanceRate || '-%'}</span>
                 <span className="text-xs text-gray-500 font-bold">نسبة الحضور</span>
             </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 border border-gray-100">
             <div className="bg-white p-2 rounded-full shadow-sm">
                 <FileText className="h-5 w-5 text-gray-400" />
             </div>
             <div className="text-center">
                  <span className="block text-lg font-extrabold text-gray-800">{student.lastReportDate || 'لا يوجد'}</span>
                  <span className="text-xs text-gray-500 font-bold">آخر تقرير</span>
             </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex gap-3">
        <Link to={`/add-report/${student.id}`} className="flex-[2] bg-[#1e3a8a] text-white py-4 rounded-[1.2rem] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#172554] transition-colors shadow-lg shadow-blue-900/20">
            <Upload className="h-4 w-4" />
            رفع تقرير جديد
        </Link>
        <Link to={`/reports/${student.id}`} className="flex-1 bg-white text-gray-600 border border-gray-200 py-4 rounded-[1.2rem] font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            <Eye className="h-4 w-4" />
            عرض التقارير
        </Link>
      </div>
    </div>
  );
};

export default StudentCard;