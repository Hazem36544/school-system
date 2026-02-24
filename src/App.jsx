import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentSearch from './pages/StudentSearch';
import StudentReports from './pages/StudentReports';
import AddReport from './pages/AddReport';
import SchoolAccount from './pages/SchoolAccount';

// Separate component for Routes to consume useAuth
const AppRoutes = () => {
  const { isLoggedIn, login } = useAuth();

  // ✅ التعديل الجديد: التحقق من وجود أمر إجباري لتغيير كلمة المرور
  const needsPasswordChange = localStorage.getItem('force_change_password') === 'true';

  const handleLoginSuccess = (userData) => {
    if (login) {
      // إذا كان الـ AuthContext يحتوي على دالة login، استخدمها لتحديث الـ State
      login(userData);
    } else {
      // حل بديل إجباري: إذا لم تكن الدالة موجودة، قم بتوجيه المتصفح للداشبورد مباشرة
      window.location.href = '/dashboard';
    }
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route 
          path="/" 
          // ✅ التعديل الدقيق هنا: إذا كان مسجل دخول *وليس* مجبراً على تغيير الباسورد، يذهب للداشبورد. 
          // غير ذلك يبقى في صفحة تسجيل الدخول ليعرض شاشة التغيير.
          element={(isLoggedIn && !needsPasswordChange) ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLoginSuccess} />} 
        />
        
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route 
          path="/search" 
          element={isLoggedIn ? <StudentSearch /> : <Navigate to="/" />} 
        />
        <Route 
          path="/reports/:id" 
          element={isLoggedIn ? <StudentReports /> : <Navigate to="/" />} 
        />
        <Route 
          path="/add-report" 
          element={isLoggedIn ? <AddReport /> : <Navigate to="/" />} 
        />
        <Route 
          path="/add-report/:id" 
          element={isLoggedIn ? <AddReport /> : <Navigate to="/" />} 
        />
        <Route 
          path="/account" 
          element={isLoggedIn ? <SchoolAccount /> : <Navigate to="/" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;