import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errorHandler";

import { parseJwtSafely } from "./components/SchoolLoginHelpers";
import { SchoolHeader, SchoolFooter } from "./components/SchoolLayout";
import SchoolLoginForm from "./components/SchoolLoginForm";
import SchoolChangePasswordForm from "./components/SchoolChangePasswordForm";
import SchoolSuccessTransition from "./components/SchoolSuccessTransition";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [userFieldName] = useState(() => 'usr_' + Math.random().toString(36).substring(2, 9));
  const [pwdFieldName] = useState(() => 'pwd_' + Math.random().toString(36).substring(2, 9));

  useEffect(() => {
    if (sessionStorage.getItem("force_change_password") === "true") {
      setStep("change_password");
      setPassword("");
      setError("يرجى تغيير كلمة المرور المؤقتة قبل الدخول إلى لوحة التحكم");
    } else {
      sessionStorage.removeItem("wesal_school_token");
      sessionStorage.removeItem("wesal_school_user_role");
      sessionStorage.removeItem("wesal_school_user_data");
    }
  }, []);

  const validateLoginForm = () => {
    let errors = {};
    let isValid = true;
    if (!username.trim()) { errors.username = "يرجى إدخال اسم المستخدم الخاص بالمدرسة"; isValid = false; }
    if (!password.trim()) { errors.password = "يرجى إدخال كلمة المرور"; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    setError("");
    setFormErrors({});
    sessionStorage.removeItem("wesal_school_token");
    sessionStorage.removeItem("force_change_password");

    try {
      const response = await api.post("/api/auth/school/sign-in", {
        username: username.trim(),
        password: password.trim(),
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        const decodedToken = parseJwtSafely(token);
        
        let isTempPassword = false;
        if (decodedToken) {
            const tmpFlag = decodedToken.tmp_pwd || decodedToken.temporaryPassword || decodedToken.IsTemporaryPassword;
            if (String(tmpFlag).toLowerCase() === "true") isTempPassword = true;
        }

        if (isTempPassword) {
          sessionStorage.setItem("wesal_school_token", token);
          sessionStorage.setItem("force_change_password", "true");
          setStep("change_password");
          toast("يجب عليك تأمين حسابك بكلمة مرور جديدة قبل الدخول", { icon: "🔒" });
        } else {
          const userDataToSave = {
            id: decodedToken?.nameid || decodedToken?.sub || decodedToken?.jti,
            name: decodedToken?.unique_name || decodedToken?.name || 'مدرسة',
            role: 'school'
          };
          
          login(userDataToSave, token); 
          if (onLogin) onLogin(response.data);
          
          toast.success("تم تسجيل الدخول بنجاح!");
          navigate("/dashboard"); 
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      const status = err.response?.status;
      const errorMsg = String(err.response?.data?.detail || err.response?.data?.title || err.response?.data?.message || err.response?.data || "").toLowerCase();

      if (status === 403 && (errorMsg.includes("temporary password") || errorMsg.includes("change password"))) {
        setStep("change_password");
        setError("");
        toast("يجب عليك تأمين حسابك بكلمة مرور جديدة قبل الدخول", { icon: "🔒" });
      } else if (status === 404) {
        setError("بيانات المدرسة غير مسجلة في النظام");
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswordChange = () => {
    let errors = {};
    let isValid = true;
    if (!password.trim()) { errors.currentPassword = "يرجى إدخال كلمة المرور الحالية"; isValid = false; }
    if (!newPassword.trim() || newPassword.length < 6) { errors.newPassword = "يجب أن تتكون كلمة المرور من 6 خانات على الأقل"; isValid = false; }
    if (!confirmPassword.trim() || newPassword !== confirmPassword) { errors.confirmPassword = "كلمتا المرور غير متطابقتين"; isValid = false; }
    setFormErrors(errors);
    return isValid;
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!validatePasswordChange()) return;

    setIsLoading(true);
    setError("");
    setFormErrors({});

    try {
      await api.patch("/api/users/change-password", { oldPassword: password, newPassword: newPassword });
      toast.success("تم تأمين الحساب وتغيير كلمة المرور بنجاح! يرجى تسجيل الدخول.");
      sessionStorage.removeItem("force_change_password");
      sessionStorage.removeItem("wesal_school_token");
      
      setStep("success_transition");
      setTimeout(() => {
        navigate("/", { replace: true }); 
        setStep("login");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
    } catch (err) {
      console.error("Change Password Error Details:", err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      step === 'login' ? handleLogin(e) : handleChangePassword(e);
    }
  };

  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (formErrors[fieldName]) {
        setFormErrors(prev => ({...prev, [fieldName]: null}));
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast("يرجى الاتصال بالدعم الفني لمحكمة الأسرة لاستعادة حسابك.", { icon: "ℹ️" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" dir="rtl" style={{ fontFamily: '"Times New Roman", "Traditional Arabic", serif', background: '#F5F5F5' }}>
      <div className="w-full max-w-[460px]">
        
        <SchoolHeader />

        {step === "login" && (
          <SchoolLoginForm 
            username={username} setUsername={setUsername} password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword} isLoading={isLoading} error={error} formErrors={formErrors}
            handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} handleLogin={handleLogin} handleForgotPassword={handleForgotPassword}
            userFieldName={userFieldName} pwdFieldName={pwdFieldName}
          />
        )}

        {step === "change_password" && (
          <SchoolChangePasswordForm 
            password={password} setPassword={setPassword} newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
            showPassword={showPassword} setShowPassword={setShowPassword} showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
            isLoading={isLoading} error={error} formErrors={formErrors} handleInputChange={handleInputChange} handleKeyPress={handleKeyPress} handleChangePassword={handleChangePassword}
          />
        )}

        {step === 'success_transition' && <SchoolSuccessTransition />}

        <SchoolFooter />
      </div>
    </div>
  );
}