import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Filter, User, MapPin, Calendar, BookOpen, GraduationCap, XCircle } from 'lucide-react';

import { studentsData } from '../data/students';

const StudentSearch = () => {
    // Mock Data
    const allStudents = studentsData;

    const [filters, setFilters] = useState({
        name: '',
        grade: 'الكل',
        classNum: 'الكل',
    });

    // Filter Logic
    const filteredStudents = allStudents.filter(student => {
        const matchesName = student.name.includes(filters.name);
        const matchesGrade = filters.grade === 'الكل' || student.grade === filters.grade;
        const matchesClass = filters.classNum === 'الكل' || student.classNum === filters.classNum;
        return matchesName && matchesGrade && matchesClass;
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'نشط': return 'bg-green-100 text-green-700';
            case 'حالة خاصة': return 'bg-red-100 text-red-700';
            case 'متابعة': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans" dir="rtl">
            <Sidebar />

            <div className="flex-1 mr-20 p-8 min-h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Replicated Style */}
                     <div className="bg-[#1e3a8a] text-white p-6 rounded-3xl shadow-lg relative overflow-hidden mb-8 flex justify-between items-center">
                        <div className="relative z-10">
                            <h1 className="text-2xl font-bold mb-1">البحث عن الطلاب</h1>
                            <p className="text-sm text-blue-100/90">ابحث عن الطلاب المسجلين في المدرسة</p>
                        </div>
                         <div className="relative z-10 bg-white/10 p-3 rounded-full border border-white/20">
                             <Search className="h-8 w-8 text-white" />
                         </div>

                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm mb-8">
                        <div className="flex items-center gap-2 mb-4 text-gray-700 font-bold">
                            <Filter className="h-5 w-5" />
                            <h2>البحث والفلتـرة</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500 font-medium">اسم الطالب</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                        placeholder="ايحث عن طالب.." 
                                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 transition-all pl-10"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm text-gray-500 font-medium">المرحلة الدراسية</label>
                                <select 
                                    name="grade"
                                    value={filters.grade}
                                    onChange={handleFilterChange}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 transition-all text-gray-700"
                                >
                                    <option value="الكل">الكل</option>
                                    <option value="الصف الثاني الابتدائي">الصف الثاني الابتدائي</option>
                                    <option value="الصف الثالث الابتدائي">الصف الثالث الابتدائي</option>
                                    <option value="الصف الرابع الابتدائي">الصف الرابع الابتدائي</option>
                                    <option value="الصف الخامس الابتدائي">الصف الخامس الابتدائي</option>
                                    <option value="الصف السادس الابتدائي">الصف السادس الابتدائي</option>
                                    <option value="الصف الأول الإعدادي">الصف الأول الإعدادي</option>
                                    <option value="الصف الثاني الإعدادي">الصف الثاني الإعدادي</option>
                                    <option value="الصف الثالث الإعدادي">الصف الثالث الإعدادي</option>
                                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                                </select>
                            </div>

                             <div className="space-y-2">
                                <label className="text-sm text-gray-500 font-medium">رقم الفصل</label>
                                <select 
                                     name="classNum"
                                     value={filters.classNum}
                                     onChange={handleFilterChange}
                                     className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-900 transition-all text-gray-700"
                                >
                                    <option value="الكل">الكل</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Display */}
                    <div className="mb-4 text-gray-500 text-sm font-medium">
                        عدد النتائج: <span className="font-bold text-gray-800">{filteredStudents.length}</span> من أصل <span className="font-bold text-gray-800">{allStudents.length}</span> طالب
                    </div>

                    {filteredStudents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map(student => (
                                <div key={student.id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative group">
                                     <span className={`absolute top-6 right-6 text-[10px] px-2 py-1 rounded-full font-bold ${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </span>
                                    
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="bg-blue-50 p-4 rounded-full mb-3">
                                            <User className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 text-center">{student.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono tracking-wider">{student.id}</p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <GraduationCap className="h-4 w-4 text-gray-400" />
                                            <span>{student.grade}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span>فصل {student.classNum}</span>
                                        </div>
                                         <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span>العمر: {student.age} سنوات</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mb-4">
                                         <p className="text-xs text-gray-400 mb-1">ولي الأمر</p>
                                         <p className="text-sm font-bold text-gray-700">{student.parent}</p>
                                         <p className="text-[10px] text-gray-400 mt-1">القضية: {student.caseNumber}</p>
                                    </div>

                                    <Link to={`/reports/${student.id}`} className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#172554] transition-colors shadow-sm flex justify-center items-center">
                                        عرض التفاصيل
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="bg-white rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                            <div className="bg-gray-100 p-6 rounded-full mb-6">
                                <Search className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد نتائج</h3>
                            <p className="text-gray-500">لم يتم العثور على طلاب يطابقون معايير البحث</p>
                            <button 
                                onClick={() => setFilters({ name: '', grade: 'الكل', classNum: 'الكل' })}
                                className="mt-6 text-[#1e3a8a] font-bold text-sm hover:underline flex items-center gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                مسح الفلاتر
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentSearch;
