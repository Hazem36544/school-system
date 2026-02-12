import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentSearch from './pages/StudentSearch';
import StudentReports from './pages/StudentReports';
import AddReport from './pages/AddReport';
import SchoolAccount from './pages/SchoolAccount';

function App() {
  // --- 1. استعادة حالة الدخول من المتصفح لضمان عدم الخروج عند الـ Refresh ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('school_isLoggedIn') === 'true';
  });

  // دالة لتسجيل الدخول وحفظ الحالة
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('school_isLoggedIn', 'true');
  };

  // دالة لتسجيل الخروج ومسح الحالة
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('school_isLoggedIn');
  };

  return (
    // --- 2. إضافة الـ basename ليعمل الموقع على مسار /school-system/ ---
    <Router basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        {/* إذا كان مسجل دخول يذهب للداشبورد، وإلا يذهب للوجن */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} 
        />
        
        {/* حماية المسارات: لا تفتح إلا لو isLoggedIn = true */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />} 
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
          element={isLoggedIn ? <SchoolAccount onLogout={handleLogout} /> : <Navigate to="/" />} 
        />

        {/* مسار احتياطي لأي رابط خطأ */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;