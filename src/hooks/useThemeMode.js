import { useContext } from "react";
import ThemeModeContext from "../app/contexts/ThemeModeContext";

export default function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
}
