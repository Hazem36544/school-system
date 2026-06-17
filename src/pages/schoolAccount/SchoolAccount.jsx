import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../../services/api'; 
import { useAuth } from '../../context/AuthContext'; 
import { getErrorMessage } from '../../utils/errorHandler';

// استيراد المكونات الفرعية
import AccountHeader from './components/AccountHeader';
import ProfileCard from './components/ProfileCard';
import BasicInfo from './components/BasicInfo';
import SecurityBanner from './components/SecurityBanner';

// ✅ إضافة قائمة المحافظات
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

// ✅ دالة الترجمة لتغيير اسم المحافظة للعربي
const translateGov = (enName) => {
  if (!enName) return '';
  const gov = governoratesList.find(g => g.en.toLowerCase() === enName.toLowerCase());
  return gov ? gov.ar : String(enName);
};

const SchoolAccount = () => {
    // State for Animation
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [schoolData, setSchoolData] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { logout } = useAuth();

    // Effect for Animation
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => setIsPageLoaded(true), 50);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const response = await authAPI.getCurrentSchool();
                setSchoolData(response.data);
            } catch (error) {
                console.error("خطأ في جلب بيانات المدرسة:", error);
                toast.error(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleLogout = () => {
        logout(); 
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-[#1e3a8a] animate-spin" />
            </div>
        );
    }

    // تهيئة البيانات للعرض
    const displayName = schoolData?.name || 'مدرسة غير محددة';
    const displayUsername = schoolData?.username || 'غير متوفر'; 
    
    // ✅ تطبيق دالة الترجمة وتجهيز العنوان (المحافظة - العنوان التفصيلي)
    const translatedGov = translateGov(schoolData?.governorate);
    const displayAddress = [translatedGov, schoolData?.address].filter(Boolean).join(' - ') || 'العنوان غير متوفر';
    
    const displayPhone = schoolData?.contactNumber || 'غير متوفر';
    const displayEmail = schoolData?.email || 'غير متوفر';

    return (
        <div className="w-full font-sans" dir="rtl">
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                <div className="max-w-7xl mx-auto w-full">
                
                    <AccountHeader />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ProfileCard 
                            displayName={displayName} 
                            displayAddress={displayAddress} 
                            onLogout={handleLogout} 
                        />

                        <BasicInfo 
                            displayUsername={displayUsername} 
                            displayPhone={displayPhone} 
                            displayEmail={displayEmail} 
                        />
                    </div>

                    <SecurityBanner />

                </div>
            </div>
        </div>
    );
};

export default SchoolAccount;