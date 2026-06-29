import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [tokens, setTokens] = useState(() => ({
    access: localStorage.getItem("access") || "",
    refresh: localStorage.getItem("refresh") || "",
  }));

  // USER STORAGE
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // TOKEN STORAGE
  useEffect(() => {
    if (tokens.access) {
      localStorage.setItem("access", tokens.access);
      localStorage.setItem("token", tokens.access);
    } else {
      localStorage.removeItem("access");
      localStorage.removeItem("token");
    }

    if (tokens.refresh) {
      localStorage.setItem("refresh", tokens.refresh);
    } else {
      localStorage.removeItem("refresh");
    }
  }, [tokens]);

  // LOGIN
  const login = (userData, tokenData) => {
    setUser(userData);

    setTokens({
      access: tokenData?.access || "",
      refresh: tokenData?.refresh || "",
    });
  };

  // LOGOUT
  const logout = async () => {
    const refresh = localStorage.getItem("refresh");

    try {
      // optional backend blacklist logout
      if (refresh) {
        await api.post("/accounts/logout/", {
          refresh,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);

      setTokens({
        access: "",
        refresh: "",
      });

      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("token");

      window.location.href = "/";
    }
  };

  // PASSWORD UPDATED
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = {
        ...prev,
        ...updatedFields,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        updateUser,
        setUser,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
