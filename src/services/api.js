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
 * 2. Request Interceptor: حقن التوكن الخاص بالمدرسة فقط
 */
api.interceptors.request.use(
    (config) => {
        // ✅ التعديل الدقيق: استخدام مفتاح المدرسة المعزول فقط
        const token = localStorage.getItem('wesal_school_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * 3. Response Interceptor: معالجة الأخطاء والتنظيف الذكي
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const skipRedirect = error.config?.skipAuthRedirect;

        // ✅ --- التقاط 403 للتوكن المقيد (الباسورد المؤقت) ---
        if (error.response && error.response.status === 403) {
            const serverError = error.response.data;
            const message = serverError?.detail || serverError?.title || "";

            if (message.toLowerCase().includes("temporary password")) {
                console.warn("Temporary password detected - redirecting to change password...");
                localStorage.setItem('force_change_password', 'true'); 

                if (!skipRedirect) {
                    window.location.href = '/';
                }
                return Promise.reject(error); 
            }
        }

        // ✅ --- التعامل العادي مع 401 (انتهاء صلاحية التوكن) ---
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access - redirecting to login...");
            // ✅ التنظيف الذكي: مسح بيانات المدرسة فقط
            localStorage.removeItem('wesal_school_token'); 
            localStorage.removeItem('wesal_school_user_data'); 
            localStorage.removeItem('wesal_school_user_role');

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
    // ⚠️ انتبه: البيانات المرسلة هنا ستكون { username, password }
    loginSchool: (creds) => api.post('/api/auth/school/sign-in', creds),
    changePassword: (data) => api.patch('/api/users/change-password', data),
    
    // ✅ جلب بيانات المدرسة الحالية
    getCurrentSchool: () => api.get('/api/schools/me')
};

/**
 * --- [ E. خدمات المدرسة - Schools ] ---
 */
export const schoolAPI = {
    // تحديث بيانات المدرسة
    updateSchoolProfile: (id, data) => api.put(`/api/schools/${id}`, data),
    listSchools: (params) => api.get('/api/schools', { params }),
    registerSchool: (data) => api.post('/api/schools', data),
    listChildren: (params) => api.get('/api/schools/me/children', { params }),
    // رفع تقرير المدرسة (يتم الإرسال كـ JSON بناءً على الـ Swagger الجديد)
    uploadReport: (data) => api.post('/api/school-reports', data),
    listReportsByChild: (childId) => api.get(`/api/school-reports/${childId}`),
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