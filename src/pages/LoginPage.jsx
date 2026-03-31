import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. تم إضافة الاستيراد هنا
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  ArrowRight, // تم الاحتفاظ بها تحسباً لاستخدامك لها لاحقاً
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "/src/services/api";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate(); // 2. تم تعريف الـ navigate هنا
  const [step, setStep] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Capture force change password command and open screen automatically
  useEffect(() => {
    if (localStorage.getItem("force_change_password") === "true") {
      setStep("change_password");
      setPassword("");
      setError("يرجى تغيير كلمة المرور المؤقتة قبل الدخول إلى لوحة التحكم");
    }
  }, []);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!username || !password) {
      setError("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting school login...");
      const response = await api.post("/api/auth/school/sign-in", {
        username: username,
        password: password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem("wesal_school_token", response.data.token);

        // Check token before entering dashboard
        let isTempPassword = false;
        try {
          // Decode token to read data inside
          const payload = JSON.parse(atob(response.data.token.split(".")[1]));
          // If backend sent that password is temporary
          if (payload.tmp_pwd === "True" || payload.tmp_pwd === true) {
            isTempPassword = true;
          }
        } catch (e) {
          console.error("Error reading token", e);
        }

        if (isTempPassword) {
          // If temporary: prevent entry to dashboard and open change screen immediately
          console.log("Temporary password, redirecting to change screen...");
          setStep("change_password");
          toast("يجب عليك تأمين حسابك بكلمة مرور جديدة قبل الدخول", {
            icon: "🔒",
            duration: 4000,
          });
        } else {
          // If valid: enter dashboard safely
          console.log("Login successful");
          onLogin && onLogin(response.data);
        }
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        const errorMsg =
          err.response.data?.detail || err.response.data?.title || "";

        if (
          err.response.status === 403 &&
          (errorMsg.toLowerCase().includes("temporary password") ||
            errorMsg.toLowerCase().includes("change password"))
        ) {
          setStep("change_password");
          setError("");
          toast("يجب عليك تأمين حسابك بكلمة مرور جديدة قبل الدخول", {
            icon: "🔒",
            duration: 4000,
          });
        } else if (err.response.status === 401 || err.response.status === 404) {
          setError(
            "بيانات الدخول غير صحيحة. تحقق من اسم المستخدم وكلمة المرور.",
          );
        } else {
          setError(errorMsg || "خطأ في الخادم، يرجى المحاولة مرة أخرى لاحقاً.");
        }
      } else if (err.code === "ERR_NETWORK") {
        setError("فشل الاتصال. تأكد من تشغيل الخادم.");
      } else {
        setError("حدث خطأ غير متوقع.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();

    if (!password || !newPassword || !confirmPassword) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    if (newPassword.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.patch("/api/users/change-password", {
        oldPassword: password,
        newPassword: newPassword,
      });

      toast.success("تم تأمين الحساب بنجاح! يرجى تسجيل الدخول.");

      localStorage.removeItem("force_change_password");
      localStorage.removeItem("wesal_school_token");

      setTimeout(() => {
        // 3. التعديل الأهم هنا: استخدام navigate للعودة لصفحة اللوجين داخل المشروع
        navigate("/login", { replace: true });
        
        // إرجاع الواجهة لحالة تسجيل الدخول تحسباً
        setStep("login");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err) {
      console.error("Change Password Error Details:", err.response?.data);
      const validationErrors = err.response?.data?.errors;
      let errorMessage = "Failed to change password.";

      if (validationErrors) {
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors
            .map(
              (errItem) => errItem.description || "Password does not meet requirements",
            )
            .join(" - ");
        } else {
          errorMessage = Object.values(validationErrors).flat().join(" - ");
        }
      } else {
        errorMessage =
          err.response?.data?.detail ||
          err.response?.data?.title ||
          errorMessage;
      }

      setError(errorMessage);

      if (err.response?.status === 400) {
        toast.error(
          "يرجى التأكد من صحة كلمة المرور المؤقتة واستيفاء المتطلبات.",
        );
      } else {
        toast.error("حدث خطأ أثناء المحاولة.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast("يرجى الاتصال بالدعم الفني لمحكمة الأسرة لاستعادة حسابك.", {
      icon: "ℹ️",
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}
    >
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1e3a8a]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1e3a8a]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="w-full max-w-[460px] relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32">
            <img
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="Wesal Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-8" dir="rtl">
          <h1 className="text-3xl font-black text-[#1e3a8a] mb-2 tracking-tight">
            نظام إدارة المدارس
          </h1>
          <p className="text-sm font-bold text-gray-500 tracking-wider">
            بوابة وصال - لم الشمل
          </p>
        </div>

        {/* Regular Login Screen */}
        {step === "login" && (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">
            <h2 className="text-xl font-bold mb-8 text-center text-gray-800">
              تسجيل الدخول
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <div>
                <label className="block mb-2 text-gray-600 font-bold text-sm text-right">
                  اسم المستخدم (المدرسة)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sch-cairo-xxxx"
                  className="w-full text-left px-4 h-14 bg-gray-50 border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 rounded-2xl transition-all outline-none"
                  dir="ltr"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-600 font-bold text-sm text-right">
                  كلمة المرور
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full text-left pl-4 pr-12 h-14 bg-gray-50 border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 rounded-2xl transition-all outline-none font-mono text-lg"
                    dir="ltr"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold rounded-2xl mt-6 flex items-center justify-center gap-2 bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-bold text-gray-400 hover:text-[#1e3a8a] transition-colors"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Forced Change Password Screen */}
        {step === "change_password" && (
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 border border-blue-100 relative overflow-hidden animate-in zoom-in duration-300" dir="rtl">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-[#1e3a8a]"></div>

            <div className="flex flex-col items-center mb-8 mt-4">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1e3a8a]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-center text-gray-800 mb-2">
                تأمين الحساب
              </h2>
              <p className="text-center text-gray-500 text-sm leading-relaxed">
                يرجى تغيير كلمة المرور المؤقتة لحساب المدرسة إلى كلمة مرور جديدة خاصة بك لضمان السرية.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <div>
                <label className="block mb-2 text-gray-600 font-bold text-sm text-right">
                  كلمة المرور المؤقتة (الحالية)
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-left pl-4 pr-12 h-14 bg-gray-50 border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 rounded-2xl transition-all outline-none font-mono text-lg tracking-widest"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-600 font-bold text-sm text-right">
                  كلمة المرور الجديدة
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-left pl-4 pr-12 h-14 bg-gray-50 border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 rounded-2xl transition-all outline-none font-mono text-lg tracking-widest"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 text-gray-400 hover:text-[#1e3a8a] transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-600 font-bold text-sm text-right">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-left pl-4 pr-12 h-14 bg-gray-50 border border-gray-200 focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 rounded-2xl transition-all outline-none font-mono text-lg tracking-widest"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || !password || !newPassword || !confirmPassword
                }
                className="w-full h-14 text-lg font-bold rounded-2xl mt-8 flex items-center justify-center gap-2 bg-[#1e3a8a] text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> جاري التحديث...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" /> حفظ وتأمين الحساب
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}