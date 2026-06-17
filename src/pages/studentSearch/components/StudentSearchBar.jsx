import React from 'react';
import { Search, UserCircle, X } from 'lucide-react';

const StudentSearchBar = ({ totalCount, searchTerm, setSearchTerm, clearSearch }) => {
  return (
    <div className="flex flex-col gap-5 md:gap-6 bg-white p-4 md:p-6 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
      {/* Stats Row */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
         <div className="flex items-center gap-4">
           <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
             <UserCircle className="w-6 h-6 md:w-7 md:h-7" />
           </div>
           <div>
             <p className="text-gray-500 text-xs font-bold mb-0.5 uppercase tracking-widest">إجمالي الطلاب</p>
             <p className="text-2xl md:text-3xl font-black text-gray-800 font-mono">{totalCount}</p>
           </div>
         </div>
      </div>

      {/* Search Row */}
      <div className="relative flex-1 pt-2">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none mt-1" />
        <input
          type="text"
          placeholder="ابحث عن الطلاب بالاسم..."
          className="w-full pr-12 pl-12 h-12 md:h-14 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-600 text-right font-bold text-sm md:text-base shadow-sm transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={clearSearch} className="absolute left-3 top-1/2 -translate-y-1/2 mt-1 p-1.5 hover:bg-gray-200 text-gray-500 rounded-full transition-colors border-none outline-none cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentSearchBar;