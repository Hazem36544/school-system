import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { schoolAPI } from "../../services/api";
import { getErrorMessage } from "../../utils/errorHandler";

import StudentSearchHeader from "./components/StudentSearchHeader";
import StudentSearchBar from "./components/StudentSearchBar";
import StudentsGrid from "./components/StudentsGrid";

const StudentSearch = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // حالات البيانات والبحث
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // حالة الـ Pagination
  const [visibleCount, setVisibleCount] = useState(9);

  // جلب جميع الطلاب لعمل فلترة محلية سريعة
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await schoolAPI.listChildren({ PageNumber: 1, PageSize: 1000 });
      const items = response.data?.items || [];
      
      setStudents(items);
      setFilteredStudents(items);
      setTotalCount(response.data?.totalCount || items.length);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // تطبيق البحث اللحظي
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredStudents(students.filter(s => 
        s.fullName?.toLowerCase().includes(term) || 
        (s.id && s.id.toLowerCase().includes(term))
      ));
    }
    // تصفير الـ Pagination عند كل عملية بحث جديدة
    setVisibleCount(9);
  }, [searchTerm, students]);

  useEffect(() => {
      if (!loading) {
          const timer = setTimeout(() => {
              setIsPageLoaded(true);
          }, 50);
          return () => clearTimeout(timer);
      }
  }, [loading]);

  const clearSearch = () => {
    setSearchTerm('');
    setVisibleCount(9);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center min-h-[80vh] font-sans" dir="rtl">
        <Loader2 className="w-12 h-12 animate-spin text-[#1e3a8a] mb-4" />
        <span className="text-[#1e3a8a] font-bold text-lg">جاري تحميل سجل الطلاب...</span>
      </div>
    );
  }

return (
    <div className="w-full font-sans" dir="rtl">
        {/* ✅ البادينج p-4 md:p-8 اتنقل هنا زي صفحة الأكونت بالظبط */}
        <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            {/* ✅ الحاوية الداخلية بقت max-w-7xl mx-auto w-full بس، زي الأكونت */}
            <div className="max-w-7xl mx-auto w-full">

                <StudentSearchHeader />

                {/* باقي المحتوى */}
                <div className="flex flex-col gap-6 md:gap-8 pb-10">
                    <StudentSearchBar 
                      totalCount={totalCount} 
                      searchTerm={searchTerm} 
                      setSearchTerm={setSearchTerm} 
                      clearSearch={clearSearch} 
                    />

                    <StudentsGrid 
                      students={students} 
                      filteredStudents={filteredStudents} 
                      visibleCount={visibleCount} 
                      searchTerm={searchTerm} 
                      clearSearch={clearSearch} 
                      handleLoadMore={handleLoadMore} 
                    />
                </div>

            </div>
        </div>
    </div>
  );
};

export default StudentSearch;