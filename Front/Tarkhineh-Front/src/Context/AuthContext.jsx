// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // بارگذاری اطلاعات کاربر از localStorage در شروع
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("📦 storedUser از localStorage:", storedUser);
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log("✅ کاربر پیدا شد:", userData);
      } catch (error) {
        console.error("❌ خطا در parse کردن user:", error);
        localStorage.removeItem("user");
      }
    } else {
      console.log("❌ کاربری در localStorage وجود ندارد");
    }
    setLoading(false);
  }, []);

  // تابع ورود
const login = (userData, token) => {
  console.log("🔐 ورود کاربر:", userData);
  setUser(userData);
  setIsAuthenticated(true);
  localStorage.setItem("user", JSON.stringify(userData));
  if (token) {
    localStorage.setItem("token", token);
  }
};

  // تابع خروج
const logout = () => {
  console.log("🚪 خروج کاربر");
  setUser(null);
  setIsAuthenticated(false);
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

  // تابع به‌روزرسانی اطلاعات کاربر
  const updateUser = (userData) => {
    console.log("✏️ به‌روزرسانی کاربر:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};