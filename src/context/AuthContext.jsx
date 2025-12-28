import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("tfp_user");
    const storedAccess = localStorage.getItem("tfp_accessToken");
    const storedRefresh = localStorage.getItem("tfp_refreshToken");

    if (storedUser && storedAccess) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh || null);
    }
    setLoading(false);
  }, []);

  const saveAuth = ({ user, tokens }) => {
    setUser(user);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken || null);

    localStorage.setItem("tfp_user", JSON.stringify(user));
    localStorage.setItem("tfp_accessToken", tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem("tfp_refreshToken", tokens.refreshToken);
    }
  };

  const register = async (name, email, password) => {
    const res = await client.post("/auth/register", { name, email, password });
    saveAuth(res.data);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await client.post("/auth/login", { email, password });
    saveAuth(res.data);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("tfp_user");
    localStorage.removeItem("tfp_accessToken");
    localStorage.removeItem("tfp_refreshToken");
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
}
