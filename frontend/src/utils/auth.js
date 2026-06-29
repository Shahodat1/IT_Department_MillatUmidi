export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access");
};

export const isAdmin = () => {
  const user = getUser();
  return user?.is_staff;
};

export const isTeacher = () => {
  const user = getUser();
  return !!user?.teacher_id;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};
