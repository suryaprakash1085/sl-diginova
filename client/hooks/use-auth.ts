import { useState, useEffect } from "react";
import { User, AuthResponse } from "@shared/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

 const login = async (username: string, password: string) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      // store user if needed
      setUser(data.data);
      sessionStorage.setItem("auth_user", JSON.stringify(data.data));
      return true; // 🔥 VERY IMPORTANT
    }

    return false;
  } catch (err) {
    return false;
  }
};

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("auth_user");
  };

  return { user, login, logout, isAdmin: user?.role === "admin" };
}
