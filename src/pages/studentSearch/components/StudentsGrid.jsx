import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderOpen, Search, X, User, Calendar, GraduationCap, ChevronDown } from 'lucide-react';

const StudentsGrid = ({ students, filteredStudents, visibleCount, searchTerm, clearSearch, handleLoadMore }) => {
  const navigate = useNavigate();

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-400">
         <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-30 text-[#1e3a8a]" />
         <p className="font-bold text-lg text-gray-600">لا يوجد طلاب مسجلين</p>
         <p className="text-sm font-bold text-gray-400 mt-2">
           لم يتم إضافة أي طلاب إلى قاعدة بيانات المدرسة بعد.
         </p>
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-red-50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Search className="w-10 h-10 text-red-400" />
          </div>
          <p className="font-black text-2xl text-gray-800 mb-2">عذراً، لا توجد نتائج!</p>
          <p className="text-sm font-bold text-gray-500 mb-8 max-w-md text-center leading-relaxed">
              لم نتمكن من العثور على أي طالب يطابق الاسم "{searchTerm}". يرجى التأكد والمحاولة مرة أخرى.
          </p>
          <button onClick={clearSearch} className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-8 h-12 font-bold flex items-center gap-2 transition-all outline-none cursor-pointer shadow-sm active:scale-95">
             <X className="w-5 h-5 text-gray-400" /> مسح البحث وإعادة الضبط
          </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.slice(0, visibleCount).map((student) => {
          const displayName = student.fullName || 'طالب غير محدد';
          const displayAge = student.age ? `${student.age} سنة` : '---';
          const displayGender = student.gender === 'Male' ? 'ذكر' : (student.gender === 'Female' ? 'أنثى' : '---');

          return (
            <div
              key={student.id}
              onClick={() => navigate(`/reports/${student.id}`, { state: { student } })}
              className="group bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-blue-100 transition-all duration-300 rounded-[2rem] p-6 cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50 rounded-br-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform opacity-50 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg">
                   <span className="text-[10px] font-bold text-gray-500 tracking-widest font-mono">ID: {(student.id || '').substring(0, 8).toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 relative z-10 mb-6 flex-1">
                 <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                       <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-gray-500">اسم الطالب</span>
                       <span className="text-sm font-bold text-gray-800 line-clamp-1">{displayName}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 bg-pink-50/50 p-3 rounded-xl border border-pink-50">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                       <Calendar className="w-5 h-5 text-pink-600" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-gray-500">النوع والعمر</span>
                       <span className="text-sm font-bold text-gray-800">{displayGender} • {displayAge}</span>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                     <GraduationCap className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-gray-500">الحالة</span>
                     <span className="text-sm font-black text-gray-800 font-mono">مُقيد</span>
                  </div>
                </div>
                <Link 
                  to={`/reports/${student.id}`} 
                  state={{ student }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 font-bold rounded-xl text-xs px-4 h-9 flex items-center justify-center outline-none border-none group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors cursor-pointer"
                >
                  التقارير
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < filteredStudents.length && (
        <div className="flex justify-center mt-8 animate-in fade-in">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-white border-2 border-blue-100 text-[#1e3a8a] rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none active:scale-95 border-none"
          >
            <ChevronDown className="w-5 h-5" /> عرض المزيد من الطلاب
          </button>
        </div>
      )}
    </>
  );
};

export default StudentsGrid;