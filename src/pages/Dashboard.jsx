import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import StatCard from '../components/StatCard';
import StudentCard from '../components/StudentCard';
import SideWidgets from '../components/SideWidgets';
import { Users, FileText, Award, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { schoolAPI, authAPI } from '../services/api'; // تم إضافة authAPI

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [schoolData, setSchoolData] = useState(null); // حالة جديدة لبيانات المدرسة
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                
                // جلب قائمة الطلاب وبيانات المدرسة في نفس الوقت
                const [childrenResponse, userResponse] = await Promise.all([
                    schoolAPI.listChildren({ PageNumber: 1, PageSize: 50 }),
                    authAPI.getCurrentUser()
                ]);
                
                setStudents(childrenResponse.data?.items || []);
                setTotalStudents(childrenResponse.data?.totalCount || 0);
                setSchoolData(userResponse.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("حدث خطأ أثناء جلب البيانات من السيرفر");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { id: 1, title: 'إجمالي الطلاب', value: totalStudents, icon: Users, color: 'bg-blue-500' },
        { id: 2, title: 'أداء ممتاز', value: 0, icon: Award, color: 'bg-green-500' },
        { id: 3, title: 'تقارير هذا الشهر', value: 0, icon: FileText, color: 'bg-purple-500' },
    ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
      <Sidebar />
      
      <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto transition-all duration-300">
        <div className="max-w-7xl mx-auto">
            <DashboardHeader />

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* قائمة الطلاب */}
                <div className="lg:col-span-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">الطلاب المسجلين ({totalStudents})</h2>
                      </div>
                      
                      <div className="space-y-6">
                        {loading ? (
                             <div className="flex justify-center items-center py-16 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                                 <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
                             </div>
                        ) : students.length > 0 ? (
                            students.map(student => (
                                <StudentCard 
                                    key={student.id} 
                                    student={{
                                        id: student.id,
                                        name: student.fullName, 
                                        age: student.age,
                                        gender: student.gender,
                                        birthDate: student.birthDate
                                    }} 
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-12 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                                لا يوجد طلاب مسجلين حالياً في مدرستك.
                            </p>
                        )}
                      </div>
                </div>

                {/* الويدجت الجانبية - تم تمرير البيانات لها */}
                 <div className="lg:col-span-4 space-y-8 sticky top-8 mt-14">
                    <SideWidgets schoolData={schoolData} isLoading={loading} />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;