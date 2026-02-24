import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // ✅ التعديل الأول: استخدام اسم التوكن الصحيح (wesal_school_token) الذي تم حفظه في صفحة تسجيل الدخول
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return !!localStorage.getItem('wesal_school_token'); 
    });

    const login = (userData) => {
        setIsLoggedIn(true);
        // (حفظ التوكن يتم بالفعل داخل LoginPage، لذلك نكتفي بتحديث الـ State هنا)
    };

    const logout = () => {
        setIsLoggedIn(false);
        
        // ✅ التعديل الأهم: مسح التوكن الصحيح (wesal_school_token) والتنظيف الشامل
        localStorage.removeItem('wesal_school_token'); // تم تصحيح الاسم هنا
        localStorage.removeItem('force_change_password'); // مسح حالة الباسورد
        localStorage.removeItem('school_isLoggedIn'); // مسح المتغير القديم احتياطياً
        
        // توجيه إجباري لصفحة اللوجين لضمان تفريغ الذاكرة (Memory) من أي بيانات عالقة
        window.location.href = '/'; 
    };

    const value = {
        isLoggedIn,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};