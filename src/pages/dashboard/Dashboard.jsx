import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from './components/DashboardHeader';
import StatCard from './components/StatCard';
import { Users, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { authAPI, schoolAPI } from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

const Dashboard = () => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [schoolData, setSchoolData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                setIsPageLoaded(true);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const [childrenResponse, schoolResponse] = await Promise.all([
                    schoolAPI.listChildren({ PageNumber: 1, PageSize: 50 }),
                    authAPI.getCurrentSchool()
                ]);

                setStudents(childrenResponse.data?.items || []);
                setTotalStudents(childrenResponse.data?.totalCount || 0);
                setSchoolData(schoolResponse.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ✅ تم إضافة البادج "حالة نشطة" للكارت الأول بستايل أزرق متناسق
    const stats = [
        { 
            id: 1, 
            title: 'الطلاب المسجلين', 
            value: totalStudents,
            badge: (
                <span className="inline-block text-[10px] md:text-[11px] font-bold text-blue-700 bg-blue-100/60 border border-blue-200 px-3 py-1.5 rounded-xl">
                    حالة نشطة
                </span>
            ), 
            icon: Users, 
            color: 'bg-blue-600',
            link: '/search' 
        },
        { 
            id: 2, 
            title: 'المستهدف الشهري للتقارير', 
            value: totalStudents * 3, 
            badge: (
                <span className="inline-block text-[10px] md:text-[11px] font-bold text-purple-700 bg-purple-100/60 border border-purple-200 px-3 py-1.5 rounded-xl">
                    3 تقارير لكل طالب كحد أدنى
                </span>
            ),
            icon: FileText, 
            color: 'bg-purple-600' 
        },
        { 
            id: 3, 
            title: 'فئات التقييم المعتمدة', 
            value: 3, 
            badge: (
                <span className="inline-block text-[10px] md:text-[11px] font-bold text-green-700 bg-green-100/60 border border-green-200 px-3 py-1.5 rounded-xl">
                    حضور، درجات، سلوك
                </span>
            ),
            icon: CheckCircle, 
            color: 'bg-green-600' 
        },
    ];

    return (
        <div className="w-full font-sans" dir="rtl">
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8 pb-10">

                    <DashboardHeader schoolData={schoolData} isLoading={loading} />

                    {/* شبكة الكروت */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-2">
                        {stats.map(stat => {
                            const CardComponent = (
                                <StatCard
                                    title={stat.title}
                                    value={loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : stat.value}
                                    badge={stat.badge}
                                    icon={stat.icon}
                                    colorClass={stat.color}
                                />
                            );

                            return stat.link ? (
                                <Link 
                                    to={stat.link} 
                                    key={stat.id} 
                                    className="block outline-none h-full"
                                >
                                    {CardComponent}
                                </Link>
                            ) : (
                                <div key={stat.id} className="block h-full">
                                    {CardComponent}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;