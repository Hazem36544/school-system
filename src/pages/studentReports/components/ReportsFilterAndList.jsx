import React, { useState, useEffect, useRef } from 'react';
import { FileText, Filter, ChevronDown, CheckCircle, Calendar, BookOpen, Loader2, Eye } from 'lucide-react';
import { filterOptions, getReportTheme, translateReportType } from './ReportHelpers';

const ReportsFilterAndList = ({ 
    reports, filteredReports, visibleCount, onLoadMore, 
    filterType, setFilterType, selectedMonth, setSelectedMonth, availableMonths,
    onSelectReport, onOpenPreview, isPreviewLoading 
}) => {
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const [filterHighlightedIndex, setFilterHighlightedIndex] = useState(-1);
    const filterDropdownRef = useRef(null);

    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
    const [monthHighlightedIndex, setMonthHighlightedIndex] = useState(-1);
    const monthDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
                setIsFilterDropdownOpen(false); setFilterHighlightedIndex(-1);
            }
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
                setIsMonthDropdownOpen(false); setMonthHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFilterKeyDown = (e) => {
        if (!isFilterDropdownOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFilterDropdownOpen(true); }
            return;
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); setFilterHighlightedIndex(prev => (prev < filterOptions.length - 1 ? prev + 1 : prev)); } 
        else if (e.key === 'ArrowUp') { e.preventDefault(); setFilterHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev)); } 
        else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (filterHighlightedIndex >= 0 && filterHighlightedIndex < filterOptions.length) {
                setFilterType(filterOptions[filterHighlightedIndex].value); setIsFilterDropdownOpen(false);
            }
        } else if (e.key === 'Escape') { setIsFilterDropdownOpen(false); setFilterHighlightedIndex(-1); }
    };

    const handleMonthKeyDown = (e) => {
        if (!isMonthDropdownOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsMonthDropdownOpen(true); }
            return;
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); setMonthHighlightedIndex(prev => (prev < availableMonths.length - 1 ? prev + 1 : prev)); } 
        else if (e.key === 'ArrowUp') { e.preventDefault(); setMonthHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev)); } 
        else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (monthHighlightedIndex >= 0 && monthHighlightedIndex < availableMonths.length) {
                setSelectedMonth(availableMonths[monthHighlightedIndex].value); setIsMonthDropdownOpen(false);
            }
        } else if (e.key === 'Escape') { setIsMonthDropdownOpen(false); setMonthHighlightedIndex(-1); }
    };

    return (
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-2">
            
            {/* ✅ تم التعديل هنا لضمان عدم خروج الفلاتر عن الكارت باستخدام xl بدل md */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 md:p-5 rounded-[1.5rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 px-2 shrink-0 mb-2 xl:mb-0">
                    <h3 className="text-gray-700 font-bold text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#1e3a8a]" /> سجل التقارير
                    </h3>
                </div>

                {reports.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                        
                        {/* فلتر النوع */}
                        {/* ✅ تم إضافة sm:flex-1 لكي يتمدد بمرونة ولا يخرج من الشاشة */}
                        <div className="relative w-full sm:flex-1 xl:w-56" ref={filterDropdownRef}>
                            <div tabIndex={0} onKeyDown={handleFilterKeyDown} onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className={`w-full h-12 px-4 pr-10 rounded-xl flex items-center justify-between outline-none transition-all font-bold text-sm border cursor-pointer shadow-sm ${isFilterDropdownOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 bg-white' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                            >
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <span className="text-gray-800 truncate pl-2">{filterOptions.find(o => o.value === filterType)?.label}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isFilterDropdownOpen ? 'rotate-180 text-[#1e3a8a]' : ''}`} />
                            </div>
                            {isFilterDropdownOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                    <ul className="py-2 m-0 list-none max-h-60 overflow-y-auto custom-scrollbar">
                                        {filterOptions.map((option, index) => (
                                            <li key={option.value} onClick={() => { setFilterType(option.value); setIsFilterDropdownOpen(false); }} onMouseEnter={() => setFilterHighlightedIndex(index)}
                                                className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center ${filterType === option.value ? 'bg-blue-50 text-[#1e3a8a]' : ''} ${filterHighlightedIndex === index && filterType !== option.value ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}`}
                                            >
                                                {option.label}
                                                {filterType === option.value && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* فلتر الشهر */}
                        {availableMonths.length > 1 && (
                            <div className="relative w-full sm:flex-1 xl:w-56" ref={monthDropdownRef}>
                                <div tabIndex={0} onKeyDown={handleMonthKeyDown} onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                                    className={`w-full h-12 px-4 pr-10 rounded-xl flex items-center justify-between outline-none transition-all font-bold text-sm border cursor-pointer shadow-sm ${isMonthDropdownOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 bg-white' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                                >
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <span className="text-gray-800 truncate pl-2">{availableMonths.find(o => o.value === selectedMonth)?.label}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isMonthDropdownOpen ? 'rotate-180 text-[#1e3a8a]' : ''}`} />
                                </div>
                                {isMonthDropdownOpen && (
                                    <div className="absolute top-[calc(100%+8px)] right-0 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                        <ul className="py-2 m-0 list-none max-h-60 overflow-y-auto custom-scrollbar">
                                            {availableMonths.map((option, index) => (
                                                <li key={option.value} onClick={() => { setSelectedMonth(option.value); setIsMonthDropdownOpen(false); }} onMouseEnter={() => setMonthHighlightedIndex(index)}
                                                    className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center ${selectedMonth === option.value ? 'bg-blue-50 text-[#1e3a8a]' : ''} ${monthHighlightedIndex === index && selectedMonth !== option.value ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}`}
                                                >
                                                    {option.label}
                                                    {selectedMonth === option.value && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* عرض الحالات والتقارير */}
            {reports.length === 0 ? (
                <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-20 text-center shadow-sm border border-dashed border-gray-200">
                    <div className="bg-gray-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                        <FileText className="h-8 w-8 md:h-10 md:w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">لا توجد تقارير متاحة</h3>
                    <p className="text-gray-500 text-sm md:text-base max-w-sm mx-auto">لا توجد تقارير مدرسية مرفوعة لهذا الطالب. استخدم زر الرفع لإضافة تقريرك الأول.</p>
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-in fade-in">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Filter className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="font-bold text-lg text-gray-700">لا توجد تقارير مطابقة</p>
                    <p className="text-sm font-medium text-gray-500 mt-2 text-center max-w-sm">لم يتم العثور على تقارير تطابق الفلاتر المحددة (النوع / الشهر).</p>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in">
                    {filteredReports.slice(0, visibleCount).map((report) => {
                        const theme = getReportTheme(report.reportType);
                        return (
                            <div key={report.id} className={`bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100/50 hover:shadow-lg ${theme.hoverBorder} transition-all group overflow-hidden relative flex flex-col`}>
                                <div className={`absolute top-0 left-0 w-24 h-24 ${theme.bg} rounded-br-full -translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform opacity-50 pointer-events-none`}></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-2xl ${theme.bg} flex items-center justify-center shrink-0 shadow-sm border border-white/50`}>
                                            <FileText className={`w-6 h-6 ${theme.text}`} />
                                        </div>
                                        <div className="text-right">
                                            <h4 className={`text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-2 transition-colors duration-300 font-sans ${theme.hoverText}`}>
                                                {translateReportType(report.reportType)}
                                            </h4>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
                                                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                                                    {new Date(report.uploadedAt).toLocaleString('ar-EG')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-50 relative z-10">
                                    <button onClick={() => onSelectReport(report)} className={`w-full ${theme.secondaryBtn} py-3 md:py-4 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all border-none outline-none cursor-pointer`}>
                                        <BookOpen className="h-4 w-4 md:h-5 md:w-5 shrink-0" /> تفاصيل التوثيق
                                    </button>
                                    <button onClick={() => onOpenPreview(report.documentId, report.reportType)} disabled={isPreviewLoading} className={`w-full ${theme.primaryBtn} py-3 md:py-4 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 border-none outline-none cursor-pointer`}>
                                        {isPreviewLoading ? <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <Eye className="h-4 w-4 md:h-5 md:w-5 shrink-0" />} عرض التقرير
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {visibleCount < filteredReports.length && (
                        <div className="flex justify-center mt-8 pt-4 animate-in fade-in">
                            <button onClick={onLoadMore} className="px-8 py-3.5 bg-white border-2 border-blue-100 text-[#1e3a8a] rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-2 outline-none active:scale-95 border-none">
                                <ChevronDown className="w-5 h-5" /> عرض المزيد من التقارير
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportsFilterAndList;