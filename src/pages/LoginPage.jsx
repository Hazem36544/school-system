import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // شيلنا GraduationCap لأنه مبقاش مستخدم

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col justify-center items-center p-4 font-sans" dir="rtl">
      {/* Header Section */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="mb-4">
    {/* استخدام المسار الديناميكي لضمان عمل اللوجو بعد الرفع */}
    <img 
      src={`${import.meta.env.BASE_URL}logo.svg`} 
      alt="شعار وصال" 
      className="w-32 h-auto mx-auto hover:scale-105 transition-transform duration-300 drop-shadow-sm"
      onError={(e) => { e.target.src = 'https://via.placeholder.com/128?text=Wisal+School'; }} 
    />
</div>
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">نظام إدارة المدرسة</h1>
        <p className="text-gray-500 font-medium text-lg">لم الشمل</p>
      </div>

       {/* Login Card */}
      <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg p-10 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">تسجيل الدخول</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-bold text-gray-700">
              اسم المستخدم أو الرقم القومي
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
             <label htmlFor="password" className="block text-sm font-bold text-gray-700">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent transition-all text-gray-800 placeholder-gray-400 outline-none"
                placeholder="أدخل كلمة المرور"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1e3a8a] text-white font-bold py-4 px-4 rounded-xl hover:bg-[#172554] transition-all duration-200 mt-6 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            تسجيل الدخول
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-6 text-center">
          <a href="#" className="text-[#1e3a8a] font-bold text-sm hover:underline hover:text-blue-800 transition-colors">
            نسيت كلمة المرور؟
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center opacity-80">
        <div className="bg-white/50 backdrop-blur-sm py-2 px-6 rounded-full inline-block border border-white/60">
            <p className="text-gray-500 text-xs font-semibold">
            نظام آمن ومعتمد من وزارة العدل - محكمة الأسرة
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;