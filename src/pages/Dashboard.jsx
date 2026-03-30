import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import StatCard from '../components/StatCard';
import StudentCard from '../components/StudentCard';
import SideWidgets from '../components/SideWidgets';
import { Users, FileText, Award, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
// ✅ تم إزالة authAPI واستخدام schoolAPI فقط لأنها تحتوي على المسار المخصص للمدرسة
import { schoolAPI } from '../services/api';

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [schoolData, setSchoolData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch student list and real school data from the server concurrently
                const [childrenResponse, schoolResponse] = await Promise.all([
                    schoolAPI.listChildren({ PageNumber: 1, PageSize: 50 }),
                    schoolAPI.getCurrentSchool()
                ]);

                setStudents(childrenResponse.data?.items || []);
                setTotalStudents(childrenResponse.data?.totalCount || 0);
                setSchoolData(schoolResponse.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("An error occurred while fetching data from the server");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { id: 1, title: 'إجمالي الطلاب', value: totalStudents, icon: Users, color: 'bg-blue-500' },
        { id: 2, title: 'الأداء المميز', value: 0, icon: Award, color: 'bg-green-500' },
        { id: 3, title: 'تقارير هذا الشهر', value: 0, icon: FileText, color: 'bg-purple-500' },
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
            <Sidebar />

            <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto transition-all duration-300">
                <div className="max-w-7xl mx-auto">

                    {/* Pass school data and loading state to header component */}
                    <DashboardHeader schoolData={schoolData} isLoading={loading} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map(stat => (
                            <StatCard
                                key={stat.id}
                                title={stat.title}
                                value={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stat.value}
                                icon={stat.icon}
                                colorClass={stat.color}
                            />
                        ))}
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Dashboard;