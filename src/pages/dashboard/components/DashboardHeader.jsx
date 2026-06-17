import React from 'react';
import { GraduationCap } from 'lucide-react';

// ✅ قائمة المحافظات للترجمة
const governoratesList = [
  { ar: "القاهرة", en: "Cairo" },
  { ar: "الجيزة", en: "Giza" },
  { ar: "الإسكندرية", en: "Alexandria" },
  { ar: "القليوبية", en: "Qalyubia" },
  { ar: "الدقهلية", en: "Dakahlia" },
  { ar: "الشرقية", en: "Sharqia" },
  { ar: "الغربية", en: "Gharbia" },
  { ar: "المنوفية", en: "Monufia" },
  { ar: "البحيرة", en: "Beheira" },
  { ar: "كفر الشيخ", en: "Kafr El Sheikh" },
  { ar: "دمياط", en: "Damietta" },
  { ar: "بورسعيد", en: "Port Said" },
  { ar: "الإسماعيلية", en: "Ismailia" },
  { ar: "السويس", en: "Suez" },
  { ar: "شمال سيناء", en: "North Sinai" },
  { ar: "جنوب سيناء", en: "South Sinai" },
  { ar: "البحر الأحمر", en: "Red Sea" },
  { ar: "مطروح", en: "Matrouh" },
  { ar: "الفيوم", en: "Fayoum" },
  { ar: "بني سويف", en: "Beni Suef" },
  { ar: "المنيا", en: "Minya" },
  { ar: "أسيوط", en: "Assiut" },
  { ar: "سوهاج", en: "Sohag" },
  { ar: "قنا", en: "Qena" },
  { ar: "الأقصر", en: "Luxor" },
  { ar: "أسوان", en: "Aswan" },
  { ar: "الوادي الجديد", en: "New Valley" }
];

// ✅ دالة الترجمة (بتحول النص لحروف صغيرة عشان تتأكد إن التطابق سليم)
const translateGov = (enName) => {
  if (!enName) return '';
  const gov = governoratesList.find(g => g.en.toLowerCase() === enName.toLowerCase());
  return gov ? gov.ar : String(enName);
};

const DashboardHeader = ({ schoolData, isLoading }) => {
  const schoolName = isLoading ? 'جاري التحميل...' : (schoolData?.name || 'مدرسة غير محددة');
  
  // ✅ تمرير اسم المحافظة لدالة الترجمة قبل دمجها مع العنوان
  const translatedGov = translateGov(schoolData?.governorate);
  const location = isLoading ? 'جاري التحميل...' : ([translatedGov, schoolData?.address].filter(Boolean).join(' - ') || 'العنوان غير متوفر');
  
  const schoolCode = isLoading ? '---' : (schoolData?.username || (schoolData?.id ? schoolData.id.substring(0, 8).toUpperCase() : '---'));

  return (
    <div className="relative overflow-hidden mb-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 bg-[#1e3a8a] z-0"></div>

      {/* Content */}
      <div className="relative z-10 p-5 md:p-8 flex flex-row flex-wrap md:flex-nowrap justify-between items-center gap-4 md:gap-6 text-white">
        
        {/* الجزء الأيمن: الأيقونة واسم المدرسة */}
        <div className="flex flex-row items-center gap-4 flex-1 min-w-[200px]">
          <div className="bg-white/10 p-3 md:p-4 rounded-2xl md:rounded-full border border-white/10 backdrop-blur-sm shrink-0">
            <GraduationCap className="h-8 w-8 md:h-12 md:w-12 text-white" />
          </div>
          
          <div className="text-right flex flex-col items-start overflow-hidden">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold mb-1 text-white truncate w-full">{schoolName}</h1>
            <div className="flex flex-col text-[10px] sm:text-xs md:text-sm text-blue-100 font-bold opacity-90 w-full">
              <p className="truncate w-full">{location}</p>
              <p className="font-mono text-blue-200 truncate w-full">
                {schoolCode}
              </p>
            </div>
          </div>
        </div>

        {/* الجزء الأيسر: مربع العام الدراسي */}
        <div className="bg-white/10 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/10 backdrop-blur-sm text-center shrink-0">
          <span className="text-blue-100 font-bold block text-[10px] md:text-xs mb-0.5 md:mb-1">العام الدراسي</span>
          <span className="font-mono text-sm md:text-xl font-bold tracking-wider">2025/2026</span>
        </div>
        
      </div>
    </div>
  );
};

export default DashboardHeader;