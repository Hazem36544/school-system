import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. التهيئة المتزامنة: نقرأ التوكن الخاص بالمدرسة
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('wesal_school_token');
    return !!token; 
  });

  // حالة التحميل للتأكد من فحص التوكن قبل عرض أي صفحة محمية
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('wesal_school_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // 2. دالة تسجيل الدخول (مركزية: تحفظ التوكن والبيانات في مفاتيح المدرسة المعزولة)
  const login = (token, role, userData) => {
    if (token) localStorage.setItem('wesal_school_token', token);
    if (role) localStorage.setItem('wesal_school_user_role', role);
    if (userData) localStorage.setItem('wesal_school_user_data', JSON.stringify(userData));
    
    setIsAuthenticated(true);
  };
  
  // 3. دالة تسجيل الخروج (التنظيف الذكي الشامل لبيانات المدرسة فقط)
  const logout = () => {
    localStorage.removeItem('wesal_school_token');
    localStorage.removeItem('wesal_school_user_role');
    localStorage.removeItem('wesal_school_user_data');
    localStorage.removeItem('force_change_password');
    localStorage.removeItem('school_isLoggedIn'); // مسح المتغير القديم احتياطياً

    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook مخصص لتسهيل الاستخدام
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};