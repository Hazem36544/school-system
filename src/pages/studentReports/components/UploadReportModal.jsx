import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, ChevronDown, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { schoolAPI, commonAPI } from '../../../services/api';
import { getErrorMessage } from '../../../utils/errorHandler';
import { uploadOptions } from './ReportHelpers';

const UploadReportModal = ({ childId, onClose, onSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [reportFile, setReportFile] = useState(null);
    const [reportType, setReportType] = useState('Attendance');
    const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
    const [uploadHighlightedIndex, setUploadHighlightedIndex] = useState(-1);
    const uploadDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (uploadDropdownRef.current && !uploadDropdownRef.current.contains(event.target)) {
                setIsUploadDropdownOpen(false); setUploadHighlightedIndex(-1);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleUploadKeyDown = (e) => {
        if (!isUploadDropdownOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsUploadDropdownOpen(true); }
            return;
        }
        if (e.key === 'ArrowDown') { e.preventDefault(); setUploadHighlightedIndex(prev => (prev < uploadOptions.length - 1 ? prev + 1 : prev)); } 
        else if (e.key === 'ArrowUp') { e.preventDefault(); setUploadHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev)); } 
        else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (uploadHighlightedIndex >= 0 && uploadHighlightedIndex < uploadOptions.length) {
                setReportType(uploadOptions[uploadHighlightedIndex].value); setIsUploadDropdownOpen(false);
            }
        } else if (e.key === 'Escape') { setIsUploadDropdownOpen(false); setUploadHighlightedIndex(-1); }
    };

    const handleUploadReport = async (e) => {
        e.preventDefault();
        if (!reportFile) { toast.error("يرجى اختيار ملف التقرير أولاً."); return; }
        if (reportFile.type !== 'application/pdf') { toast.error("عذراً، يُسمح فقط برفع التقارير بصيغة PDF."); return; }

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', reportFile);
            const docRes = await commonAPI.uploadDocument(formData);
            const documentId = docRes.data;

            if (!documentId) throw new Error("Document upload failed");

            await schoolAPI.uploadReport({ childId, documentId, reportType });
            toast.success("تم رفع التقرير واعتماده بنجاح!");
            onSuccess();
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(getErrorMessage(error));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20" dir="rtl">
                <div className="bg-gray-50 p-6 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-[#1e3a8a] text-lg md:text-xl font-bold flex items-center gap-2">
                        <Upload className="w-5 h-5 md:w-6 md:h-6" /> رفع تقرير جديد
                    </h2>
                    <button onClick={onClose} className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-800 shadow-sm transition-all border-none outline-none cursor-pointer">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleUploadReport} className="p-6 md:p-8 space-y-6 text-right">
                    <div className="relative" ref={uploadDropdownRef}>
                        <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">اختر نوع التقرير</label>
                        <div tabIndex={0} onKeyDown={handleUploadKeyDown} onClick={() => setIsUploadDropdownOpen(!isUploadDropdownOpen)}
                            className={`w-full h-14 px-4 rounded-2xl flex items-center justify-between outline-none transition-all font-bold text-sm border cursor-pointer shadow-sm ${isUploadDropdownOpen ? 'border-[#1e3a8a] ring-2 ring-[#1e3a8a]/20 bg-white' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className="text-gray-800">{uploadOptions.find(o => o.value === reportType)?.label || 'اختر...'}</span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${isUploadDropdownOpen ? 'rotate-180 text-[#1e3a8a]' : ''}`} />
                        </div>
                        {isUploadDropdownOpen && (
                            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                                <ul className="py-2 m-0 list-none max-h-60 overflow-y-auto custom-scrollbar">
                                    {uploadOptions.map((option, index) => (
                                        <li key={option.value} onClick={() => { setReportType(option.value); setIsUploadDropdownOpen(false); }} onMouseEnter={() => setUploadHighlightedIndex(index)}
                                            className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center ${reportType === option.value ? 'bg-blue-50 text-[#1e3a8a]' : ''} ${uploadHighlightedIndex === index && reportType !== option.value ? 'bg-gray-50 text-[#1e3a8a]' : 'text-gray-600'}`}
                                        >
                                            {option.label}
                                            {reportType === option.value && <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] md:text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">ارفق مستند PDF</label>
                        <div className="relative group">
                            <input type="file" onChange={(e) => setReportFile(e.target.files[0])} className="hidden" id="report-file-input" accept=".pdf" />
                            <label htmlFor="report-file-input" className="w-full p-6 md:p-8 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all text-center">
                                <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 text-blue-600"><Upload className="w-5 h-5 md:w-6 md:h-6" /></div>
                                <p className="text-xs md:text-sm font-bold text-blue-900 mb-1">{reportFile ? reportFile.name : "انقر لاختيار ملف PDF"}</p>
                                <p className="text-[10px] text-blue-400 font-medium">الحد الأقصى: 10MB (PDF فقط)</p>
                            </label>
                        </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] md:text-[11px] text-amber-800 leading-relaxed font-medium">من خلال رفع هذا التقرير، سيتم مشاركته مع نظام المحكمة وأولياء الأمور فوراً. تأكد من دقة البيانات.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                        <button type="submit" disabled={uploading || !reportFile} className="w-full sm:flex-[2] bg-[#1e3a8a] text-white py-3 md:py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 border-none outline-none cursor-pointer">
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : null} رفع التقرير
                        </button>
                        <button type="button" onClick={onClose} className="w-full sm:flex-1 bg-white text-gray-600 py-3 md:py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all border border-gray-200 active:scale-95 border-none outline-none cursor-pointer">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadReportModal;