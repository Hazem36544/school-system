import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardHeader from '../components/DashboardHeader';
import StatCard from '../components/StatCard';
import StudentCard from '../components/StudentCard';
import SideWidgets from '../components/SideWidgets';
import { Users, FileText, Award } from 'lucide-react';
import { studentsData } from '../data/students';

const Dashboard = () => {
    // Stats Data
    const stats = [
        { id: 1, title: 'إجمالي الطلاب', value: 10, icon: Users, color: 'bg-blue-500' },
        { id: 2, title: 'أداء ممتاز', value: 5, icon: Award, color: 'bg-green-500' },
        { id: 3, title: 'تقارير هذا الشهر', value: 10, icon: FileText, color: 'bg-purple-500' },
    ];

    // Use all students
    const students = studentsData;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
      {/* Sidebar - Fixed Right */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto transition-all duration-300">
        <div className="max-w-7xl mx-auto">
             {/* Header */}
            <DashboardHeader />

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map(stat => (
                    <StatCard 
                        key={stat.id}
                        title={stat.title} 
                        value={stat.value} 
                        icon={stat.icon} 
                        colorClass={stat.color} 
                    />
                ))}
            </div>

            {/* Main Grid Layout: 12 Columns */}
            {/* In RTL: First child is Right, Second child is Left */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Right Column: Student List (8 Cols) */}
                <div className="lg:col-span-8">
                     <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">الطلاب المسجلين ({students.length})</h2>
                     </div>
                     <div className="space-y-6">
                        {students.map(student => (
                            <StudentCard key={student.id} student={student} />
                        ))}
                     </div>
                </div>

                {/* Left Column: Side Widgets (4 Cols) */}
                 <div className="lg:col-span-4 space-y-8 sticky top-8">
                    <SideWidgets />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
