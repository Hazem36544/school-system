console.log("Current API URL:", import.meta.env.VITE_API_URL);
import axios from 'axios';

/**
 * 1. الإعدادات الأساسية
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://wesal.runasp.net'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * 2. Request Interceptor: حقن التوكن
 */
api.interceptors.request.use(
    (config) => {
        // ✅ التعديل الدقيق: البحث عن توكن المدرسة أولاً، ثم توكن النظام الأساسي لتجنب تعارض المشاريع
        const token = localStorage.getItem('wesal_school_token') || localStorage.getItem('wesal_token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * 3. Response Interceptor: معالجة الأخطاء بشكل موحد
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // ✅ إضافة خيار لتجاهل التوجيه التلقائي في حالة الاختبار الخفي (Ping)
        const skipRedirect = error.config?.skipAuthRedirect;

        // ✅ --- التقاط 403 للتوكن المقيد (الباسورد المؤقت) ---
        if (error.response && error.response.status === 403) {
            const serverError = error.response.data;
            // البحث عن الرسالة سواء كانت في detail أو title
            const message = serverError?.detail || serverError?.title || "";
            
            // إذا كانت الرسالة تحتوي على ذكر للباسورد المؤقت
            if (message.toLowerCase().includes("temporary password")) {
                console.warn("Temporary password detected - redirecting to change password...");
                localStorage.setItem('force_change_password', 'true'); // وضع علامة للمتصفح
                
                // لا تقم بعمل ريلود للصفحة إذا كنا نستخدم skipAuthRedirect
                if (!skipRedirect) {
                    window.location.href = '/'; 
                }
                return Promise.reject(error); // إيقاف تنفيذ الطلب الحالي
            }
        }

        // ✅ --- التعامل العادي مع 401 (انتهاء صلاحية التوكن) ---
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access - redirecting to login...");
            localStorage.removeItem('wesal_school_token'); // تنظيف التوكن القديم
            
            // لا تقم بعمل ريلود للصفحة إذا كنا نستخدم skipAuthRedirect
            if (!skipRedirect) {
                window.location.href = '/'; 
            }
        }
        
        const serverError = error.response?.data;
        if (serverError) {
            const message = serverError.detail || serverError.title || "حدث خطأ في الاتصال";
            error.message = message;
        }
        return Promise.reject(error);
    }
);

/**
 * --- [ A. خدمات الهوية - Auth ] ---
 */
export const authAPI = {
    loginVisitCenter: (creds) => api.post('/api/auth/visit-center-staff/sign-in', creds),
    loginCourtStaff: (creds) => api.post('/api/auth/court-staff/sign-in', creds),
    loginFamilyCourt: (creds) => api.post('/api/auth/family-court/sign-in', creds),
    loginSchool: (creds) => api.post('/api/auth/school/sign-in', creds),
    loginSystemAdmin: (creds) => api.post('/api/auth/system-admin/sign-in', creds),
    loginParent: (creds) => api.post('/api/auth/parent/sign-in', creds),
    changePassword: (data) => api.patch('/api/users/change-password', data),
    
    // محاكاة جلب المستخدم الحالي (يمكنك لاحقاً التخلي عنها واستخدام الدوال المخصصة لكل لوحة)
    getCurrentUser: () => {
        const savedUser = localStorage.getItem('wesal_user_data');
        if (savedUser) {
            return Promise.resolve({ data: JSON.parse(savedUser) });
        } else {
            return Promise.resolve({ 
                data: {
                    name: "مدرسة وصال التجريبية",
                    schoolName: "مدرسة وصال التجريبية",
                    address: "القاهرة - مصر",
                    location: "القاهرة - مصر",
                    phone: "01000000000",
                    email: "info@school.wesal.com"
                } 
            });
        }
    }
};

/**
 * --- [ B. خدمات إدارة القضايا والأسر - Court Workflow ] ---
 */
export const courtAPI = {
    enrollFamily: (data) => api.post('/api/families', data),
    getFamily: (id) => api.get(`/api/families/${id}`),
    searchFamilies: (params) => api.get('/api/courts/me/families', { params }),
    updateParent: (id, data) => api.put(`/api/parents/${id}`, data),
    createCase: (data) => api.post('/api/court-cases', data),
    getCaseByFamily: (familyId) => api.get(`/api/court-cases/${familyId}`),
    closeCase: (caseId, notes) => api.patch('/api/court-cases/close', { closureNotes: notes }, { params: { courtCaseId: caseId } }),
    createAlimony: (data) => api.post('/api/alimonies', data),
    updateAlimony: (id, data) => api.put(`/api/alimonies/${id}`, data, { params: { alimoneyId: id } }),
    deleteAlimony: (id) => api.delete(`/api/alimonies/${id}`, { params: { alimoneyId: id } }),
    getAlimonyByCourtCase: (caseId) => api.get(`/api/court-cases/${caseId}/alimony`),
    createCustody: (data) => api.post('/api/custodies', data),
    updateCustody: (id, data) => api.put(`/api/custodies/${id}`, data),
    deleteCustody: (id) => api.delete(`/api/custodies/${id}`),
    getCustodyByCourtCase: (caseId) => api.get(`/api/court-cases/${caseId}/custodies`),
    createSchedule: (data) => api.post('/api/visitation-schedules', data),
    updateSchedule: (id, data) => api.put(`/api/visitation-schedules/${id}`, data),
    deleteSchedule: (id) => api.delete(`/api/visitation-schedules/${id}`),
    getVisitationScheduleByCourtCase: (caseId) => api.get(`/api/court-cases/${caseId}/visitation-schedules`),
    listPaymentsDueByFamily: (familyId) => api.get(`/api/families/${familyId}/payments-due`),
    listPaymentsHistory: (paymentDueId) => api.get(`/api/payments-due/${paymentDueId}/payments`),
    withdrawPayment: (paymentDueId, data) => api.post(`/api/payments-due/${paymentDueId}/withdraw`, data),
};

/**
 * --- [ C. خدمات البيانات المساعدة - Lookups ] ---
 */
export const lookupAPI = {
    getVisitationLocations: (params) => api.get('/api/visitation-locations', { params }),
    createLocation: (data) => api.post('/api/visitation-locations', data),
    updateLocation: (id, data) => api.put(`/api/visitation-locations/${id}`, data),
    deleteLocation: (id) => api.delete(`/api/visitation-locations/${id}`),
};

/**
 * --- [ D. خدمات مركز الرؤية - Visitation Execution ] ---
 */
export const visitationAPI = {
    list: (params) => api.get('/api/visitations', { params }),
    checkIn: (id, nationalId) => api.patch(`/api/visitations/${id}/check-in`, { nationalId }),
    complete: (id) => api.patch(`/api/visitations/${id}/complete`),
    setCompanion: (id, nationalId) => api.patch(`/api/visitations/${id}`, { companionNationalId: nationalId }),
};

/**
 * --- [ E. خدمات المدرسة - Schools ] ---
 */
export const schoolAPI = {
    // ✅ إضافة دالة جلب بيانات المدرسة الحالية
    getCurrentSchool: () => api.get('/api/schools/me'),
    
    // ✅ إضافة دالة تحديث بيانات المدرسة
    updateSchoolProfile: (id, data) => api.put(`/api/schools/${id}`, data),

    listSchools: (params) => api.get('/api/schools', { params }),
    registerSchool: (data) => api.post('/api/schools', data),
    listChildren: (params) => api.get('/api/schools/me/children', { params }),
    
    // إزالة الـ headers ليتم إرسال الـ JSON بشكل صحيح
    uploadReport: (data) => api.post('/api/school-reports', data),
    
    listReportsByChild: (childId) => api.get(`/api/school-reports/${childId}`),
};

/**
 * --- [ F. الشكاوى - Complaints ] ---
 */
export const complaintsAPI = {
    create: (data) => api.post('/api/complaints', data),
    listMyComplaints: (params) => api.get('/api/courts/me/complaints', { params }), 
    updateStatus: (id, data) => api.patch(`/api/complaints/${id}/status`, data),
};

/**
 * --- [ G. التنبيهات والمخالفات - Obligation Alerts ] ---
 */
export const alertsAPI = {
    list: (params) => api.get('/api/obligation-alerts', { params }),
    updateStatus: (id, data) => api.patch(`/api/obligation-alerts/${id}/status`, data),
};

/**
 * --- [ H. طلبات التعديل - Custody Requests ] ---
 */
export const requestsAPI = {
    list: (params) => api.get('/api/custody-requests', { params }),
    process: (id, data) => api.patch(`/api/custody-requests/${id}/process`, data),
};

/**
 * --- [ I. الإشعارات والملفات - Common ] ---
 */
export const commonAPI = {
    // المستندات
    uploadDocument: (formData) => api.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getDocument: (id) => api.get(`/api/documents/${id}`),
    deleteDocument: (id) => api.delete(`/api/documents/${id}`),

    // الإشعارات
    getUnreadNotificationsCount: () => api.get('/api/notifications/unread-count'),
    listNotifications: (params) => api.get('/api/notifications/me', { params }),
    markAsRead: (id) => api.patch(`/api/notifications/${id}/read`),
    
    // الأجهزة
    registerDevice: (data) => api.post('/api/notifications/devices', data),
    unregisterDevice: (token) => api.delete(`/api/user-devices/${token}`),
};

export default api;