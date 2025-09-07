import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ جلب بيانات المستخدم من السيرفر عند تحميل الصفحة
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/profile`, {
          withCredentials: true, // مهم حتى يرسل الكوكي
        });
        setUserInfo(data);
      } catch (err) {
        setUserInfo(null); // ما فيش مستخدم مسجل
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ✅ تسجيل الدخول
  const login = async (email, password) => {
    await axios.post(
      `${API_URL}/api/users/login`,
      { email, password },
      { withCredentials: true }
    );
    // بعد تسجيل الدخول نجيب البروفايل
    const { data } = await axios.get(`${API_URL}/api/users/profile`, {
      withCredentials: true,
    });
    setUserInfo(data);
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    await axios.post(`${API_URL}/api/users/logout`, {}, { withCredentials: true });
    setUserInfo(null);
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// دالة مساعدة للوصول للمعلومات بسهولة
export const useAuth = () => useContext(AuthContext);

