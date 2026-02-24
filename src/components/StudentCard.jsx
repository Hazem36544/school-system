import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Upload, Eye } from 'lucide-react';

const StudentCard = ({ student }) => {
  // تم إضافة حالة "مسجل" كحالة افتراضية لأن السيرفر لا يرسل تقييم الطالب حالياً
  const getStatusColor = (status) => {
    switch (status) {
      case 'ممتاز': return 'text-green-600 bg-green-50';
      case 'جيد جداً': return 'text-blue-600 bg-blue-50';
      case 'جيد': return 'text-yellow-600 bg-yellow-50';
      case 'مسجل': return 'text-emerald-600 bg-emerald-50'; 
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // تجهيز المتغيرات الحقيقية القادمة من الـ API (بناءً على التمرير من Dashboard)
  const displayName = student.name || 'طالب غير محدد';
  const displayAge = student.age ? `${student.age} سنوات` : 'العمر غير متوفر';
  const displayGender = student.gender === 'Male' ? 'ذكر' : (student.gender === 'Female' ? 'أنثى' : 'غير محدد');
  const displayStatus = student.status || 'مسجل'; 

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm mb-6 border border-gray-100/50 hover:shadow-xl transition-all duration-300">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-600 border border-blue-100">
            {displayName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
                {/* تم استبدال الصف الدراسي بالعمر لأنه متاح من السيرفر */}
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 font-medium">
                    {displayAge}
                </span>
                <span>•</span>
                {/* تم استبدال رقم الملف بالنوع لأنه متاح من السيرفر */}
               <span className="text-xs">{displayGender}</span>
            </div>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(displayStatus)}`}>
          {displayStatus}
        </div>
      </div>

      {/* Stats Section - Gray Blocks */}
      <div className="flex gap-4 mb-8">
        <div className="flex-1 bg-gray-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 border border-gray-100">
             <div className="bg-white p-2 rounded-full shadow-sm">
                 <Calendar className="h-5 w-5 text-gray-400" />
             </div>
             <div className="text-center">
                 {/* السيرفر لا يرسل نسبة الحضور حالياً */}
                 <span className="block text-lg font-extrabold text-gray-800">-</span>
                 <span className="text-xs text-gray-500 font-bold">نسبة الحضور</span>
             </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 border border-gray-100">
             <div className="bg-white p-2 rounded-full shadow-sm">
                 <FileText className="h-5 w-5 text-gray-400" />
             </div>
             <div className="text-center">
                  {/* السيرفر لا يرسل تاريخ آخر تقرير في هذا المسار حالياً */}
                  <span className="block text-lg font-extrabold text-gray-800 text-sm">غير متوفر</span>
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