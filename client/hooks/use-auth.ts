import { useState, useEffect } from "react";
import { User, AuthResponse } from "@shared/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth_user");
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
      return true; // 🔥 VERY IMPORTANT
    }

    return false;
  } catch (err) {
    return false;
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return { user, login, logout, isAdmin: user?.role === "admin" };
}
