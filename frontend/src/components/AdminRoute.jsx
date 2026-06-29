import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user } = useAuth();

  // 🔐 LOGIN YO‘Q BO‘LSA
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 👑 ADMIN EMAS BO‘LSA
  if (!user.is_staff) {
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
