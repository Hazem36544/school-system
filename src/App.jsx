import React from 'react';
// ✅ 1. تغيير BrowserRouter لـ HashRouter
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// ✅ 2. استدعاء AuthProvider و useAuth من الكونتكست الجديد
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentSearch from './pages/StudentSearch';
import StudentReports from './pages/StudentReports';
import AddReport from './pages/AddReport';
import SchoolAccount from './pages/SchoolAccount';

// ✅ 3. إنشاء مكون ProtectedRoute للتحقق من الجلسة (نفس اللي عملناه في مركز الرؤية)
const ProtectedRoute = ({ children }) => {
  // استخدام isAuthenticated و isLoading من الكونتكست الجديد
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center font-bold text-[#1e3a8a]">جاري التحقق من الصلاحيات...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// مكون منفصل لمسارات التطبيق
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  // التحقق من وجود أمر إجباري لتغيير كلمة المرور
  const needsPasswordChange = localStorage.getItem('force_change_password') === 'true';

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* مسار اللوجين */}
        <Route 
          path="/" 
          element={(isAuthenticated && !needsPasswordChange) ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        
        {/* ✅ مسارات محمية باستخدام ProtectedRoute */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <StudentSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports/:id" 
          element={
            <ProtectedRoute>
              <StudentReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-report" 
          element={
            <ProtectedRoute>
              <AddReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-report/:id" 
          element={
            <ProtectedRoute>
              <AddReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <SchoolAccount />
            </ProtectedRoute>
          } 
        />

        {/* مسار افتراضي */}
        <Route path="*" element={<Navigate to="/" replace />} />
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