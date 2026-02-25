import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
// ✅ 1. استيراد schoolAPI بدلاً من authAPI
import { schoolAPI } from '../services/api'; 

const DashboardHeader = () => {
  const [schoolData, setSchoolData] = useState(null);

  // جلب بيانات المدرسة عند تحميل المكون
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        // ✅ 2. استخدام دالة جلب بيانات المدرسة الصحيحة المربوطة بالسيرفر
        const response = await schoolAPI.getCurrentSchool();
        setSchoolData(response.data);
      } catch (error) {
        console.error("خطأ في جلب بيانات المدرسة:", error);
      }
    };

    fetchSchoolData();
  }, []);

  // ✅ 3. تجهيز المتغيرات بناءً على الحقول الفعلية القادمة من السيرفر (SchoolResponse)
  const schoolName = schoolData?.name || 'جاري تحميل البيانات...';
  const location = [schoolData?.governorate, schoolData?.address].filter(Boolean).join(' - ') || 'العنوان غير متوفر';
  // استخدام username ككود للمدرسة، وإذا لم يتوفر نأخذ أول 8 حروف من الـ id
  const schoolCode = schoolData?.username || (schoolData?.id ? schoolData.id.substring(0, 8).toUpperCase() : '---');

  return (
    <div className="relative overflow-hidden mb-8 rounded-[2.5rem] shadow-xl">
      {/* Background - Primary Blue */}
      <div className="absolute inset-0 bg-[#1e3a8a] z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8 flex justify-between items-center text-white">
        <div className="flex items-center gap-6">
           <div className="bg-white/10 p-4 rounded-full border border-white/10 backdrop-blur-sm">
             <GraduationCap className="h-12 w-12 text-white" />
           </div>
           <div>
             {/* اسم المدرسة من الـ API */}
             <h1 className="text-3xl font-bold mb-2 text-white">{schoolName}</h1>
             <div className="flex flex-col text-sm text-blue-100 gap-1 font-bold opacity-90">
               {/* المحافظة والعنوان من الـ API */}
               <p>{location}</p>
               {/* كود المدرسة / المعرف من الـ API */}
               <p className="dir-ltr text-right font-mono text-blue-200 truncate max-w-[200px] md:max-w-full">
                 {schoolCode}
               </p>
             </div>
           </div>
        </div>
        
        <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
            <span className="text-blue-100 font-bold block text-xs mb-1">العام الدراسي</span>
            <span className="font-mono text-xl font-bold tracking-wider">2025/2026</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;