import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const THEMES = {
  night: {
    shellClass:
      "bg-gradient-to-br from-slate-950 via-rose-950 to-slate-950 text-slate-50",
  },
  day: {
    shellClass:
      "bg-gradient-to-br from-rose-50 via-rose-300 to-white text-slate-950",
  },
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("tf_theme" || "night");
  });

  useEffect(() => {
    localStorage.setItem("tf_theme", mode);
  }, [mode]);

  const value = useMemo(() => {
    const theme = THEMES[mode] || THEMES.night;
    const toggle = () => setMode((m) => (m === "night" ? "day" : "night"));
    return { mode, theme, setMode, toggle };
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
