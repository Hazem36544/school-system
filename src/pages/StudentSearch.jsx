import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Search,
  Filter,
  User,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  XCircle,
  Loader2,
  ChevronLeft,
  Eye,
  Upload,
  UserCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { schoolAPI } from "../services/api";

const StudentSearch = ({ onLogout }) => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch student list from API
  const fetchStudents = async (query = '') => {
    try {
      setLoading(true);
      const params = { PageNumber: 1, PageSize: 100 };
      if (query) params.name = query;
      const response = await schoolAPI.listChildren(params);
      setStudents(response.data?.items || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("An error occurred while fetching the student list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = () => {
    fetchStudents(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans" dir="rtl">
      <Sidebar onLogout={onLogout} />

      <div className="flex-1 mr-24 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto">

          {/* 1. Header (School Management Style) */}
          <div className="relative w-full bg-[#1e3a8a] rounded-[2.5rem] p-8 text-white flex items-center justify-between overflow-hidden shadow-xl mb-8">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2 opacity-50"></div>

            <div className="flex items-center gap-6 relative z-10">
              <button
                onClick={() => navigate(-1)}
                className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all border-none"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="text-right">
                <h1 className="text-3xl font-bold mb-1">الطلاب</h1>
              </div>
            </div>
          </div>

          {/* 2. Search Section */}
          <div className="space-y-8 mb-10">
            {/* Unified Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="ابحث عن الطلاب بالاسم..."
                  className="w-full pr-12 h-14 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all font-medium text-gray-800"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-[#1e3a8a] text-white px-8 h-14 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>بحث</span>
              </button>
            </div>

            {/* Total Count Stat */}
            <div className="flex justify-start px-2">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-[#1e3a8a] shadow-sm border border-gray-100">
                  <UserCircle className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-slate-900 leading-none">{students.length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">إجمالي الطلاب</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Students Grid (School Management Grid View Style) */}
          {loading ? (
            <div className="flex justify-center items-center py-24 bg-white/50 rounded-[3rem] border border-dashed border-gray-200">
              <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a]" />
            </div>
          ) : students.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200 shadow-sm">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">لم يتم العثور على نتائج</h3>
              <p className="text-gray-500 max-w-md mx-auto">لم نتمكن من العثور على أي طلاب يطابقون معايير البحث الخاصة بك. حاول كتابة اسم آخر.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
              {students.map((student) => {
                const displayName = student.fullName || 'طالب غير محدد';
                const displayAge = student.age ? `${student.age} سنة` : '---';
                const displayGender = student.gender === 'Male' ? 'ذكر' : (student.gender === 'Female' ? 'أنثى' : '---');

                return (
                  <div
                    key={student.id}
                    className="bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] p-8 group border-transparent hover:border-blue-100 flex flex-col h-full"
                  >
                    {/* Card Top Section */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-all duration-300 shadow-sm font-bold text-xl uppercase">
                        {displayName.charAt(0)}
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="mb-6 flex-1 text-right">
                      <h3 className="font-bold text-gray-800 text-xl mb-3 line-clamp-1 group-hover:text-[#1e3a8a] transition-colors" title={displayName}>
                        {displayName}
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded-xl">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{displayGender}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-2 rounded-xl">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{displayAge}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <Link
                      to={`/reports/${student.id}`}
                      state={{ student }}
                      className="w-full bg-gray-50 text-[#1e3a8a] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#1e3a8a] hover:text-white transition-all border border-gray-100 group-hover:shadow-lg group-hover:shadow-blue-900/10"
                    >
                      <Eye className="h-4 w-4" />
                      <span>عرض التقارير</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;
