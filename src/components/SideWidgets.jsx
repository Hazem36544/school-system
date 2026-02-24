import React from 'react';
import { Clock, Loader2 } from 'lucide-react'; 

// استلام بيانات المدرسة من المكون الأب (Dashboard)
const SideWidgets = ({ schoolData, isLoading }) => {
    
    // تجهيز القيم الافتراضية في حال نقص البيانات
    const schoolName = schoolData?.name || schoolData?.fullName || 'جاري التحميل...';
    const schoolPhone = schoolData?.contactNumber || schoolData?.phoneNumber || 'غير متوفر';
    const schoolLocation = schoolData?.governorate || 'غير متوفر';
    const schoolEmail = schoolData?.email || 'غير متوفر';

  return (
    <div className="space-y-6">
       
       {/* School Information - Grid Layout */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative min-h-[250px]">
         <h3 className="text-xl font-bold text-gray-800 mb-6 text-right">معلومات المدرسة</h3>
         
         {isLoading ? (
             <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
             </div>
         ) : (
             <div className="grid grid-cols-1 gap-4">
                 <div className="bg-gray-50/50 p-6 rounded-[1.5rem] text-center border border-gray-100 hover:border-blue-100 transition-colors">
                     <p className="text-xs text-gray-400 font-bold mb-2">اسم المدرسة</p>
                     <p className="font-bold text-[#1e3a8a] text-base">{schoolName}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                        <p className="text-xs text-gray-400 font-bold mb-1">الموقع</p>
                        <p className="font-bold text-gray-800 text-sm">{schoolLocation}</p>
                    </div>
                     <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                         <p className="text-xs text-gray-400 font-bold mb-1">الهاتف</p>
                         <p className="font-bold text-gray-800 text-sm dir-ltr">{schoolPhone}</p>
                     </div>
                 </div>
                 <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                     <p className="text-xs text-gray-400 font-bold mb-1">البريد الإلكتروني</p>
                     <p className="font-bold text-gray-800 text-sm font-mono truncate">{schoolEmail}</p>
                 </div>
             </div>
         )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-8 text-right">آخر النشاطات</h3>
        
        {/* إزالة البيانات الوهمية وعرض رسالة للمستخدم */}
        <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Clock className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-bold text-sm">سجل النشاطات غير متوفر</p>
            <p className="text-[10px] text-gray-400 mt-2 leading-relaxed px-4">
                لا توجد بيانات متاحة حالياً من السيرفر لعرض آخر نشاطات المدرسة بشكل مجمع.
            </p>
        </div>
      </div>
      
       {/* Important Note */}
       <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem]">
           <div className="flex items-center gap-3 mb-3 text-amber-700 font-bold text-base">
                <span className="h-2.5 w-2.5 bg-amber-500 rounded-full animate-pulse"></span>
                ملحوظة هامة
           </div>
           <p className="text-xs text-amber-800/80 leading-relaxed font-bold">
           يمكنك فقط عرض ورفع تقارير الطلاب المرتبطين بمدرستك. لا يمكنك الوصول إلى معلومات القضايا أو العائلات الكاملة.
           </p>
       </div>
    </div>
  );
};

export default SideWidgets;