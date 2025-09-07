import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { userInfo } = useAuth();

  if (!userInfo) {
    // المستخدم غير مسجل الدخول
    return <Navigate to="/login" />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    // المستخدم مسجل الدخول لكن ليس Admin
    return <Navigate to="/" />;
  }

  // المستخدم صالح للدخول
  return children;
}
