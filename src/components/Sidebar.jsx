import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, User, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  // دالة تحديد ستايل الرابط النشط وغير النشط
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all duration-300 group ${
      isActive
        ? 'bg-white text-[#1e3a8a] shadow-lg scale-105'
        : 'text-blue-200 hover:bg-white/10 hover:text-white'
    }`;
  };

  return (
    <div 
      className="fixed top-0 right-0 h-screen w-28 bg-[#1e3a8a] flex flex-col items-center py-6 z-50 rounded-l-[2rem] shadow-2xl font-sans border-l border-white/5 transition-all duration-300"
      dir="rtl"
    >
      
      {/* --- 1. الشعار (مُكبر وبدون خلفية ليتناسق مع الهوية) --- */}
      <div className="mb-8 flex-shrink-0 w-full flex justify-center">
    <img 
      src={`${import.meta.env.BASE_URL}logo.svg`} 
      alt="شعار وصال" 
      className="w-20 h-20 object-contain hover:scale-110 transition-transform duration-300 drop-shadow-xl"
      onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=School'; }} 
    />
</div>

      {/* --- 2. روابط التنقل (أيقونة + نص) --- */}
      <nav className="flex flex-col items-center gap-3 w-full px-2 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
        
        <Link to="/dashboard" className={getLinkClass('/dashboard')}>
          <Home className="w-6 h-6 mb-0.5 transition-colors duration-300" />
          <span className="text-[11px] font-bold tracking-wide text-center leading-tight">الرئيسية</span>
        </Link>
        
        <Link to="/search" className={getLinkClass('/search')}>
          <Search className="w-6 h-6 mb-0.5 transition-colors duration-300" />
          <span className="text-[11px] font-bold tracking-wide text-center leading-tight">بحث طلاب</span>
        </Link>
        
        <Link to="/account" className={getLinkClass('/account')}>
          <User className="w-6 h-6 mb-0.5 transition-colors duration-300" />
          <span className="text-[11px] font-bold tracking-wide text-center leading-tight">الحساب</span>
        </Link>

      </nav>

      {/* --- 3. تسجيل الخروج --- */}
      <div className="mt-auto pt-4 w-full px-2 pb-2">
         <Link 
            to="/" 
            className="w-full py-3 flex flex-col items-center justify-center gap-1 rounded-2xl text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all duration-300 border border-transparent hover:border-red-500/20"
         >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-bold">خروج</span>
        </Link>
      </div>

    </div>
  );
};

export default Sidebar;