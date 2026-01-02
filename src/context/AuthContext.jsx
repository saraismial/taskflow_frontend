import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("tfp_user");
    const storedAccess = localStorage.getItem("tfp_accessToken");
    const storedRefresh = localStorage.getItem("tfp_refreshToken");

    if (storedUser && storedAccess) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("tfp_user");
      }
      setAccessToken(storedAccess);
      if (storedRefresh) setRefreshToken(storedRefresh);
    }
    setLoading(false);
  }, []);

  // Helpers
  const saveAuth = ({ user, tokens }) => {
    setUser(user);
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken || null);

    localStorage.setItem("tfp_user", JSON.stringify(user));
    localStorage.setItem("tfp_accessToken", tokens.accessToken);

    if (tokens.refreshToken) {
      localStorage.setItem("tfp_refreshToken", tokens.refreshToken);
    } else {
      localStorage.removeItem("tfp_refreshToken");
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
    setSessionExpired(false);
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

  const clearSessionExpired = () => setSessionExpired(false);

  // Axios response interceptor, autorefresh on 401
  useEffect(() => {
    let isRefreshing = false;
    let refreshPromise = null;

    const interceptorId = client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const ogReq = error.config || {};

        const url = ogReq.url || "";
        const isAuthRoute =
          url.includes("/auth/login") ||
          url.includes("/auth/register") ||
          url.includes("/auth/refresh");

        if (status !== 401 || isAuthRoute) {
          return Promise.reject(error);
        }

        // Prevent infinite loops, if retried once already => just log out
        if (ogReq._retry) {
          logout();
          setSessionExpired(true);
          return Promise.reject(error);
        }

        const storedRefreshToken =
          refreshToken || localStorage.getItem("tfp_refreshToken");

        if (!storedRefreshToken) {
          logout();
          setSessionExpired(true);
          return Promise.reject(error);
        }

        ogReq._retry = true;

        try {
          if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = client.post("/auth/refresh", {
              refreshToken: storedRefreshToken,
            });
          }

          const refreshRes = await refreshPromise;
          isRefreshing = false;

          const token = refreshRes.data.tokens || refreshRes.data || {};

          const newAccess = tokens.accessToken;
          const newRefresh = tokens.refreshToken || storedRefreshToken;

          if (!newAccess) {
            throw new Error("No access token returned from refresh");
          }

          setAccessToken(newAccess);
          setRefreshToken(newRefresh);
          localStorage.setItem("tfp_accessToken", newAccess);
          localStorage.setItem("tfp_refreshToken", newRefresh);

          ogReq.headers = {
            ...(ogReq.headers || {}),
            Authorization: `Bearer ${newAccess}`,
          };

          return client(ogReq);
        } catch (refreshErr) {
          console.warn("Refresh failed, logging out:", refreshErr);
          isRefreshing = false;
          logout();
          setSessionExpired(true);
          return Promise.reject(refreshErr);
        }
      }
    );

    return () => {
      client.interceptors.response.eject(interceptorId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    register,
    login,
    logout,
    sessionExpired,
    clearSessionExpired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be within AuthProvider");
  return context;
}
