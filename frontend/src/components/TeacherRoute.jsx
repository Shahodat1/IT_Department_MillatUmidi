import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TeacherRoute({ children }) {
  const { user } = useAuth();

  // 🔐 LOGIN YO‘Q
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 👨‍🏫 TEACHER EMAS
  if (!user.teacher_id) {
    return <Navigate to="/" />;
  }

  return children;
}

export default TeacherRoute;
