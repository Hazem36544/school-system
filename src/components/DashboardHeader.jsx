import React from 'react';
import { GraduationCap } from 'lucide-react';

const DashboardHeader = ({ schoolData, isLoading }) => {
  // Use passed data instead of internal fetching to prevent redundant API calls

  // Prepare variables based on actual fields from server (SchoolResponse)
  const schoolName = isLoading ? 'جاري التحميل...' : (schoolData?.name || 'مدرسة غير محددة');
  const location = isLoading ? 'جاري التحميل...' : ([schoolData?.governorate, schoolData?.address].filter(Boolean).join(' - ') || 'العنوان غير متوفر');
  // Use username as school code, if not available take first 8 chars of id
  const schoolCode = isLoading ? '---' : (schoolData?.username || (schoolData?.id ? schoolData.id.substring(0, 8).toUpperCase() : '---'));

  return (
    <div className="relative overflow-hidden mb-8 rounded-[2.5rem] shadow-xl" dir="rtl">
      {/* Background - Primary Blue */}
      <div className="absolute inset-0 bg-[#1e3a8a] z-0"></div>

      {/* Content */}
      <div className="relative z-10 p-8 flex justify-between items-center text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white/10 p-4 rounded-full border border-white/10 backdrop-blur-sm">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div className="text-right">
            {/* School Name from API */}
            <h1 className="text-3xl font-bold mb-2 text-white">{schoolName}</h1>
            <div className="flex flex-col text-sm text-blue-100 gap-1 font-bold opacity-90">
              {/* Governorate and Address from API */}
              <p>{location}</p>
              {/* School Code / Identifier from API */}
              <p className="font-mono text-blue-200 truncate max-w-[200px] md:max-w-full">
                {schoolCode}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
          <span className="text-blue-100 font-bold block text-xs mb-1">العام الدراسي</span>
          <span className="font-mono text-xl font-bold tracking-wider">2025/2026</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;