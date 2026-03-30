import React from 'react';
import { Clock, Loader2 } from 'lucide-react';

// استلام بيانات المدرسة من المكون الأب (Dashboard)
const SideWidgets = ({ schoolData, isLoading }) => {

    // Prepare default values in case data is missing
    const schoolName = schoolData?.name || schoolData?.fullName || 'جاري التحميل...';
    const schoolPhone = schoolData?.contactNumber || schoolData?.phoneNumber || 'غير متوفر';
    const schoolLocation = schoolData?.governorate || 'غير متوفر';
    const schoolEmail = schoolData?.email || 'غير متوفر';

    return (
        <div className="space-y-6" dir="rtl">

            {/* School Information - Grid Layout */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative min-h-[250px]">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-right">بيانات المدرسة</h3>

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
                                <p className="font-bold text-gray-800 text-sm">{schoolPhone}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 p-5 rounded-[1.5rem] text-center border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold mb-1">البريد الإلكتروني</p>
                            <p className="font-bold text-gray-800 text-sm font-mono truncate">{schoolEmail}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideWidgets;