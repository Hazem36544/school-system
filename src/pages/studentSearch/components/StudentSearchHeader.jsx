import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap } from 'lucide-react';

const StudentSearchHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full bg-[#1e3a8a] rounded-[2rem] p-6 md:p-8 mb-8 text-white flex items-center justify-between overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="flex items-center gap-4 md:gap-6 relative z-10 w-full md:w-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all shadow-inner border border-white/10 shrink-0 cursor-pointer outline-none"
        >
          <ChevronLeft size={24} className="md:w-7 md:h-7 text-white rotate-180 transition-transform" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">الطلاب المسجلين</h1>
          <p className="text-blue-200 text-xs md:text-sm font-medium tracking-wide">الاطلاع والبحث في ملفات وتقارير الطلاب</p>
        </div>
      </div>
      
      <div className="hidden md:block bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-sm z-10">
         <GraduationCap size={40} strokeWidth={1.5} className="text-white" />
      </div>
    </div>
  );
};

export default StudentSearchHeader;