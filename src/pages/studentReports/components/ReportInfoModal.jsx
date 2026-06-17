import React from 'react';
import { FileText, X, AlertCircle, Download, Loader2, Eye } from 'lucide-react';
import { getReportTheme, translateReportType } from './ReportHelpers';

const ReportInfoModal = ({ report, student, onClose, onDownload, onOpenPreview, downloadingId, isPreviewLoading }) => {
    const modalTheme = getReportTheme(report.reportType);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" dir="rtl">
                <div className={`p-6 md:p-7 flex justify-between items-center ${modalTheme.headerBg}`}>
                    <h2 className="text-white text-lg md:text-xl font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 md:w-6 md:h-6" /> توثيق التقرير
                    </h2>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white border-none outline-none cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 md:p-8 bg-gray-50/50 text-right">
                    <div className="bg-white p-5 md:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div>
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">الطالب</p>
                            <p className="text-lg md:text-xl font-black text-gray-800 line-clamp-1">{student.fullName}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-gray-100">
                            <div>
                                <p className="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">فئة التقرير</p>
                                <p className={`text-sm md:text-md font-bold ${modalTheme.text}`}>{translateReportType(report.reportType)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] md:text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">تاريخ الرفع</p>
                                <p className="text-sm md:text-md font-bold text-gray-700">
                                    {new Date(report.uploadedAt).toLocaleDateString('ar-EG')}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-gray-100">
                            <p className="text-[10px] text-gray-300 font-bold mb-2 uppercase tracking-widest">مرجع المستند الداخلي</p>
                            <p className="text-[10px] md:text-xs font-mono text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100 break-all">{report.documentId}</p>
                        </div>
                    </div>

                    <div className={`${modalTheme.bg} p-4 md:p-5 rounded-2xl mt-6 border ${modalTheme.borderColor} flex items-start gap-3 md:gap-4`}>
                        <div className={`${modalTheme.iconBg} p-2 rounded-lg shrink-0`}>
                            <AlertCircle className={`w-4 h-4 md:w-5 md:h-5 ${modalTheme.text}`} />
                        </div>
                        <p className={`text-[10px] md:text-xs ${modalTheme.darkText} font-bold leading-relaxed`}>
                            هذا المستند محمي ومُشفر ومتاح حصرياً للمدرسة، المحكمة، وأولياء الأمور المصرح لهم.
                        </p>
                    </div>
                </div>

                <div className="p-4 md:p-6 border-t border-gray-100 bg-white flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button onClick={() => onDownload(report)} disabled={downloadingId === report.id || isPreviewLoading} className={`w-full sm:flex-1 bg-white ${modalTheme.outlineBtn} py-3 md:py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 outline-none cursor-pointer`} title="تنزيل الـ PDF">
                        {downloadingId === report.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />} تنزيل
                    </button>
                    <button onClick={() => onOpenPreview(report.documentId, report.reportType)} disabled={isPreviewLoading} className={`w-full sm:flex-[2] ${modalTheme.primaryBtn} py-3 md:py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 border-none outline-none cursor-pointer`}>
                        {isPreviewLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Eye className="h-5 w-5" />} عرض التقرير
                    </button>
                    <button onClick={onClose} className="w-full sm:flex-1 bg-gray-50 text-gray-700 py-3 md:py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200 active:scale-95 outline-none cursor-pointer">
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportInfoModal;