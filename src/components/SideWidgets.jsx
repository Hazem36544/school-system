import React from 'react';
import { Clock, Upload, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SideWidgets = () => {
    const activities = [
        { id: 1, text: 'تم رفع تقرير الحضور', user: 'محمد أحمد العلي', time: 'منذ ساعتين' },
        { id: 2, text: 'تم رفع تقرير الدرجات', user: 'علي حسن المصري', time: 'منذ يوم' },
        { id: 3, text: 'تم رفع تقرير السلوك', user: 'خالد عمر السيد', time: 'منذ يومين' },
    ];

  return (
    <div className="space-y-6">
      {/* Search Bar - stylized input */}
       <div className="bg-white rounded-full p-2 pl-2 shadow-sm flex items-center gap-2 border border-gray-100">
             <div className="flex items-center px-4 gap-2 flex-1">
                <Search className="h-5 w-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="البحث عن طالب.." 
                    className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none text-gray-700 font-medium placeholder-gray-400"
                />
             </div>
            <button className="bg-[#1e3a8a] text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#172554] transition-colors shadow-lg shadow-blue-900/20">
                بحث
            </button>
       </div>

       {/* School Information - Grid Layout */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
         <h3 className="text-xl font-bold text-gray-800 mb-6 text-right">معلومات المدرسة</h3>
         
         <div className="grid grid-cols-1 gap-4">
             <div className="bg-gray-50/50 p-6 rounded-[1.5rem] text-center border border-gray-100 hover:border-blue-100 transition-colors">
                 <p className="text-xs text-gray-400 font-bold mb-2">اسم المدرسة</p>
                 <p className="font-bold text-[#1e3a8a] text-base">مدرسة الأمير فيصل الابتدائية</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold mb-1">الموقع</p>
                    <p className="font-bold text-gray-800 text-sm">القاهرة</p>
                </div>
                 <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                     <p className="text-xs text-gray-400 font-bold mb-1">الهاتف</p>
                     <p className="font-bold text-gray-800 text-sm dir-ltr">0221234567</p>
                 </div>
             </div>
             <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                 <p className="text-xs text-gray-400 font-bold mb-1">البريد الإلكتروني</p>
                 <p className="font-bold text-gray-800 text-sm font-mono">alfaisal@schools.edu.eg</p>
             </div>
         </div>
      </div>

       {/* Quick Action */}


      {/* Recent Activities */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-8 text-right">آخر النشاطات</h3>
        <div className="relative border-r-2 border-dashed border-gray-100 mr-3.5 space-y-10 pr-8">
            {activities.map((activity) => (
                <div key={activity.id} className="relative">
                    <div className="absolute -right-[41px] top-1.5 h-4 w-4 rounded-full bg-green-500 border-[3px] border-white shadow-sm ring-1 ring-gray-100"></div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm mb-1">{activity.text}</p>
                        <p className="text-xs text-gray-500 font-medium mb-2">{activity.user}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                             <Clock className="h-3 w-3" />
                             {activity.time}
                        </div>
                    </div>
                </div>
            ))}
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
