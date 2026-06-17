import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { schoolAPI, commonAPI } from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

import StudentReportsHeader from './components/StudentReportsHeader';
import StudentProfileSidebar from './components/StudentProfileSidebar';
import ReportsFilterAndList from './components/ReportsFilterAndList';
import UploadReportModal from './components/UploadReportModal';
import ReportInfoModal from './components/ReportInfoModal';
import ReportPreviewModal from './components/ReportPreviewModal';

const StudentReports = () => {
    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const { id } = useParams();
    const location = useLocation();

    const [student] = useState(location.state?.student || null);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableMonths, setAvailableMonths] = useState([]);

    // States للتفاعلات والنوافذ
    const [visibleCount, setVisibleCount] = useState(6);
    const [filterType, setFilterType] = useState('all');
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    
    // States للـ Preview
    const [showPreview, setShowPreview] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewReportType, setPreviewReportType] = useState('Attendance');
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const reportsRes = await schoolAPI.listReportsByChild(id, { PageNumber: 1, PageSize: 100 });
            const fetchedReports = reportsRes.data?.items || [];
            
            fetchedReports.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
            setReports(fetchedReports);
            setFilteredReports(fetchedReports);

            const monthsSet = new Set();
            fetchedReports.forEach(r => {
                if (r.uploadedAt) {
                    const d = new Date(r.uploadedAt);
                    monthsSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
                }
            });
            
            const formattedMonths = Array.from(monthsSet).sort((a, b) => b.localeCompare(a)).map(mStr => {
                const [year, month] = mStr.split('-');
                return { value: mStr, label: new Date(year, parseInt(month) - 1, 1).toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' }) };
            });
            
            setAvailableMonths([{ value: 'all', label: 'جميع الشهور' }, ...formattedMonths]);
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (id) fetchReports(); }, [id]);

    useEffect(() => {
        if (!loading) { const timer = setTimeout(() => setIsPageLoaded(true), 50); return () => clearTimeout(timer); }
    }, [loading]);

    useEffect(() => {
        let result = reports;
        if (filterType !== 'all') result = result.filter(r => r.reportType === filterType);
        if (selectedMonth !== 'all') {
            result = result.filter(r => {
                if (!r.uploadedAt) return false;
                const d = new Date(r.uploadedAt);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === selectedMonth;
            });
        }
        setFilteredReports(result);
        setVisibleCount(6); 
    }, [filterType, selectedMonth, reports]);

    const forceDownloadFile = async (url, fileName) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(objectUrl);
            return true;
        } catch (error) { return false; }
    };

    const handleDownload = async (report) => {
        try {
            setDownloadingId(report.id);
            const response = await commonAPI.getDocument(report.documentId);
            const downloadUrl = response.data?.downloadUrl || response.data?.fileUrl;
            if (!downloadUrl) { toast.error("عذراً، رابط تحميل هذا الملف غير متوفر حالياً."); return; }

            const API_BASE = import.meta.env.VITE_API_URL || 'http://wesal.runasp.net';
            const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : `${API_BASE}${downloadUrl}`;
            const fileName = response.data?.fileName || `report_${student?.fullName || 'student'}.pdf`;

            const toastId = toast.loading("جاري تجهيز الملف للتنزيل...");
            const success = await forceDownloadFile(fullUrl, fileName);
            if (success) toast.success("تم التنزيل بنجاح!", { id: toastId });
            else { window.open(fullUrl, '_blank'); toast.success("جاري التنزيل...", { id: toastId }); }
        } catch (error) { toast.error(getErrorMessage(error)); } 
        finally { setDownloadingId(null); }
    };

    const handleDownloadFromPreview = async () => {
        if (!previewUrl) return;
        const toastId = toast.loading("جاري التنزيل...");
        const success = await forceDownloadFile(previewUrl, `report-${Date.now()}.pdf`);
        if (success) toast.success("تم التنزيل بنجاح!", { id: toastId });
        else { window.open(previewUrl, '_blank'); toast.success("جاري التنزيل...", { id: toastId }); }
    };

    const handleOpenPreview = async (documentId, rType = 'Attendance') => {
        if (!documentId) { toast.error("معرف الملف غير متاح"); return; }
        setIsPreviewLoading(true); setPreviewReportType(rType);
        const toastId = toast.loading("جاري جلب الملف للمعاينة...");
        try {
            const response = await commonAPI.getDocument(documentId);
            const url = response.data?.downloadUrl || response.data?.fileUrl;
            if (url) {
                const API_BASE = import.meta.env.VITE_API_URL || 'http://wesal.runasp.net';
                setPreviewUrl(url.startsWith('http') ? url : `${API_BASE}${url}`);
                setSelectedReport(null); // قفل نافذة الـ Info لو مفتوحة
                setShowPreview(true);
                toast.dismiss(toastId);
            } else toast.error("عذراً، رابط الملف غير متوفر", { id: toastId });
        } catch (error) { toast.error(getErrorMessage(error), { id: toastId }); } 
        finally { setIsPreviewLoading(false); }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-12 h-12 text-[#1e3a8a] animate-spin" /></div>;
    if (!student) return <div className="flex flex-col items-center justify-center min-h-[60vh] font-sans animate-in fade-in" dir="rtl"><AlertCircle className="w-16 h-16 text-gray-400 mb-4" /><h2 className="text-xl font-bold text-gray-700">بيانات الطالب غير موجودة</h2><Link to="/search" className="mt-4 text-[#1e3a8a] underline font-bold">العودة للبحث</Link></div>;

    return (
        <div className="w-full font-sans" dir="rtl">
            <div className={`p-4 md:p-8 w-full transition-all duration-500 ease-out transform ${isPageLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
                <div className="max-w-7xl mx-auto w-full">
                    <StudentReportsHeader student={student} />
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <StudentProfileSidebar 
                            student={student} 
                            reportsCount={reports.length} 
                            lastUploadDate={reports.length > 0 ? new Date(reports[0].uploadedAt).toLocaleDateString('ar-EG') : '---'} 
                            onOpenUploadModal={() => setIsUploadModalOpen(true)} 
                        />
                        <ReportsFilterAndList 
                            reports={reports} filteredReports={filteredReports} visibleCount={visibleCount} 
                            onLoadMore={() => setVisibleCount(prev => prev + 6)}
                            filterType={filterType} setFilterType={setFilterType}
                            selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                            availableMonths={availableMonths}
                            onSelectReport={setSelectedReport}
                            onOpenPreview={handleOpenPreview}
                            isPreviewLoading={isPreviewLoading}
                        />
                    </div>
                </div>
            </div>

            {isUploadModalOpen && (
                <UploadReportModal childId={id} onClose={() => setIsUploadModalOpen(false)} onSuccess={() => { setIsUploadModalOpen(false); fetchReports(); }} />
            )}

            {selectedReport && !showPreview && (
                <ReportInfoModal report={selectedReport} student={student} onClose={() => setSelectedReport(null)} onDownload={handleDownload} onOpenPreview={handleOpenPreview} downloadingId={downloadingId} isPreviewLoading={isPreviewLoading} />
            )}

            {showPreview && previewUrl && (
                <ReportPreviewModal previewUrl={previewUrl} reportType={previewReportType} onClose={() => setShowPreview(false)} onDownload={handleDownloadFromPreview} />
            )}
        </div>
    );
};

export default StudentReports;